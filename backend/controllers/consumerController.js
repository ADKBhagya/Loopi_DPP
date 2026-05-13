import crypto from "crypto";
import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import ConsumerAction from "../models/ConsumerAction.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import OwnershipTransfer from "../models/OwnershipTransfer.js";
import RetailSale from "../models/RetailSale.js";
import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";
import { createBlockchainTransaction } from "../services/blockchainService.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const passportIdFor = (garment) =>
  garment?.sku ||
  garment?.batchNumber ||
  `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`;

const safeDate = (date) => (date ? new Date(date).toISOString() : null);

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
      passportIdFor(garment).toLowerCase() ===
      String(identifier).toLowerCase()
  );
};

const nextActionId = async (type) => {
  const prefixByType = {
    resale: "RS",
    repair: "RP",
    recycling: "RC",
    issue: "IR",
  };
  const prefix = prefixByType[type] || "CA";

  const latest = await ConsumerAction.findOne({
    actionId: new RegExp(`^${prefix}-`),
  }).sort({ createdAt: -1 });

  const current = Number.parseInt(
    String(latest?.actionId || "").split("-").pop(),
    10
  );

  return `${prefix}-${String(Number.isFinite(current) ? current + 1 : 1).padStart(4, "0")}`;
};

const hasConsumerAccess = (req, garment, sales = [], ownership = []) => {
  if (!req.user) return false;
  if (req.user.role === "Admin") return true;

  const userId = String(req.user._id);
  const email = String(req.user.email || "").toLowerCase();
  const fullName = String(req.user.fullName || "").toLowerCase();

  return (
    String(garment.currentOwner || "") === userId ||
    String(garment.currentOwnerName || "").toLowerCase() === fullName ||
    sales.some((sale) => String(sale.buyerEmail || "").toLowerCase() === email) ||
    ownership.some((transfer) => String(transfer.toUser || "") === userId)
  );
};

const actionStatus = (type) => {
  if (type === "resale") return "Published";
  if (type === "repair") return "Scheduled";
  if (type === "recycling") return "Pending Drop-off";
  return "Under Review";
};

const createConsumerAction = (type) => async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passportId);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const [sales, ownership] = await Promise.all([
      RetailSale.find({ garmentId: garment._id }),
      OwnershipTransfer.find({ garmentId: garment._id }),
    ]);

    if (type !== "issue" && !hasConsumerAccess(req, garment, sales, ownership)) {
      return res.status(403).json({
        message: "This product is not linked to your consumer account",
      });
    }

    const actionId = await nextActionId(type);
    const passportId = passportIdFor(garment);
    const blockchainHash = hashFor(actionId, garment._id, req.user._id, Date.now());

    const action = await ConsumerAction.create({
      actionId,
      type,
      consumerId: req.user._id,
      garmentId: garment._id,
      passportId,
      productName: garment.productName,
      status: actionStatus(type),
      details: req.body,
      blockchainHash,
    });

    await createBlockchainTransaction({
      transactionType: `CONSUMER_${type.toUpperCase()}_SUBMITTED`,
      entityType: "ConsumerAction",
      entityId: action._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        actionId,
        passportId,
        type,
      },
    });

    if (type === "repair" || type === "recycling") {
      await LifecycleEvent.create({
        garmentId: garment._id,
        stage: type === "repair" ? "REPAIR_REQUESTED" : "RECYCLED",
        description:
          type === "repair"
            ? `Repair requested by ${req.user.fullName || "Consumer"}`
            : `Recycling registered by ${req.user.fullName || "Consumer"}`,
        actorRole: req.user.role,
        actorId: req.user._id,
        blockchainHash,
        metadata: {
          actionId,
          passportId,
          ...req.body,
        },
      });
    }

    res.status(201).json({
      message: "Consumer action submitted successfully",
      action,
    });
  } catch (error) {
    console.error("CREATE CONSUMER ACTION ERROR:", error);
    res.status(500).json({ message: "Failed to submit consumer action" });
  }
};

export const verifyConsumerPassport = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.id || req.body.passportId);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const [certificates, sales, ownership] = await Promise.all([
      Certificate.find({ garmentId: garment._id }),
      RetailSale.find({ garmentId: garment._id }),
      OwnershipTransfer.find({ garmentId: garment._id }),
    ]);

    res.status(200).json({
      verified: true,
      ownedByConsumer: hasConsumerAccess(req, garment, sales, ownership),
      passport: {
        id: String(garment._id),
        passportId: passportIdFor(garment),
        productName: garment.productName || "Unnamed garment",
        material: garment.material || garment.materials?.join(", ") || "Material pending",
        status: garment.status,
        retailStatus: garment.retailStatus,
        carbon: garment.carbon || "N/A",
        water: garment.water || "N/A",
        verificationStatus: certificates.some(
          (item) => item.verificationStatus === "verified"
        )
          ? "VERIFIED"
          : "PENDING",
      },
    });
  } catch (error) {
    console.error("CONSUMER VERIFY ERROR:", error);
    res.status(500).json({ message: "Failed to verify passport" });
  }
};

export const getPublicConsumerPassport = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const [certificates, shipments, ownership, sales, lifecycle, transactions] =
      await Promise.all([
        Certificate.find({ garmentId: garment._id }).sort({ issuedDate: -1 }),
        Shipment.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
        OwnershipTransfer.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
        RetailSale.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
        LifecycleEvent.find({ garmentId: garment._id }).sort({ createdAt: -1 }),
        Transaction.find({ garmentId: garment._id }).sort({ createdAt: -1 }).limit(20),
      ]);

    res.status(200).json({
      id: String(garment._id),
      passportId: passportIdFor(garment),
      productName: garment.productName || "Unnamed garment",
      category: garment.category,
      brand: garment.manufacturingCountry || garment.location || "LOOPI",
      material: garment.material || garment.materials?.join(", ") || "Material pending",
      materials: garment.materials || [],
      imageUrl: garment.imageUrl,
      productionDate: safeDate(garment.productionDate),
      status: garment.status,
      retailStatus: garment.retailStatus,
      carbon: garment.carbon || "N/A",
      water: garment.water || "N/A",
      currentOwnerRole: garment.currentOwnerRole,
      certificates,
      shipments,
      ownership,
      sales,
      lifecycle,
      transactions,
      verification: {
        status: certificates.some((item) => item.verificationStatus === "verified")
          ? "VERIFIED"
          : "PENDING",
        hash: hashFor(garment._id, garment.updatedAt?.toISOString()),
      },
    });
  } catch (error) {
    console.error("PUBLIC CONSUMER PASSPORT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch consumer passport" });
  }
};

export const getConsumerDashboard = async (req, res) => {
  try {
    const userId = String(req.user._id);
    const email = String(req.user.email || "").toLowerCase();
    const fullName = String(req.user.fullName || "").toLowerCase();

    const [ownedGarments, sales, ownership, actions] = await Promise.all([
      Garment.find({
        $or: [
          { currentOwner: req.user._id },
          { currentOwnerName: new RegExp(`^${fullName}$`, "i") },
          { currentOwnerRole: "Consumer" },
        ],
      }).sort({ updatedAt: -1 }),
      RetailSale.find({
        $or: [
          { buyerEmail: new RegExp(`^${email}$`, "i") },
          { buyerName: new RegExp(`^${fullName}$`, "i") },
        ],
      }).populate("garmentId"),
      OwnershipTransfer.find({
        $or: [
          { toUser: req.user._id },
          { toName: new RegExp(`^${fullName}$`, "i") },
        ],
      }).populate("garmentId"),
      ConsumerAction.find({ consumerId: req.user._id })
        .populate("garmentId")
        .sort({ createdAt: -1 }),
    ]);

    const garmentsById = new Map();
    [...ownedGarments, ...sales.map((sale) => sale.garmentId), ...ownership.map((item) => item.garmentId)]
      .filter(Boolean)
      .forEach((garment) => garmentsById.set(String(garment._id), garment));

    const ownedItems = Array.from(garmentsById.values()).map((garment) => ({
      id: passportIdFor(garment),
      garmentId: String(garment._id),
      name: garment.productName || "Unnamed garment",
      brand: garment.manufacturingCountry || garment.location || "LOOPI",
      status:
        garment.retailStatus === "sold" || garment.currentOwnerRole === "Consumer"
          ? "In Use"
          : "Verified",
      score: garment.status === "certified" ? "90/100" : "87/100",
      material: garment.material || garment.materials?.join(", ") || "Material pending",
      lastActivity: `Updated ${new Date(garment.updatedAt || garment.createdAt).toLocaleDateString()}`,
    }));

    const actionsByType = (type) =>
      actions.filter((action) => action.type === type);

    res.status(200).json({
      stats: {
        owned: ownedItems.length,
        resale: actionsByType("resale").length,
        repairs: actionsByType("repair").length,
        recycling: actionsByType("recycling").length,
        reports: actionsByType("issue").length,
        ecoCredits: actionsByType("recycling").length * 250 + actionsByType("repair").length * 15,
      },
      ownedItems,
      resaleListings: actionsByType("resale").map(formatAction),
      repairRequests: actionsByType("repair").map(formatAction),
      recyclingRequests: actionsByType("recycling").map(formatAction),
      issueReports: actionsByType("issue").map(formatAction),
      activity: actions.slice(0, 8).map(formatActivity),
    });
  } catch (error) {
    console.error("CONSUMER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch consumer dashboard" });
  }
};

const formatAction = (action) => ({
  id: action.actionId,
  product: action.productName || action.garmentId?.productName || "Verified garment",
  passport: action.passportId,
  status: action.status,
  date:
    action.details?.preferredDate ||
    action.createdAt?.toISOString?.().slice(0, 10),
  condition: action.details?.condition,
  price: action.details?.price ? `EUR ${action.details.price}` : undefined,
  type: action.details?.repairType || action.details?.issueType || action.details?.method,
  center: action.details?.selectedCenter,
  method: action.details?.method,
  credits: action.type === "recycling" ? "250" : undefined,
  views: action.type === "resale" ? "0" : undefined,
});

const formatActivity = (action) => ({
  id: action.actionId,
  type: action.type,
  title: action.status,
  text: `${action.productName || "Product"} (${action.passportId})`,
  time: action.createdAt,
});

export const createResaleListing = createConsumerAction("resale");
export const createRepairRequest = createConsumerAction("repair");
export const createRecyclingRequest = createConsumerAction("recycling");
export const createIssueReport = createConsumerAction("issue");
