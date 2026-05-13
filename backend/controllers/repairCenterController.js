import crypto from "crypto";
import mongoose from "mongoose";

import ConsumerAction from "../models/ConsumerAction.js";
import Certificate from "../models/Certificate.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import RecyclingProcess from "../models/RecyclingProcess.js";
import RepairService from "../models/RepairService.js";
import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";
import { createBlockchainTransaction } from "../services/blockchainService.js";
import { saveUploadedFile } from "../services/fileStorageService.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const passportIdFor = (garment) =>
  garment?.sku ||
  garment?.batchNumber ||
  `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`;

const hashFor = (...parts) =>
  crypto
    .createHash("sha256")
    .update(parts.filter(Boolean).join("-"))
    .digest("hex");

const findGarmentByIdentifier = async (identifier) => {
  if (isObjectId(identifier)) {
    const garment = await Garment.findById(identifier);
    if (garment) return garment;
  }

  const garments = await Garment.find();
  return garments.find(
    (garment) =>
      passportIdFor(garment).toLowerCase() === String(identifier).toLowerCase() ||
      String(garment.productName || "").toLowerCase() ===
        String(identifier).toLowerCase() ||
      String(garment.productName || "")
        .toLowerCase()
        .includes(String(identifier).toLowerCase())
  );
};

const materialFor = (garment) => {
  if (Array.isArray(garment?.materials) && garment.materials.length) {
    return garment.materials.join(", ");
  }

  return garment?.material || "Material pending";
};

const gradeFor = (garment, repairs, certificates, recycling) => {
  let score = 70;
  if (certificates.some((item) => item.verificationStatus === "verified")) score += 10;
  if (repairs.some((item) => item.status === "COMPLETED")) score += 10;
  if (recycling.length) score += 5;
  if (garment?.status === "certified") score += 5;

  if (score >= 92) return "Grade A+";
  if (score >= 82) return "Grade A";
  if (score >= 72) return "Grade B+";
  return "Grade B";
};

const repairStatusFor = (repairs) => {
  if (!repairs.length) return "No repairs";
  if (repairs.some((item) => item.status === "IN PROGRESS")) return "In progress";
  if (repairs.some((item) => item.status === "QUEUED")) return "Queued";
  return "Repaired";
};

const shortHash = (value = "") =>
  value ? `${String(value).slice(0, 10)}...${String(value).slice(-6)}` : "Pending";

const buildPassportPayload = async (garment, { compact = false } = {}) => {
  const [repairs, certificates, lifecycle, transactions, shipments, recycling] =
    await Promise.all([
      RepairService.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
      Certificate.find({ garmentId: garment._id }).sort({ issuedDate: -1 }),
      LifecycleEvent.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
      Transaction.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
      Shipment.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
      RecyclingProcess.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
    ]);

  const id = passportIdFor(garment);
  const material = materialFor(garment);
  const latestHash =
    transactions[0]?.blockchainHash ||
    lifecycle[0]?.blockchainHash ||
    repairs[0]?.blockchainHash ||
    certificates[0]?.blockchainHash ||
    "";

  const payload = {
    id,
    garmentId: garment._id,
    garment: garment.productName || "Unnamed garment",
    brand:
      garment.createdBy?.organization ||
      garment.currentOwnerName ||
      garment.manufacturingCountry ||
      garment.location ||
      "LOOPI",
    material,
    materials: Array.isArray(garment.materials) ? garment.materials : [],
    grade: gradeFor(garment, repairs, certificates, recycling),
    repairs: `${repairs.length} service${repairs.length === 1 ? "" : "s"}`,
    co2: garment.carbon ? `${garment.carbon} kg` : "N/A",
    water: garment.water ? `${garment.water}L` : "N/A",
    repairStatus: repairStatusFor(repairs),
    repairCount: repairs.length,
    verified:
      garment.status === "certified" ||
      certificates.some((item) => item.verificationStatus === "verified"),
    imageUrl: garment.imageUrl,
    status: garment.status,
    location: garment.location || shipments[0]?.currentLocation || "N/A",
    productionDate: garment.productionDate?.toISOString?.().slice(0, 10),
    batchNumber: garment.batchNumber,
    sku: garment.sku,
    hash: latestHash,
    hashShort: shortHash(latestHash),
    certificateCount: certificates.length,
    lifecycleCount: lifecycle.length,
    shipmentCount: shipments.length,
    recyclingCount: recycling.length,
  };

  if (compact) return payload;

  return {
    ...payload,
    certificates: certificates.map((item) => ({
      id: item._id,
      type: item.certificateType,
      issuer: item.issuer,
      status: item.verificationStatus,
      fileName: item.fileName,
      fileUrl: item.fileUrl,
      date: item.issuedDate?.toISOString?.().slice(0, 10),
      hash: item.blockchainHash,
    })),
    repairHistory: repairs.map(formatService),
    lifecycle: lifecycle.map((item) => ({
      id: item._id,
      stage: item.stage,
      description: item.description,
      actorRole: item.actorRole,
      date: item.createdAt?.toISOString?.().slice(0, 10),
      hash: item.blockchainHash,
      metadata: item.metadata,
    })),
    transactions: transactions.map((item) => ({
      id: item._id,
      type: item.transactionType,
      status: item.status,
      network: item.network,
      blockNumber: item.blockNumber,
      gasUsed: item.gasUsed,
      date: item.createdAt?.toISOString?.().slice(0, 10),
      hash: item.blockchainHash,
      explorerUrl: item.explorerUrl,
    })),
    shipments: shipments.map((item) => ({
      id: item.shipmentId || item._id,
      from: item.from,
      to: item.to,
      transport: item.transport,
      provider: item.provider,
      status: item.status,
      currentLocation: item.currentLocation,
      co2: item.co2,
      date: item.createdAt?.toISOString?.().slice(0, 10),
    })),
    recycling: recycling.map((item) => ({
      id: item.processId,
      stage: item.stage,
      credits: item.credits,
      weight: item.weight,
      date: item.createdAt?.toISOString?.().slice(0, 10),
      hash: item.blockchainHash,
    })),
  };
};

const nextServiceId = async () => {
  const latest = await RepairService.findOne({ serviceId: /^REP-/ }).sort({
    createdAt: -1,
  });
  const current = Number.parseInt(
    String(latest?.serviceId || "").split("-").pop(),
    10
  );

  return `REP-${String(Number.isFinite(current) ? current + 1 : 4401).padStart(4, "0")}`;
};

const money = (amount = 0, currency = "EUR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

const colorForStatus = (status) => {
  if (status === "COMPLETED") return "#16A34A";
  if (status === "IN PROGRESS") return "#EA8A00";
  return "#2563EB";
};

const formatService = (service) => ({
  id: service.serviceId,
  passport: service.passportId,
  garment: service.garmentName,
  service: service.service,
  type: service.type,
  technician: service.technician,
  duration: service.duration,
  price: money(service.cost, service.currency),
  cost: money(service.cost, service.currency),
  status: service.status,
  note: service.note,
  date: service.createdAt?.toISOString?.().slice(0, 10),
  color: colorForStatus(service.status),
  hash: service.blockchainHash,
  photos: service.photos || [],
  certificates: service.certificates || [],
});

const storeRepairFiles = async (files = {}) => {
  const photoFiles = files.photos || [];
  const certificateFiles = files.certificates || [];

  const [photos, certificates] = await Promise.all([
    Promise.all(photoFiles.map((file) => saveUploadedFile(file, "repair-photos"))),
    Promise.all(
      certificateFiles.map((file) => saveUploadedFile(file, "repair-certificates"))
    ),
  ]);

  return {
    photos: photos.filter(Boolean),
    certificates: certificates.filter(Boolean),
  };
};

const createServiceFromAction = async (action, user) => {
  const existing = await RepairService.findOne({ consumerActionId: action._id });
  if (existing) return existing;

  const serviceId = await nextServiceId();
  const details = action.details || {};

  return RepairService.create({
    serviceId,
    garmentId: action.garmentId,
    passportId: action.passportId,
    garmentName: action.productName || action.garmentId?.productName,
    service: details.repairType || "General Clothing Repair",
    type: details.repairType || "Repair",
    technician: details.selectedCenter || user.fullName || "Repair Center",
    duration: details.duration || "2h",
    cost: Number(details.cost || 20),
    status:
      action.status === "Completed"
        ? "COMPLETED"
        : action.status === "In Progress"
          ? "IN PROGRESS"
          : "QUEUED",
    note: details.notes || "Consumer repair request imported from LOOPI portal.",
    repairCenterId: user._id,
    consumerActionId: action._id,
    blockchainHash: action.blockchainHash,
  });
};

export const getRepairQueue = async (req, res) => {
  try {
    const repairActions = await ConsumerAction.find({ type: "repair" })
      .populate("garmentId")
      .sort({ createdAt: -1 });

    await Promise.all(
      repairActions.map((action) => createServiceFromAction(action, req.user))
    );

    const services = await RepairService.find({ status: { $ne: "COMPLETED" } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      stats: {
        totalServices: await RepairService.countDocuments(),
        queued: services.filter((item) => item.status === "QUEUED").length,
        progress: services.filter((item) => item.status === "IN PROGRESS").length,
      },
      jobs: services.map(formatService),
    });
  } catch (error) {
    console.error("REPAIR QUEUE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch repair queue" });
  }
};

export const createRepairService = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passport);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const serviceId = await nextServiceId();
    const blockchainHash = hashFor(serviceId, garment._id, Date.now());
    const storedFiles = await storeRepairFiles(req.files);

    const service = await RepairService.create({
      serviceId,
      garmentId: garment._id,
      passportId: passportIdFor(garment),
      garmentName: req.body.garment || garment.productName,
      service: req.body.service || req.body.type,
      type: req.body.type,
      technician: req.body.technician,
      duration: req.body.duration,
      cost: Number(String(req.body.price || req.body.cost || "0").replace(/[^0-9.]/g, "")),
      status: req.body.status || "QUEUED",
      note: req.body.note,
      photos: storedFiles.photos,
      certificates: storedFiles.certificates,
      repairCenterId: req.user._id,
      blockchainHash,
    });

    await createBlockchainTransaction({
      transactionType: "REPAIR_SERVICE_QUEUED",
      entityType: "RepairService",
      entityId: service._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        serviceId,
        passportId: passportIdFor(garment),
        photos: storedFiles.photos.length,
        certificates: storedFiles.certificates.length,
      },
    });

    res.status(201).json({
      message: "Repair service created",
      job: formatService(service),
    });
  } catch (error) {
    console.error("CREATE REPAIR SERVICE ERROR:", error);
    res.status(500).json({ message: "Failed to create repair service" });
  }
};

export const updateRepairService = async (req, res) => {
  try {
    const service = await RepairService.findOne({ serviceId: req.params.id });

    if (!service) {
      return res.status(404).json({ message: "Repair service not found" });
    }

    if (req.body.status) service.status = req.body.status;
    if (req.body.technician) service.technician = req.body.technician;
    const updateAction =
      req.body.technician && !req.body.status ? "ASSIGN" : "STATUS";
    const storedFiles = await storeRepairFiles(req.files);

    if (storedFiles.photos.length) {
      service.photos = [...(service.photos || []), ...storedFiles.photos];
    }

    if (storedFiles.certificates.length) {
      service.certificates = [
        ...(service.certificates || []),
        ...storedFiles.certificates,
      ];
    }

    if (req.body.status === "COMPLETED") {
      service.blockchainHash = service.blockchainHash || hashFor(service._id, Date.now());

      await LifecycleEvent.create({
        garmentId: service.garmentId,
        stage: "REPAIRED",
        description: `Repair ${service.serviceId} completed`,
        actorRole: req.user.role,
        actorId: req.user._id,
        blockchainHash: service.blockchainHash,
        metadata: {
          serviceId: service.serviceId,
          passportId: service.passportId,
          technician: service.technician,
        },
      });
    }

    await service.save();

    await createBlockchainTransaction({
      transactionType: "REPAIR_SERVICE_UPDATED",
      entityType: "RepairService",
      entityId: service._id,
      garmentId: service.garmentId,
      user: req.user,
      metadata: {
        serviceId: service.serviceId,
        passportId: service.passportId,
        status: service.status,
        technician: service.technician,
        action: updateAction,
        photos: service.photos?.length || 0,
        certificates: service.certificates?.length || 0,
      },
    });

    res.status(200).json({
      message: "Repair service updated",
      job: formatService(service),
    });
  } catch (error) {
    console.error("UPDATE REPAIR SERVICE ERROR:", error);
    res.status(500).json({ message: "Failed to update repair service" });
  }
};

export const getRepairRecords = async (req, res) => {
  try {
    const records = await RepairService.find().sort({ createdAt: -1 });

    res.status(200).json({
      stats: {
        total: records.length,
        completed: records.filter((item) => item.status === "COMPLETED").length,
        progress: records.filter((item) => item.status === "IN PROGRESS").length,
        queued: records.filter((item) => item.status === "QUEUED").length,
      },
      records: records.map(formatService),
    });
  } catch (error) {
    console.error("REPAIR RECORDS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch repair records" });
  }
};

export const getRepairPassports = async (req, res) => {
  try {
    const garments = await Garment.find()
      .populate("createdBy", "organization fullName")
      .sort({ createdAt: -1 })
      .limit(50);

    const passports = await Promise.all(
      garments.map((garment) => buildPassportPayload(garment, { compact: true }))
    );

    res.status(200).json({ passports });
  } catch (error) {
    console.error("REPAIR PASSPORT DIRECTORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch passport directory" });
  }
};

export const getRepairLogs = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      transactionType: /REPAIR|CONSUMER_REPAIR/i,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    const transactionServiceIds = transactions
      .filter((tx) => tx.entityType === "RepairService" && tx.entityId)
      .map((tx) => tx.entityId);

    const [services, transactionServices] = await Promise.all([
      RepairService.find({
        $or: [
          { "photos.0": { $exists: true } },
          { "certificates.0": { $exists: true } },
        ],
      })
        .sort({ updatedAt: -1 })
        .limit(100),
      RepairService.find({ _id: { $in: transactionServiceIds } }),
    ]);

    const serviceById = new Map(
      transactionServices.map((service) => [String(service._id), service])
    );

    const typeFor = (tx) => {
      if (tx.transactionType.includes("QUEUED")) return "QUEUED";
      if (tx.transactionType.includes("UPDATED") && tx.metadata?.action === "ASSIGN") {
        return "ASSIGN";
      }
      if (tx.transactionType.includes("UPDATED")) return "SIGNED";
      if (tx.transactionType.includes("SUBMITTED")) return "NOTIFY";
      return "VERIFIED";
    };

    const dotFor = (type) => {
      const colors = {
        SIGNED: "#22C55E",
        SCORE: "#2563EB",
        UPLOAD: "#A855F7",
        QUEUED: "#F59E0B",
        ASSIGN: "#F59E0B",
        VERIFIED: "#14B8A6",
        NOTIFY: "#EC4899",
      };

      return colors[type] || "#22C55E";
    };

    const passportForTransaction = (tx) =>
      tx.metadata?.passportId ||
      serviceById.get(String(tx.entityId))?.passportId ||
      "N/A";

    const describeTransaction = (tx, type) => {
      const serviceId = tx.metadata?.serviceId || tx.metadata?.actionId || "Repair event";
      const passportId = passportForTransaction(tx);

      if (type === "QUEUED") return `New service job queued · ${serviceId} · ${passportId}`;
      if (type === "ASSIGN") return `Technician assigned · ${tx.metadata?.technician || "Repair Center"} · ${serviceId}`;
      if (type === "SIGNED") return `Repair service update signed · ${serviceId} · ${tx.metadata?.status || "UPDATED"}`;
      if (type === "NOTIFY") return `Consumer repair request submitted · ${serviceId} · ${passportId}`;

      return `${tx.transactionType} · ${serviceId} · ${passportId}`;
    };

    const transactionLogs = transactions.map((tx) => {
      const type = typeFor(tx);

      return {
        id: String(tx._id),
        hash: tx.blockchainHash,
        description: describeTransaction(tx, type),
        type,
        passport: passportForTransaction(tx),
        time: tx.createdAt?.toLocaleTimeString?.([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: tx.createdAt?.toLocaleDateString?.(),
        dot: dotFor(type),
        explorerUrl: tx.explorerUrl,
        createdAt: tx.createdAt,
      };
    });

    const uploadLogs = services.map((service) => {
      const photoCount = service.photos?.length || 0;
      const certificateCount = service.certificates?.length || 0;

      return {
        id: `${service._id}-uploads`,
        hash: service.blockchainHash || "Pending",
        description: `Service evidence uploaded · ${photoCount} photo${photoCount === 1 ? "" : "s"} · ${certificateCount} certificate${certificateCount === 1 ? "" : "s"} · ${service.serviceId}`,
        type: "UPLOAD",
        passport: service.passportId || "N/A",
        time: service.updatedAt?.toLocaleTimeString?.([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: service.updatedAt?.toLocaleDateString?.(),
        dot: dotFor("UPLOAD"),
        explorerUrl: "",
        createdAt: service.updatedAt,
      };
    });

    const logs = [...transactionLogs, ...uploadLogs]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 100)
      .map(({ createdAt, ...log }) => log);

    res.status(200).json({ logs });
  } catch (error) {
    console.error("REPAIR LOGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch repair logs" });
  }
};

export const lookupRepairPassport = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    await garment.populate("createdBy", "organization fullName");

    res.status(200).json(await buildPassportPayload(garment));
  } catch (error) {
    console.error("REPAIR PASSPORT LOOKUP ERROR:", error);
    res.status(500).json({ message: "Failed to lookup passport" });
  }
};
