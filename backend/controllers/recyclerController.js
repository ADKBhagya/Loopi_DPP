import crypto from "crypto";
import mongoose from "mongoose";

import ConsumerAction from "../models/ConsumerAction.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import RecyclingProcess from "../models/RecyclingProcess.js";
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

const runSideEffect = async (label, action) => {
  try {
    await action();
  } catch (error) {
    console.warn(`${label} skipped:`, error?.message || error);
  }
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findGarmentByIdentifier = async (identifier) => {
  const value = String(identifier || "").trim();
  const exactValue = new RegExp(`^${escapeRegex(value)}$`, "i");

  if (isObjectId(identifier)) {
    const garment = await Garment.findById(identifier);
    if (garment) return garment;
  }

  const directMatch = await Garment.findOne({
    $or: [
      { sku: exactValue },
      { batchNumber: exactValue },
      { productName: exactValue },
    ],
  });

  if (directMatch) return directMatch;

  const garments = await Garment.find();
  return garments.find(
    (garment) =>
      passportIdFor(garment).toLowerCase() === value.toLowerCase() ||
      String(garment.productName || "").toLowerCase().includes(value.toLowerCase())
  );
};

const nextProcessId = async () => {
  const latest = await RecyclingProcess.findOne({ processId: /^RCY-/ }).sort({
    createdAt: -1,
  });
  const current = Number.parseInt(
    String(latest?.processId || "").split("-").pop(),
    10
  );

  return `RCY-${String(Number.isFinite(current) ? current + 1 : 8801).padStart(4, "0")}`;
};

const materialFor = (garment) =>
  garment.material || garment.materials?.join(", ") || "Material pending";

const creditsFor = (weight) => {
  const numericWeight = Number.parseFloat(String(weight || "0"));
  return Math.max(12, Math.round((Number.isFinite(numericWeight) ? numericWeight : 0.6) * 32));
};

const formatProcess = (process) => ({
  id: process.processId,
  passport: process.passportId,
  garment: process.garmentName,
  material: process.material,
  stage: process.stage,
  credits: `+${process.credits}`,
  weight: process.weight || "0.60 kg",
  date: process.createdAt?.toISOString?.().slice(0, 10),
  hash: process.blockchainHash,
});

const materialBreakdownFor = (garment, repairs = []) => {
  const materials = garment.materials?.length
    ? garment.materials
    : String(materialFor(garment))
        .split(/,|\//)
        .map((item) => item.trim())
        .filter((item) => item && item !== "Material pending");

  const materialRows = materials.length ? materials : ["Material pending"];
  const values = materialRows.map((_, index) =>
    materialRows.length === 1 ? 100 : index === 0 ? 70 : index === materialRows.length - 1 ? 10 : 20
  );

  return {
    id: passportIdFor(garment),
    garment: garment.productName || "Unnamed garment",
    company: garment.manufacturingCountry || garment.location || "LOOPI",
    weight: repairs[0]?.weight || "0.60 kg",
    verified: true,
    hazardous: materialRows.some((item) => /poly|chemical|dye|elastane/i.test(item)),
    metrics: {
      carbon: garment.carbon || "N/A",
      water: garment.water || "N/A",
      recyclability: repairs.some((item) => item.stage === "COMPLETED") ? "91%" : "87%",
      energy: "2.4 kWh",
    },
    materials: materialRows.map((name, index) => ({
      name,
      type: /poly|pet|elastane/i.test(name)
        ? "SYNTHETIC"
        : /metal|zip|button/i.test(name)
          ? "METAL"
          : "NATURAL",
      value: values[index] || 10,
      barColor: index === 0 ? "#1F6B2A" : index === 1 ? "#2D74DA" : "#B95D10",
      badge: /elastane|chemical|dye/i.test(name) ? "Non-Extract" : "Extractable",
      badgeBg: /elastane|chemical|dye/i.test(name) ? "#F4F4F5" : "#EAF7EE",
      badgeColor: /elastane|chemical|dye/i.test(name) ? "#9CA3AF" : "#16A34A",
      color: index === 0 ? "#166534" : index === 1 ? "#2563EB" : "#B45309",
    })),
  };
};

const createProcessFromAction = async (action, user) => {
  const existing = await RecyclingProcess.findOne({ consumerActionId: action._id });
  if (existing) return existing;

  const activeExisting = await RecyclingProcess.findOne({
    passportId: action.passportId,
    stage: { $ne: "CLOSED" },
  });

  if (activeExisting) return activeExisting;

  const processId = await nextProcessId();
  const weight = action.details?.weight || "0.60 kg";

  return RecyclingProcess.create({
    processId,
    garmentId: action.garmentId,
    passportId: action.passportId,
    garmentName: action.productName || action.garmentId?.productName,
    material: materialFor(action.garmentId || {}),
    stage: "SORTING",
    credits: creditsFor(weight),
    weight,
    recyclerId: user._id,
    consumerActionId: action._id,
    blockchainHash: action.blockchainHash,
    metadata: action.details,
  });
};

const ensureProcessesFromRecyclingActions = async (user) => {
  const recyclingActions = await ConsumerAction.find({ type: "recycling" })
    .populate("garmentId")
    .sort({ createdAt: -1 });

  await Promise.all(
    recyclingActions.map((action) => createProcessFromAction(action, user))
  );
};

export const getRecyclerDashboard = async (req, res) => {
  try {
    await ensureProcessesFromRecyclingActions(req.user);

    const [processes, garmentCount, recyclingRequests, logs] = await Promise.all([
      RecyclingProcess.find().sort({ createdAt: -1 }).limit(8),
      Garment.countDocuments(),
      ConsumerAction.countDocuments({ type: "recycling" }),
      Transaction.find({ transactionType: /RECYCLING|RECYCLED/i })
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const allProcesses = await RecyclingProcess.find();
    const activeProcesses = allProcesses.filter((item) => item.stage !== "CLOSED");
    const closedProcesses = allProcesses.filter((item) => item.stage === "CLOSED");
    const readyToClose = allProcesses.filter(
      (item) => item.stage === "COMPLETED" || item.stage === "CLOSED"
    );
    const credits = allProcesses.reduce(
      (sum, item) => sum + (Number(item.credits) || 0),
      0
    );
    const recoveredWeight = allProcesses.reduce((sum, item) => {
      const numericWeight = Number.parseFloat(String(item.weight || "0"));
      return sum + (Number.isFinite(numericWeight) ? numericWeight : 0);
    }, 0);

    res.status(200).json({
      stats: {
        totalProcesses: allProcesses.length,
        activeProcesses: activeProcesses.length,
        closedProcesses: closedProcesses.length,
        readyToClose: readyToClose.length,
        passports: garmentCount,
        recyclingRequests,
        credits,
        recoveredWeight: `${recoveredWeight.toFixed(2)} kg`,
        logs: logs.length,
        walletCredits: credits,
      },
      recent: processes.map(formatProcess),
      logs: logs.map((log) => ({
        hash: log.blockchainHash,
        title: `${log.transactionType} for ${log.metadata?.passportId || "passport"}`,
        type: log.transactionType.includes("UPDATED") ? "STAGE" : "ENTRY",
        explorerUrl: log.explorerUrl,
        time: log.createdAt?.toLocaleTimeString?.([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      network: {
        status: "ONLINE",
        label: "MAINNET ONLINE",
      },
    });
  } catch (error) {
    console.error("RECYCLER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch recycler dashboard" });
  }
};

export const getRecyclerProcessing = async (req, res) => {
  try {
    await ensureProcessesFromRecyclingActions(req.user);

    const processes = await RecyclingProcess.find({ stage: { $ne: "CLOSED" } })
      .sort({ createdAt: -1 });

    const credits = processes.reduce((sum, item) => sum + (Number(item.credits) || 0), 0);

    res.status(200).json({
      stats: {
        materialRecovery: `${processes.length} Items`,
        credits,
      },
      items: processes.map(formatProcess),
    });
  } catch (error) {
    console.error("RECYCLER PROCESSING ERROR:", error);
    res.status(500).json({ message: "Failed to fetch recycling processing queue" });
  }
};

export const createRecyclingProcess = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passport);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const passportId = passportIdFor(garment);
    const existingActiveProcess = await RecyclingProcess.findOne({
      passportId,
      stage: { $ne: "CLOSED" },
    });

    if (existingActiveProcess) {
      return res.status(200).json({
        message: "Recycling process already active for this passport",
        item: formatProcess(existingActiveProcess),
        existing: true,
      });
    }

    const processId = await nextProcessId();
    const weight = req.body.weight || "0.60 kg";
    const blockchainHash = hashFor(processId, garment._id, Date.now());

    const process = await RecyclingProcess.create({
      processId,
      garmentId: garment._id,
      passportId,
      garmentName: req.body.garment || garment.productName,
      material: req.body.material || materialFor(garment),
      stage: req.body.stage || "SORTING",
      credits: creditsFor(weight),
      weight,
      recyclerId: req.user._id,
      blockchainHash,
      metadata: req.body,
    });

    await runSideEffect("Recycling create blockchain transaction", () =>
      createBlockchainTransaction({
        transactionType: "RECYCLING_PROCESS_CREATED",
        entityType: "RecyclingProcess",
        entityId: process._id,
        garmentId: garment._id,
        user: req.user,
        metadata: {
          processId,
          passportId,
        },
      })
    );

    res.status(201).json({
      message: "Recycling process created",
      item: formatProcess(process),
    });
  } catch (error) {
    console.error("CREATE RECYCLING PROCESS ERROR:", error);
    res.status(500).json({ message: "Failed to create recycling process" });
  }
};

export const updateRecyclingProcess = async (req, res) => {
  try {
    const process = await RecyclingProcess.findOne({ processId: req.params.id });

    if (!process) {
      return res.status(404).json({ message: "Recycling process not found" });
    }

    const previousStage = process.stage;
    if (req.body.stage) process.stage = req.body.stage;
    process.blockchainHash = process.blockchainHash || hashFor(process._id, Date.now());
    await process.save();

    if (
      (process.stage === "COMPLETED" || process.stage === "CLOSED") &&
      previousStage !== process.stage
    ) {
      await runSideEffect("Recycling lifecycle event", () =>
        LifecycleEvent.create({
          garmentId: process.garmentId,
          stage: "RECYCLED",
          description: `Recycling ${process.processId} ${process.stage.toLowerCase()}`,
          actorRole: req.user?.role || "recycler",
          actorId: req.user?._id,
          blockchainHash: process.blockchainHash,
          metadata: {
            processId: process.processId,
            passportId: process.passportId,
            credits: process.credits,
          },
        })
      );
    }

    await runSideEffect("Recycling update blockchain transaction", () =>
      createBlockchainTransaction({
        transactionType: "RECYCLING_PROCESS_UPDATED",
        entityType: "RecyclingProcess",
        entityId: process._id,
        garmentId: process.garmentId,
        user: req.user,
        metadata: {
          processId: process.processId,
          passportId: process.passportId,
          stage: process.stage,
        },
      })
    );

    res.status(200).json({
      message: "Recycling process updated",
      item: formatProcess(process),
    });
  } catch (error) {
    console.error("UPDATE RECYCLING PROCESS ERROR:", error);
    res.status(500).json({ message: "Failed to update recycling process" });
  }
};

export const getRecyclerMaterials = async (req, res) => {
  try {
    const garments = await Garment.find().sort({ createdAt: -1 }).limit(20);
    const processes = await RecyclingProcess.find().sort({ createdAt: -1 });

    res.status(200).json({
      passports: garments.map((garment) =>
        materialBreakdownFor(
          garment,
          processes.filter((item) => String(item.garmentId) === String(garment._id))
        )
      ),
    });
  } catch (error) {
    console.error("RECYCLER MATERIALS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch material breakdown" });
  }
};

export const lookupRecyclerPassport = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const processes = await RecyclingProcess.find({ garmentId: garment._id });

    res.status(200).json(materialBreakdownFor(garment, processes));
  } catch (error) {
    console.error("RECYCLER PASSPORT LOOKUP ERROR:", error);
    res.status(500).json({ message: "Failed to lookup recycler passport" });
  }
};

export const getLifecycleCloseQueue = async (req, res) => {
  try {
    const processes = await RecyclingProcess.find().sort({ createdAt: -1 });
    const logs = await Transaction.find({ transactionType: /RECYCLING|RECYCLED/i })
      .sort({ createdAt: -1 })
      .limit(20);

    const latestByPassport = new Map();
    processes.forEach((process) => {
      if (!latestByPassport.has(process.passportId)) {
        latestByPassport.set(process.passportId, process);
      }
    });

    res.status(200).json({
      passports: Array.from(latestByPassport.values()).map((process) => ({
        id: process.passportId,
        processId: process.processId,
        garment: process.garmentName,
        company: "LOOPI",
        score: process.stage === "COMPLETED" || process.stage === "CLOSED" ? "91%" : "87%",
        status: process.stage === "CLOSED" ? "CLOSED" : process.stage === "COMPLETED" ? "READY" : "RECOVER",
        credits: `${process.credits} LOOPI`,
        recyclable: process.stage !== "CHEMICAL SORT",
        hazardous: process.stage === "CHEMICAL SORT",
        color: process.stage === "CLOSED" ? "#9CA3AF" : "#16A34A",
        badgeBg: process.stage === "CLOSED" ? "#F3F4F6" : "#EAF7EE",
      })),
      logs: logs.map((log) => ({
        hash: log.blockchainHash,
        title: `${log.transactionType} for ${log.metadata?.passportId || "passport"}`,
        type: log.transactionType.includes("UPDATED") ? "STAGE" : "ENTRY",
        color: "#16A34A",
        bg: "#EAF7EE",
        time: log.createdAt?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }),
        explorerUrl: log.explorerUrl,
      })),
    });
  } catch (error) {
    console.error("LIFECYCLE CLOSE QUEUE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch lifecycle close queue" });
  }
};

export const closeRecyclerLifecycle = async (req, res) => {
  req.body = {
    ...(req.body || {}),
    stage: "CLOSED",
  };
  return updateRecyclingProcess(req, res);
};
