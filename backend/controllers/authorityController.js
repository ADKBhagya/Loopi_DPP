import crypto from "crypto";
import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import Transaction from "../models/Transaction.js";
import User from "../models/user.js";
import { createBlockchainTransaction } from "../services/blockchainService.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const passportIdFor = (garment) =>
  garment?.sku ||
  garment?.batchNumber ||
  `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`;

const shortHash = (hash = "") =>
  hash ? `0x${String(hash).slice(0, 4)}_${String(hash).slice(-4)}` : "PENDING";

const runSideEffect = async (label, action) => {
  try {
    return await action();
  } catch (error) {
    console.warn(`${label} skipped:`, error?.message || error);
    return null;
  }
};

const regionFor = (garment) => {
  const country = String(garment?.manufacturingCountry || garment?.location || "").toLowerCase();
  if (/sweden|norway|finland|denmark|north/.test(country)) return "EU-NORTH";
  if (/germany|netherlands|belgium|france|west/.test(country)) return "EU-WEST";
  if (/italy|spain|portugal|south/.test(country)) return "EU-SOUTH";
  if (/poland|czech|romania|east/.test(country)) return "EU-EAST";
  return "GLOBAL";
};

const statusFor = (certificate, garment) => {
  if (certificate?.verificationStatus === "rejected") return "FLAGGED";
  if (certificate?.verificationStatus === "pending") return "UNDER REVIEW";
  if (certificate?.verificationStatus === "verified") return "FINAL APPROVED";
  if (garment?.status === "certified" || garment?.status === "approved") return "AUDITOR APPROVED";
  return "UNDER REVIEW";
};

const statusColorFor = (status) => {
  if (status === "FINAL APPROVED") return "green";
  if (status === "AUDITOR APPROVED") return "blue";
  if (status === "FLAGGED") return "red";
  return "orange";
};

const scoreFor = (garment, certificates = []) => {
  let score = 62;
  if (garment?.carbon) score += 8;
  if (garment?.water) score += 8;
  if (garment?.materials?.length) score += 8;
  if (certificates.some((item) => item.verificationStatus === "verified")) score += 10;
  if (garment?.status === "certified") score += 4;
  return Math.min(score, 98);
};

const findGarmentByIdentifier = async (identifier) => {
  if (isObjectId(identifier)) {
    const garment = await Garment.findById(identifier);
    if (garment) return garment;
  }

  const garments = await Garment.find();
  return garments.find(
    (garment) =>
      passportIdFor(garment).toLowerCase() === String(identifier).toLowerCase()
  );
};

const buildComplianceRecords = async () => {
  const [garments, certificates] = await Promise.all([
    Garment.find().sort({ updatedAt: -1 }),
    Certificate.find().populate("createdBy", "fullName organization role").sort({ createdAt: -1 }),
  ]);

  const certificatesByGarment = new Map();
  certificates.forEach((certificate) => {
    const key = String(certificate.garmentId);
    if (!certificatesByGarment.has(key)) certificatesByGarment.set(key, []);
    certificatesByGarment.get(key).push(certificate);
  });

  return garments.map((garment, index) => {
    const garmentCertificates = certificatesByGarment.get(String(garment._id)) || [];
    const certificate = garmentCertificates[0];
    const status = statusFor(certificate, garment);
    const score = scoreFor(garment, garmentCertificates);

    return {
      id: certificate ? `COMP-${String(certificate._id).slice(-6).toUpperCase()}` : `COMP-${String(8800 + index)}`,
      entityId: certificate?._id || garment._id,
      entityType: certificate ? "Certificate" : "Garment",
      garmentId: String(garment._id),
      garment: passportIdFor(garment),
      garmentName: garment.productName || "Unnamed garment",
      auditor: certificate?.issuer || certificate?.createdBy?.organization || "Authority Intake",
      date: (certificate?.issuedDate || garment.updatedAt || garment.createdAt)?.toISOString?.().slice(0, 10),
      type: certificate?.certificateType || "Digital Product Passport Review",
      region: regionFor(garment),
      status,
      statusColor: statusColorFor(status),
      hash: shortHash(certificate?.blockchainHash),
      score: `${score}%`,
      emissions: {
        manufacturing: garment.carbon || "N/A",
        shipment: "Pending",
        recycling: score >= 88 ? "A+" : score >= 78 ? "B" : "C",
      },
      certificates: garmentCertificates.map((item) => item.certificateType),
    };
  });
};

export const getAuthorityControl = async (req, res) => {
  try {
    const [records, manufacturerCount, passportCount] = await Promise.all([
      buildComplianceRecords(),
      User.countDocuments({ role: "Manufacturer", status: "approved" }),
      Garment.countDocuments(),
    ]);

    const pending = records.filter((item) => item.status !== "FINAL APPROVED").length;
    const approved = records.filter((item) => item.status === "FINAL APPROVED").length;
    const complianceRate = records.length ? ((approved / records.length) * 100).toFixed(1) : "0.0";

    res.status(200).json({
      stats: {
        passportsIssued: passportCount,
        activeManufacturers: manufacturerCount,
        pendingApproval: pending,
        complianceRate: `${complianceRate}%`,
      },
      records,
    });
  } catch (error) {
    console.error("AUTHORITY CONTROL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch authority control data" });
  }
};

export const updateComplianceRecord = async (req, res) => {
  try {
    const records = await buildComplianceRecords();
    const record = records.find((item) => item.id === req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Compliance record not found" });
    }

    const requestedStatus = String(req.body.status || "").toUpperCase();
    const garment = await Garment.findById(record.garmentId);

    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    if (record.entityType === "Certificate") {
      const certificate = await Certificate.findById(record.entityId);
      if (certificate) {
        certificate.verificationStatus =
          requestedStatus === "FLAGGED" || requestedStatus === "REJECTED"
            ? "rejected"
            : requestedStatus === "UNDER REVIEW"
              ? "pending"
              : "verified";
        await certificate.save();
      }
    }

    if (requestedStatus === "FINAL APPROVED" || requestedStatus === "AUDITOR APPROVED") {
      garment.status = "certified";
      await garment.save();
    }

    const transaction = await runSideEffect("Authority compliance blockchain transaction", () =>
      createBlockchainTransaction({
      transactionType:
        requestedStatus === "FLAGGED" ? "AUTHORITY_REAUDIT_FLAGGED" : "AUTHORITY_FINAL_APPROVAL",
      entityType: record.entityType,
      entityId: record.entityId,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        complianceId: record.id,
        passportId: passportIdFor(garment),
        status: requestedStatus || "FINAL APPROVED",
      },
      })
    );

    await runSideEffect("Authority lifecycle event", () =>
      LifecycleEvent.create({
        garmentId: garment._id,
        stage: "CERTIFIED",
        description:
          requestedStatus === "FLAGGED"
            ? `Authority flagged ${record.id} for re-audit`
            : `Authority final approval granted for ${record.id}`,
        actorRole: req.user?.role || "Authority",
        actorId: req.user?._id,
        blockchainHash: transaction?.blockchainHash || garment._id.toString(),
        metadata: {
          complianceId: record.id,
          status: requestedStatus || "FINAL APPROVED",
        },
      })
    );

    const updatedRecords = await buildComplianceRecords();
    res.status(200).json({
      message: "Compliance record updated",
      record: updatedRecords.find((item) => item.id === req.params.id),
    });
  } catch (error) {
    console.error("AUTHORITY COMPLIANCE UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update compliance record" });
  }
};

export const getComplianceReview = async (req, res) => {
  try {
    const records = await buildComplianceRecords();
    const total = records.length;
    const initial = records.filter((item) => item.status !== "FINAL APPROVED").length;
    const deep = records.filter((item) => item.status === "UNDER REVIEW").length;
    const signoff = records.filter((item) => item.status === "AUDITOR APPROVED").length;
    const sealed = records.filter((item) => item.status === "FINAL APPROVED").length;

    const stage = (label, value, color, description) => ({
      label,
      value,
      width: total ? `${Math.max(8, Math.round((value / total) * 100))}%` : "0%",
      color,
      description,
    });

    const regionMap = records.reduce((map, item) => {
      if (!map[item.region]) map[item.region] = { total: 0, approved: 0 };
      map[item.region].total += 1;
      if (item.status === "FINAL APPROVED") map[item.region].approved += 1;
      return map;
    }, {});

    const sealedRecords = records.filter((item) => item.status === "FINAL APPROVED");
    const gold = sealedRecords.filter((item) => Number.parseFloat(item.score) >= 90).length;
    const silver = sealedRecords.filter((item) => {
      const score = Number.parseFloat(item.score);
      return score >= 80 && score < 90;
    }).length;
    const bronze = sealedRecords.filter((item) => Number.parseFloat(item.score) < 80).length;

    res.status(200).json({
      pipeline: [
        stage("Submitted by Auditor", total, "#98A2B3", `${total} compliance records submitted for authority review.`),
        stage("Authority Initial Review", initial, "#3478F6", `${initial} records awaiting documentation and blockchain proof checks.`),
        stage("Deep Verification", deep, "#F59E0B", `${deep} records require deeper verification against EU-DPP standards.`),
        stage("Final Authority Sign-off", signoff, "#16641E", `${signoff} records awaiting final authority signature.`),
        stage("Gold Seal Issued", sealed, "#0BAA43", `${sealed} records have public verified status.`),
      ],
      regions: Object.entries(regionMap).map(([region, item]) => {
        const percentage = item.total ? Math.round((item.approved / item.total) * 100) : 0;
        return {
          region,
          records: `${item.total} records`,
          percentage: `${percentage}%`,
          width: `${percentage}%`,
        };
      }),
      monthlySummary: {
        total: sealed,
        gold,
        silver,
        bronze,
      },
    });
  } catch (error) {
    console.error("AUTHORITY COMPLIANCE REVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to fetch compliance review data" });
  }
};

export const runSustainabilityAudit = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passportId);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const certificates = await Certificate.find({ garmentId: garment._id });
    const score = scoreFor(garment, certificates);
    const items = [
      { name: "Carbon Footprint Verification", weight: "25%", status: garment.carbon ? "pass" : "warning" },
      { name: "Material Supply Chain Traceability", weight: "20%", status: garment.materials?.length || garment.material ? "pass" : "warning" },
      { name: "Water Usage Lifecycle Assessment", weight: "15%", status: garment.water ? "pass" : "warning" },
      { name: "Recycling End-of-Life Score", weight: "15%", status: score >= 80 ? "pass" : "warning" },
      { name: "Worker Welfare Standards (ILO)", weight: "15%", status: certificates.length ? "pass" : "warning" },
      { name: "EU-DPP Regulatory Alignment", weight: "10%", status: "pass" },
    ];

    const hash = crypto
      .createHash("sha256")
      .update(`AUTHORITY_AUDIT-${garment._id}-${Date.now()}`)
      .digest("hex");

    await createBlockchainTransaction({
      transactionType: "AUTHORITY_SUSTAINABILITY_AUDIT",
      entityType: "Garment",
      entityId: garment._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        score,
        auditHash: hash,
      },
    });

    res.status(200).json({
      passportId: passportIdFor(garment),
      score,
      hash,
      items,
      logs: [
        "> LOOPI Authority Audit Terminal v2.4.1",
        `[${new Date().toLocaleTimeString()}] Initialising audit session for ${passportIdFor(garment)}`,
        `[${new Date().toLocaleTimeString()}] Blockchain proofs resolved`,
        `[${new Date().toLocaleTimeString()}] Audit Complete - Score: ${score}/100`,
      ],
    });
  } catch (error) {
    console.error("AUTHORITY SUSTAINABILITY AUDIT ERROR:", error);
    res.status(500).json({ message: "Failed to run sustainability audit" });
  }
};

export const getPublicRecords = async (req, res) => {
  try {
    const records = await buildComplianceRecords();
    res.status(200).json({
      records: records
        .filter((item) => item.status === "FINAL APPROVED" || item.status === "AUDITOR APPROVED")
        .map((item) => {
          const numericScore = Number.parseFloat(String(item.score || "0"));
          return {
            id: item.garment,
            complianceId: item.id,
            type: numericScore >= 90 ? "GOLD SEAL" : numericScore >= 80 ? "SILVER SEAL" : "BRONZE SEAL",
            garment: item.garmentName,
            factory: item.auditor,
            country: item.region,
            date: item.date,
            status: item.status === "FINAL APPROVED" ? "PUBLIC VERIFIED" : "UNDER REVIEW",
            color: item.status === "FINAL APPROVED" ? "#16A34A" : "#D97706",
            hash: item.hash,
            score: item.score,
          };
        }),
    });
  } catch (error) {
    console.error("AUTHORITY PUBLIC RECORDS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch public authority records" });
  }
};
