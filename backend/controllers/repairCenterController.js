import crypto from "crypto";
import mongoose from "mongoose";

import ConsumerAction from "../models/ConsumerAction.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import RepairService from "../models/RepairService.js";
import Transaction from "../models/Transaction.js";
import { createBlockchainTransaction } from "../services/blockchainService.js";

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
      passportIdFor(garment).toLowerCase() === String(identifier).toLowerCase()
  );
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
});

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
        status: service.status,
        technician: service.technician,
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

export const getRepairLogs = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      transactionType: /REPAIR|CONSUMER_REPAIR/i,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    const logs = transactions.map((tx) => ({
      hash: tx.blockchainHash,
      description: `${tx.transactionType} · ${tx.metadata?.serviceId || tx.metadata?.actionId || ""} · ${tx.metadata?.passportId || ""}`,
      type: tx.transactionType.includes("QUEUED")
        ? "QUEUED"
        : tx.transactionType.includes("UPDATED")
          ? "SIGNED"
          : "VERIFIED",
      passport: tx.metadata?.passportId || "N/A",
      time: tx.createdAt?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }),
      date: tx.createdAt?.toLocaleDateString?.(),
      dot: "#22C55E",
    }));

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

    const repairs = await RepairService.find({ garmentId: garment._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      id: passportIdFor(garment),
      garment: garment.productName || "Unnamed garment",
      brand: garment.manufacturingCountry || garment.location || "LOOPI",
      material: garment.material || garment.materials?.join(", ") || "Material pending",
      grade: repairs.some((item) => item.status === "COMPLETED") ? "Grade A+" : "Grade A",
      repairs: `${repairs.length} service${repairs.length === 1 ? "" : "s"}`,
      co2: garment.carbon || "N/A",
      water: garment.water || "N/A",
      repairStatus: repairs[0]?.status || "Queued",
      repairCount: repairs.length,
      verified: true,
    });
  } catch (error) {
    console.error("REPAIR PASSPORT LOOKUP ERROR:", error);
    res.status(500).json({ message: "Failed to lookup passport" });
  }
};
