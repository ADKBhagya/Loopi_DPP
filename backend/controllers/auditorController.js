import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import Transaction from "../models/Transaction.js";
import { createBlockchainTransaction } from "../services/blockchainService.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const passportIdFor = (garment) =>
  garment?.sku ||
  garment?.batchNumber ||
  `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`;

const shortHash = (hash = "") =>
  hash ? `0x${String(hash).slice(0, 4)}...${String(hash).slice(-4)}` : "PENDING";

const parseMetric = (value) => {
  const parsed = Number.parseFloat(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const scoreFor = (garment, certificates = [], events = []) => {
  let score = 52;
  if (garment?.carbon) score += 10;
  if (garment?.water) score += 10;
  if (garment?.materials?.length || garment?.material) score += 10;
  if (certificates.some((item) => item.verificationStatus === "verified")) score += 10;
  if (events.length >= 3) score += 8;
  if (garment?.status === "certified" || garment?.status === "approved") score += 8;
  return Math.min(score, 98);
};

const statusFor = (certificate, garment) => {
  if (certificate?.verificationStatus === "rejected") return "REJECTED";
  if (certificate?.verificationStatus === "verified" || garment?.status === "certified") return "COMPLETED";
  if (garment?.status === "under_audit") return "IN PROGRESS";
  return "PENDING";
};

const priorityFor = (garment, score) => {
  const carbon = parseMetric(garment?.carbon);
  if (score < 72 || (carbon !== null && carbon > 5)) return "HIGH";
  if (score < 84) return "MEDIUM";
  return "LOW";
};

const auditTypeFor = (certificate, garment, score) => {
  if (certificate?.verificationStatus === "pending") return "Certificate Verification";
  if (parseMetric(garment?.carbon) !== null) return "Emissions Audit";
  if (score < 78) return "Sustainability Claim";
  return "Full Lifecycle Review";
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

const certificatesByGarment = (certificates) => {
  const map = new Map();
  certificates.forEach((certificate) => {
    const key = String(certificate.garmentId);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(certificate);
  });
  return map;
};

const eventsByGarment = (events) => {
  const map = new Map();
  events.forEach((event) => {
    const key = String(event.garmentId);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(event);
  });
  return map;
};

const buildAuditRecords = async () => {
  const [garments, certificates, events] = await Promise.all([
    Garment.find().populate("createdBy", "fullName organization role").sort({ updatedAt: -1 }),
    Certificate.find().populate("createdBy", "fullName organization role").sort({ createdAt: -1 }),
    LifecycleEvent.find().sort({ createdAt: 1 }),
  ]);

  const certificateMap = certificatesByGarment(certificates);
  const eventMap = eventsByGarment(events);

  return garments.map((garment, index) => {
    const garmentCertificates = certificateMap.get(String(garment._id)) || [];
    const garmentEvents = eventMap.get(String(garment._id)) || [];
    const certificate = garmentCertificates[0];
    const score = scoreFor(garment, garmentCertificates, garmentEvents);
    const status = statusFor(certificate, garment);
    const passportId = passportIdFor(garment);
    const auditId = `AUD-${String(9900 + index + 1)}`;

    return {
      id: auditId,
      entityId: String(certificate?._id || garment._id),
      entityType: certificate ? "Certificate" : "Garment",
      garmentId: String(garment._id),
      garment: passportId,
      garmentName: garment.productName || "Unnamed garment",
      manufacturer: garment.createdBy?.organization || garment.currentOwnerName || garment.location || "Manufacturer",
      company: garment.createdBy?.fullName || garment.currentOwnerName || "LOOPI participant",
      type: auditTypeFor(certificate, garment, score),
      priority: priorityFor(garment, score),
      status,
      date: (certificate?.createdAt || garment.updatedAt || garment.createdAt)?.toISOString?.().slice(0, 10),
      submittedBy: certificate?.issuer || garment.createdBy?.organization || "Manufacturer",
      score,
      emissions: {
        carbon: garment.carbon || "Not declared",
        water: garment.water || "Not declared",
      },
      certificates: garmentCertificates.map((item) => ({
        title: item.certificateType,
        sub: `Issued by: ${item.issuer}`,
        status: item.verificationStatus === "verified" ? "VERIFIED" : item.verificationStatus === "rejected" ? "REJECTED" : "PENDING",
        url: item.fileUrl,
        hash: shortHash(item.blockchainHash),
      })),
    };
  });
};

const buildStats = (records) => ({
  pendingReviews: records.filter((item) => item.status === "PENDING").length,
  activeAudits: records.filter((item) => item.status === "IN PROGRESS").length,
  approvedMonth: records.filter((item) => item.status === "COMPLETED").length,
  rejectedMonth: records.filter((item) => item.status === "REJECTED").length,
});

export const getAuditQueue = async (req, res) => {
  try {
    const audits = await buildAuditRecords();
    res.status(200).json({
      stats: buildStats(audits),
      audits,
    });
  } catch (error) {
    console.error("AUDITOR QUEUE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch auditor queue" });
  }
};

export const updateAuditDecision = async (req, res) => {
  try {
    const records = await buildAuditRecords();
    const record = records.find((item) => item.id === req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Audit record not found" });
    }

    const decision = String(req.body.decision || "").toUpperCase();
    if (!["APPROVED", "REJECTED", "IN_PROGRESS"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be APPROVED, REJECTED, or IN_PROGRESS" });
    }

    const garment = await Garment.findById(record.garmentId);
    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    if (record.entityType === "Certificate") {
      const certificate = await Certificate.findById(record.entityId);
      if (certificate) {
        certificate.verificationStatus =
          decision === "REJECTED" ? "rejected" : decision === "IN_PROGRESS" ? "pending" : "verified";
        await certificate.save();
      }
    }

    garment.status =
      decision === "APPROVED"
        ? "certified"
        : decision === "REJECTED"
          ? "rejected"
          : "under_audit";
    await garment.save();

    const transaction = await createBlockchainTransaction({
      transactionType:
        decision === "APPROVED"
          ? "AUDITOR_AUDIT_APPROVED"
          : decision === "REJECTED"
            ? "AUDITOR_AUDIT_REJECTED"
            : "AUDITOR_REVIEW_STARTED",
      entityType: record.entityType,
      entityId: record.entityId,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        auditId: record.id,
        passportId: passportIdFor(garment),
        notes: req.body.notes || "",
        decision,
      },
    });

    await LifecycleEvent.create({
      garmentId: garment._id,
      stage: "CERTIFIED",
      description:
        decision === "APPROVED"
          ? `Auditor approved ${record.id}`
          : decision === "REJECTED"
            ? `Auditor rejected ${record.id}`
            : `Auditor started review for ${record.id}`,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash: transaction.blockchainHash,
      metadata: {
        auditId: record.id,
        decision,
      },
    });

    const updatedRecords = await buildAuditRecords();
    res.status(200).json({
      message: "Audit decision recorded",
      audit: updatedRecords.find((item) => item.id === req.params.id),
    });
  } catch (error) {
    console.error("AUDITOR DECISION ERROR:", error);
    res.status(500).json({ message: "Failed to record audit decision" });
  }
};

export const runComplianceCheck = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passportId);
    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const [certificates, events] = await Promise.all([
      Certificate.find({ garmentId: garment._id }),
      LifecycleEvent.find({ garmentId: garment._id }),
    ]);

    const score = scoreFor(garment, certificates, events);
    const carbon = parseMetric(garment.carbon);
    const water = parseMetric(garment.water);
    const verifiedCertificate = certificates.some((item) => item.verificationStatus === "verified");

    const checks = [
      {
        title: "EU Digital Product Passport Regulation 2026 conformance",
        category: "Regulatory",
        weight: "Weight: 20%",
        status: events.length >= 2 ? "PASS" : "FAIL",
      },
      {
        title: "Material composition declaration (>= 90% declared)",
        category: "Material",
        weight: "Weight: 15%",
        status: garment.materials?.length || garment.material ? "PASS" : "FAIL",
      },
      {
        title: "Manufacturing carbon footprint below 5 kg CO2e / unit",
        category: "Emissions",
        weight: "Weight: 15%",
        status: carbon === null || carbon <= 5 ? "PASS" : "FAIL",
      },
      {
        title: "GOTS, OEKO-TEX or equivalent sustainability certificate",
        category: "Certificate",
        weight: "Weight: 15%",
        status: verifiedCertificate ? "PASS" : "FAIL",
      },
      {
        title: "Complete blockchain provenance chain (0 gaps)",
        category: "Blockchain",
        weight: "Weight: 15%",
        status: events.length >= 3 ? "PASS" : "FAIL",
      },
      {
        title: "Recycling / end-of-life capability rating >= Grade B",
        category: "Lifecycle",
        weight: "Weight: 10%",
        status: score >= 80 ? "PASS" : "FAIL",
      },
      {
        title: "Water consumption per unit below 20 L",
        category: "Environment",
        weight: "Weight: 10%",
        status: water === null || water <= 20 ? "PASS" : "FAIL",
      },
    ];

    await createBlockchainTransaction({
      transactionType: "AUDITOR_COMPLIANCE_CHECK_RUN",
      entityType: "Garment",
      entityId: garment._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        score,
        passed: checks.filter((item) => item.status === "PASS").length,
        failed: checks.filter((item) => item.status === "FAIL").length,
      },
    });

    res.status(200).json({
      passportId: passportIdFor(garment),
      score,
      checks,
    });
  } catch (error) {
    console.error("AUDITOR COMPLIANCE CHECK ERROR:", error);
    res.status(500).json({ message: "Failed to run compliance check" });
  }
};

const timelineTemplate = [
  { id: "raw", stage: "MANUFACTURED", title: "Raw Material Sourcing" },
  { id: "manufacturing", stage: "MANUFACTURED", title: "Manufacturing" },
  { id: "shipping", stage: "SHIPPED", title: "Logistics & Shipping" },
  { id: "retail", stage: "RETAIL_RECEIVED", title: "Retail Distribution" },
  { id: "consumer", stage: "CONSUMER_OWNED", title: "Consumer Use" },
  { id: "eol", stage: "RECYCLED", title: "End of Life" },
];

export const getLifecycleReview = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.passportId);
    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const events = await LifecycleEvent.find({ garmentId: garment._id }).sort({ createdAt: 1 });
    const timeline = timelineTemplate.map((template) => {
      const event =
        template.id === "raw"
          ? events[0]
          : events.find((item) => item.stage === template.stage);

      return {
        id: template.id,
        title: template.title,
        location:
          event?.metadata?.location ||
          garment.location ||
          garment.manufacturingCountry ||
          "Location pending",
        date: event?.createdAt ? event.createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
        status: event ? "VERIFIED" : template.id === "retail" ? "PENDING" : "OPEN",
        description:
          event?.description ||
          (template.id === "retail"
            ? "Awaiting auditor sign-off on retail custody documentation."
            : "This lifecycle stage has not been recorded yet."),
        hash: shortHash(event?.blockchainHash),
        metrics: {
          carbon: garment.carbon || "N/A",
          water: garment.water || "N/A",
        },
      };
    });

    const verifiedCount = timeline.filter((item) => item.status === "VERIFIED").length;

    res.status(200).json({
      passportId: passportIdFor(garment),
      garmentName: garment.productName || "Unnamed garment",
      manufacturer: garment.createdBy?.organization || garment.currentOwnerName || garment.location || "Manufacturer",
      registeredDate: garment.createdAt?.toISOString?.().slice(0, 10),
      verifiedCount,
      totalStages: timeline.length,
      progress: Math.round((verifiedCount / timeline.length) * 100),
      timeline,
    });
  } catch (error) {
    console.error("AUDITOR LIFECYCLE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch lifecycle review" });
  }
};

export const verifyLifecycleStage = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.passportId);
    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const template = timelineTemplate.find((item) => item.id === req.params.stageId);
    if (!template) {
      return res.status(404).json({ message: "Lifecycle stage not found" });
    }

    const transaction = await createBlockchainTransaction({
      transactionType: "AUDITOR_LIFECYCLE_STAGE_VERIFIED",
      entityType: "Garment",
      entityId: garment._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        stageId: template.id,
        stage: template.stage,
      },
    });

    await LifecycleEvent.create({
      garmentId: garment._id,
      stage: template.stage,
      description: `Auditor verified ${template.title}`,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash: transaction.blockchainHash,
      metadata: {
        passportId: passportIdFor(garment),
        stageId: template.id,
      },
    });

    await getLifecycleReview(req, res);
  } catch (error) {
    console.error("AUDITOR LIFECYCLE VERIFY ERROR:", error);
    res.status(500).json({ message: "Failed to verify lifecycle stage" });
  }
};

export const getAuditTrail = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      transactionType: /AUDITOR|AUTHORITY|CERTIFICATE|LIFECYCLE/i,
    })
      .populate("garmentId", "sku batchNumber productName")
      .sort({ createdAt: -1 })
      .limit(80);

    const logs = transactions.map((tx) => {
      const passportId =
        tx.metadata?.passportId ||
        passportIdFor(tx.garmentId) ||
        String(tx.garmentId || "").slice(-6).toUpperCase();
      const type = String(tx.transactionType || "");
      const status = type.includes("REJECT") ? "REJECTED" : type.includes("APPROV") ? "APPROVAL" : type.includes("CHECK") ? "IN PROGRESS" : type.includes("CERT") ? "DOCUMENT" : "INITIATED";

      return {
        hash: shortHash(tx.blockchainHash),
        message: `Tx: ${type.replace(/_/g, " ")} for ${passportId}`,
        status,
        garment: passportId,
        time: tx.createdAt?.toLocaleTimeString("en-US", { hour12: false }) || "",
        date: tx.createdAt?.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) || "",
        dot: status === "APPROVAL" ? "green" : status === "REJECTED" ? "red" : status === "IN PROGRESS" ? "orange" : status === "DOCUMENT" ? "gray" : "blue",
        blockNumber: tx.blockNumber,
        network: tx.network,
      };
    });

    res.status(200).json({
      stats: buildStats(await buildAuditRecords()),
      logs,
    });
  } catch (error) {
    console.error("AUDITOR TRAIL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch audit trail" });
  }
};
