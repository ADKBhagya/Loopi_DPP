import crypto from "crypto";
import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import OwnershipTransfer from "../models/OwnershipTransfer.js";
import RetailSale from "../models/RetailSale.js";
import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

const isObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(String(value));

const passportIdFor = (garment) =>
  garment?.sku ||
  garment?.batchNumber ||
  `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`;

const formatCurrency = (amount = 0, currency = "EUR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);

const safeDate = (date) =>
  date ? new Date(date).toISOString() : null;

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

const buildInventoryItem = ({
  garment,
  certificates = [],
  shipments = [],
  sales = [],
  ownership = [],
}) => {
  const garmentId = String(garment._id);
  const garmentCertificates = certificates.filter(
    (certificate) => String(certificate.garmentId) === garmentId
  );
  const garmentShipments = shipments.filter(
    (shipment) => String(shipment.garmentId || "") === garmentId
  );
  const garmentSales = sales.filter(
    (sale) => String(sale.garmentId) === garmentId
  );
  const garmentOwnership = ownership.filter(
    (transfer) => String(transfer.garmentId?._id || transfer.garmentId) === garmentId
  );

  const latestShipment = garmentShipments[0];
  const latestSale = garmentSales[0];
  const verifiedCertificates = garmentCertificates.filter(
    (item) => item.verificationStatus === "verified"
  );

  const retailStatus = latestSale
    ? "SOLD"
    : garment.retailStatus === "sold"
      ? "SOLD"
    : garment.retailStatus === "in_transit" ||
      latestShipment?.status === "in_transit"
        ? "IN TRANSIT"
        : "IN STORE";

  return {
    id: garmentId,
    passport: passportIdFor(garment),
    name: garment.productName || latestShipment?.product || "Unnamed garment",
    brand: garment.manufacturingCountry || garment.location || "LOOPI",
    material:
      garment.material ||
      garment.materials?.join(", ") ||
      "Material pending",
    grade:
      verifiedCertificates.length >= 2
        ? "A+"
        : verifiedCertificates.length === 1
          ? "A"
          : garmentCertificates.length > 0
            ? "B+"
            : "Pending",
    price: formatCurrency(garment.retailPrice || latestSale?.salePrice || 0, garment.currency),
    rawPrice: garment.retailPrice || latestSale?.salePrice || 0,
    status: retailStatus,
    owner:
      latestSale?.buyerName ||
      garment.currentOwnerName ||
      garment.currentOwnerRole ||
      "Retail inventory",
    received:
      safeDate(latestShipment?.actualArrivalDate || latestShipment?.updatedAt || garment.createdAt),
    certificates: garmentCertificates.length,
    shipmentStatus: latestShipment?.status || null,
    ownershipTransfers: garmentOwnership.length,
    createdAt: garment.createdAt,
    updatedAt: garment.updatedAt,
  };
};

const nextSequenceId = async (model, field, prefix) => {
  const latest = await model
    .findOne({ [field]: new RegExp(`^${prefix}-`) })
    .sort({ createdAt: -1 });

  const current = Number.parseInt(
    String(latest?.[field] || "").split("-").pop(),
    10
  );

  return `${prefix}-${String(Number.isFinite(current) ? current + 1 : 1).padStart(4, "0")}`;
};

export const getRetailerOverview = async (req, res) => {
  try {
    const [garments, sales] = await Promise.all([
      Garment.find(),
      RetailSale.find({ status: "completed" }),
    ]);

    const revenue = sales.reduce(
      (sum, sale) => sum + (Number(sale.salePrice) || 0),
      0
    );

    res.status(200).json({
      totalInventory: garments.length,
      inStore: garments.filter((garment) => garment.retailStatus !== "sold").length,
      sold: sales.length,
      revenue: Number(revenue.toFixed(2)),
    });
  } catch (error) {
    console.error("RETAILER OVERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer overview" });
  }
};

export const getRetailerInventory = async (req, res) => {
  try {
    const [garments, certificates, shipments, sales, ownership] =
      await Promise.all([
        Garment.find().sort({ createdAt: -1 }),
        Certificate.find().sort({ createdAt: -1 }),
        Shipment.find().sort({ createdAt: -1 }),
        RetailSale.find().sort({ createdAt: -1 }),
        OwnershipTransfer.find().sort({ createdAt: -1 }),
      ]);

    const retailerShipmentGarmentIds = new Set(
      shipments
        .filter((shipment) => String(shipment.retailerId || "") === String(req.user._id))
        .map((shipment) => String(shipment.garmentId || ""))
        .filter(Boolean)
    );

    const retailerGarments = garments.filter((garment) => {
      if (retailerShipmentGarmentIds.size === 0) {
        return true;
      }

      return (
        retailerShipmentGarmentIds.has(String(garment._id)) ||
        String(garment.currentOwner || "") === String(req.user._id)
      );
    });

    const inventory = retailerGarments.map((garment) =>
      buildInventoryItem({ garment, certificates, shipments, sales, ownership })
    );

    res.status(200).json({
      stats: {
        total: inventory.length,
        inStore: inventory.filter((item) => item.status === "IN STORE").length,
        inTransit: inventory.filter((item) => item.status === "IN TRANSIT").length,
        sold: inventory.filter((item) => item.status === "SOLD").length,
        passports: inventory.length,
      },
      inventory,
    });
  } catch (error) {
    console.error("RETAILER INVENTORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer inventory" });
  }
};

export const updateRetailerInventoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const statusMap = {
      "IN STORE": "in_store",
      "IN TRANSIT": "in_transit",
      SOLD: "sold",
      in_store: "in_store",
      in_transit: "in_transit",
      sold: "sold",
    };
    const nextStatus = statusMap[status];

    if (!nextStatus) {
      return res.status(400).json({ message: "Select a valid inventory status" });
    }

    const garment = await findGarmentByIdentifier(id);

    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    garment.retailStatus = nextStatus;

    if (nextStatus === "sold") {
      garment.currentOwnerRole = "Consumer";
      garment.currentOwnerName = garment.currentOwnerName || "Consumer";
    } else {
      garment.currentOwnerRole = "Retailer";
      garment.currentOwnerName = req.user.organization || req.user.fullName || "Retailer";
    }

    await garment.save();

    await createBlockchainTransaction({
      transactionType: "RETAIL_INVENTORY_STATUS_UPDATED",
      entityType: "Garment",
      entityId: garment._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        retailStatus: nextStatus,
      },
    });

    await LifecycleEvent.create({
      garmentId: garment._id,
      stage: nextStatus === "sold" ? "CONSUMER_OWNED" : nextStatus === "in_transit" ? "SHIPPED" : "RETAIL_RECEIVED",
      description: `Retail inventory status changed to ${nextStatus.replace(/_/g, " ")}`,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash: hashFor(garment._id, nextStatus, Date.now()),
      metadata: {
        retailStatus: nextStatus,
      },
    });

    res.status(200).json({
      message: "Inventory status updated",
      garment: {
        id: garment._id,
        passport: passportIdFor(garment),
        retailStatus: nextStatus,
      },
    });
  } catch (error) {
    console.error("RETAILER INVENTORY STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update inventory status" });
  }
};

export const getRetailerPassport = async (req, res) => {
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
      id: garment._id,
      passport: passportIdFor(garment),
      productName: garment.productName,
      category: garment.category,
      material: garment.material || garment.materials?.join(", "),
      manufacturingCountry: garment.manufacturingCountry || garment.location,
      productionDate: safeDate(garment.productionDate),
      status: garment.status,
      retailStatus: garment.retailStatus,
      currentOwnerRole: garment.currentOwnerRole,
      currentOwnerName: garment.currentOwnerName,
      carbon: garment.carbon,
      water: garment.water,
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
    console.error("RETAILER PASSPORT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer passport" });
  }
};

export const scanRetailerPassport = async (req, res) => {
  try {
    const garment = await findGarmentByIdentifier(req.body.passportId || req.params.id);

    if (!garment) {
      return res.status(404).json({ message: "Digital passport not found" });
    }

    const transaction = await createBlockchainTransaction({
      transactionType: "PASSPORT_SCANNED",
      entityType: "Garment",
      entityId: garment._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        scanSource: req.body.scanSource || "retailer",
      },
    });

    res.status(200).json({
      message: "Passport verified successfully",
      scan: {
        garmentId: garment._id,
        passport: passportIdFor(garment),
        productName: garment.productName,
        material: garment.material || garment.materials?.join(", "),
        brand: garment.manufacturingCountry || garment.location || "LOOPI",
        price: garment.retailPrice || 0,
        owner: garment.currentOwnerName || garment.currentOwnerRole || "Retail inventory",
        status: "VERIFIED",
        blockchainHash: transaction.blockchainHash,
        scannedAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error("RETAILER SCAN ERROR:", error);
    res.status(500).json({ message: "Failed to scan passport" });
  }
};

export const getRetailerOwnership = async (req, res) => {
  try {
    const [transfers, sales, shipments] = await Promise.all([
      OwnershipTransfer.find().populate("garmentId").sort({ createdAt: -1 }),
      RetailSale.find().populate("garmentId").sort({ createdAt: -1 }),
      Shipment.find().sort({ createdAt: -1 }),
    ]);

    const saleEntries = sales.map((sale) => ({
      id: sale.saleId,
      passport: sale.passportId,
      item: sale.productName,
      from: req.user.organization || "Retailer",
      to: sale.buyerName,
      type: "SALE",
      date: sale.createdAt,
      amount: formatCurrency(sale.salePrice, sale.currency),
      icon: "sale",
      hash: sale.blockchainHash,
    }));

    const transferEntries = transfers
      .filter((transfer) => transfer.transferType !== "sale")
      .map((transfer) => ({
        id: `TRX-${String(transfer._id).slice(-6).toUpperCase()}`,
        passport: passportIdFor(transfer.garmentId),
        item: transfer.garmentId?.productName || "Garment",
        from: transfer.fromRole,
        to: transfer.toName || transfer.toRole,
        type: String(transfer.transferType || transfer.toRole || "ownership").toUpperCase(),
        date: transfer.createdAt,
        amount: transfer.amount
          ? formatCurrency(transfer.amount, transfer.currency)
          : "N/A",
        icon: "transfer",
        hash: transfer.transactionHash,
      }));

    const shipmentEntries = shipments.map((shipment) => ({
      id: shipment.shipmentId || `SHP-${String(shipment._id).slice(-6).toUpperCase()}`,
      passport: shipment.garmentId ? `GP-${String(shipment.garmentId).slice(-6).toUpperCase()}` : "N/A",
      item: shipment.product || "Garment",
      from: shipment.from || "Origin",
      to: shipment.to || "Retailer",
      type: shipment.status === "delivered" ? "ARRIVAL" : "DISPATCH",
      date: shipment.updatedAt || shipment.createdAt,
      amount: "N/A",
      icon: shipment.status === "delivered" ? "arrival" : "dispatch",
    }));

    const entries = [...saleEntries, ...transferEntries, ...shipmentEntries]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      stats: {
        total: entries.length,
        sales: saleEntries.length,
        arrivals: shipmentEntries.filter((entry) => entry.type === "ARRIVAL").length,
        dispatched: shipmentEntries.filter((entry) => entry.type === "DISPATCH").length,
      },
      transfers: entries,
    });
  } catch (error) {
    console.error("RETAILER OWNERSHIP ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer ownership" });
  }
};

export const transferRetailerOwnership = async (req, res) => {
  try {
    const {
      garmentId,
      toUser,
      toRole = "Consumer",
      toName = "Consumer",
      toPhone,
      notes,
      amount,
      currency = "EUR",
      transferType = "ownership",
    } = req.body;

    const garment = await findGarmentByIdentifier(garmentId);

    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    const transactionHash = hashFor(garment._id, toUser || toName, toPhone, Date.now());

    const transfer = await OwnershipTransfer.create({
      garmentId: garment._id,
      fromRole: req.user.role,
      toRole,
      fromUser: req.user._id,
      toUser: isObjectId(toUser) ? toUser : undefined,
      toName,
      toPhone,
      amount,
      currency,
      transferType,
      transactionHash,
      notes,
    });

    garment.currentOwner = isObjectId(toUser) ? toUser : undefined;
    garment.currentOwnerName = toName;
    garment.currentOwnerRole = toRole;
    garment.retailStatus = toRole === "Consumer" ? "sold" : garment.retailStatus;
    await garment.save();

    await createBlockchainTransaction({
      transactionType: "RETAIL_OWNERSHIP_TRANSFER",
      entityType: "OwnershipTransfer",
      entityId: transfer._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        passportId: passportIdFor(garment),
        toRole,
        toName,
        toPhone,
        transferType,
      },
    });

    await LifecycleEvent.create({
      garmentId: garment._id,
      stage: toRole === "Consumer" ? "CONSUMER_OWNED" : "RETAIL_RECEIVED",
      description: notes || `Ownership transferred to ${toName || toRole}`,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash: transactionHash,
      metadata: { transferType, toRole, toName, toPhone },
    });

    res.status(201).json({
      message: "Ownership transferred successfully",
      transfer,
    });
  } catch (error) {
    console.error("RETAILER TRANSFER ERROR:", error);
    res.status(500).json({ message: "Ownership transfer failed" });
  }
};

export const getRetailerSales = async (req, res) => {
  try {
    const [sales, saleTransfers] = await Promise.all([
      RetailSale.find().populate("garmentId").sort({ createdAt: -1 }),
      OwnershipTransfer.find({ transferType: "sale" }).populate("garmentId").sort({ createdAt: -1 }),
    ]);

    const retailSaleEntries = sales.map((sale) => ({
      id: String(sale._id),
      saleId: sale.saleId,
      receipt: sale.receiptId,
      passport: sale.passportId,
      product: sale.productName || sale.garmentId?.productName,
      buyer: sale.buyerName,
      price: formatCurrency(sale.salePrice, sale.currency),
      net: formatCurrency(sale.netAmount, sale.currency),
      tax: `${sale.taxRate}%`,
      taxAmount: formatCurrency(sale.taxAmount, sale.currency),
      date: sale.createdAt,
      status: sale.status,
      hash: sale.blockchainHash,
      source: "Retail Sale",
      revenueValue: Number(sale.salePrice) || 0,
      netValue: Number(sale.netAmount) || 0,
      taxValue: Number(sale.taxAmount) || 0,
    }));

    const transferSaleEntries = saleTransfers.map((transfer) => ({
      id: String(transfer._id),
      saleId: `TRF-${String(transfer._id).slice(-6).toUpperCase()}`,
      receipt: transfer.transactionHash
        ? `TX-${String(transfer.transactionHash).slice(-8).toUpperCase()}`
        : `TRF-${String(transfer._id).slice(-6).toUpperCase()}`,
      passport: passportIdFor(transfer.garmentId),
      product: transfer.garmentId?.productName || "Garment",
      buyer: transfer.toName || transfer.toRole || "Consumer",
      price: formatCurrency(transfer.amount || 0, transfer.currency),
      net: formatCurrency(transfer.amount || 0, transfer.currency),
      tax: "0%",
      taxAmount: formatCurrency(0, transfer.currency),
      date: transfer.createdAt,
      status: transfer.status || "completed",
      hash: transfer.transactionHash,
      source: "Ownership Transfer",
      revenueValue: Number(transfer.amount) || 0,
      netValue: Number(transfer.amount) || 0,
      taxValue: 0,
    }));

    const dedupedByHash = new Map();

    for (const entry of transferSaleEntries) {
      if (entry.hash) {
        dedupedByHash.set(entry.hash, entry);
      }
    }

    for (const entry of retailSaleEntries) {
      if (entry.hash) {
        dedupedByHash.set(entry.hash, entry);
      }
    }

    const formatted = [...dedupedByHash.values()]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const revenue = formatted.reduce(
      (sum, item) => sum + (item.revenueValue || 0),
      0
    );
    const net = formatted.reduce(
      (sum, item) => sum + (item.netValue || 0),
      0
    );
    const tax = formatted.reduce(
      (sum, item) => sum + (item.taxValue || 0),
      0
    );

    res.status(200).json({
      stats: {
        revenue: Number(revenue.toFixed(2)),
        net: Number(net.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        sales: formatted.length,
      },
      sales: formatted,
    });
  } catch (error) {
    console.error("RETAILER SALES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer sales" });
  }
};

export const createRetailerSale = async (req, res) => {
  try {
    const {
      garmentId,
      buyerName,
      buyerEmail,
      salePrice,
      taxRate = 19,
      currency = "EUR",
      paymentMethod,
      channel,
      metadata,
    } = req.body;

    const garment = await findGarmentByIdentifier(garmentId);

    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    const price = Number(salePrice);

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: "A valid sale price is required" });
    }

    const taxMultiplier = 1 + Number(taxRate) / 100;
    const netAmount = Number((price / taxMultiplier).toFixed(2));
    const taxAmount = Number((price - netAmount).toFixed(2));

    const saleId = await nextSequenceId(RetailSale, "saleId", "SALE");
    const receiptId = await nextSequenceId(RetailSale, "receiptId", "RCP");
    const blockchainHash = hashFor(saleId, garment._id, Date.now());

    const sale = await RetailSale.create({
      saleId,
      receiptId,
      garmentId: garment._id,
      passportId: passportIdFor(garment),
      productName: garment.productName,
      buyerName: buyerName || "Consumer",
      buyerEmail,
      salePrice: price,
      netAmount,
      taxRate,
      taxAmount,
      currency,
      paymentMethod,
      channel,
      soldBy: req.user._id,
      blockchainHash,
      metadata,
    });

    garment.currentOwnerName = buyerName || "Consumer";
    garment.currentOwnerRole = "Consumer";
    garment.retailStatus = "sold";
    garment.retailPrice = price;
    garment.currency = currency;
    await garment.save();

    await OwnershipTransfer.create({
      garmentId: garment._id,
      fromRole: req.user.role,
      toRole: "Consumer",
      fromUser: req.user._id,
      toName: buyerName || "Consumer",
      amount: price,
      currency,
      transferType: "sale",
      transactionHash: blockchainHash,
      notes: `Retail sale ${saleId}`,
    });

    await createBlockchainTransaction({
      transactionType: "RETAIL_SALE_RECORDED",
      entityType: "RetailSale",
      entityId: sale._id,
      garmentId: garment._id,
      user: req.user,
      metadata: {
        saleId,
        receiptId,
        passportId: passportIdFor(garment),
        salePrice: price,
        currency,
      },
    });

    await LifecycleEvent.create({
      garmentId: garment._id,
      stage: "CONSUMER_OWNED",
      description: `Retail sale recorded for ${buyerName || "Consumer"}`,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash,
      metadata: { saleId, receiptId, buyerName, salePrice: price, currency },
    });

    res.status(201).json({
      message: "Retail sale recorded successfully",
      sale,
    });
  } catch (error) {
    console.error("CREATE RETAILER SALE ERROR:", error);
    res.status(500).json({ message: "Failed to record retail sale" });
  }
};

export const getRetailerAuditTrail = async (req, res) => {
  try {
    const [transactions, sales, transfers] = await Promise.all([
      Transaction.find().populate("garmentId").sort({ createdAt: -1 }).limit(80),
      RetailSale.find().sort({ createdAt: -1 }).limit(40),
      OwnershipTransfer.find().populate("garmentId").sort({ createdAt: -1 }).limit(40),
    ]);

    const transactionLogs = transactions.map((tx) => ({
      id: String(tx._id),
      hash: tx.blockchainHash,
      fullHash: tx.blockchainHash,
      type: String(tx.transactionType || "").toLowerCase().includes("sale")
        ? "sale"
        : String(tx.transactionType || "").toLowerCase().includes("scan")
          ? "scan"
          : "receipt",
      title: tx.transactionType,
      desc: `${tx.entityType} transaction committed to LOOPI blockchain`,
      passport: tx.metadata?.passportId || passportIdFor(tx.garmentId),
      date: tx.createdAt,
      time: tx.createdAt,
      status: tx.status,
      block: tx.blockNumber,
      actor: tx.performedRole,
    }));

    const saleLogs = sales.map((sale) => ({
      id: String(sale._id),
      hash: sale.blockchainHash,
      fullHash: sale.blockchainHash,
      type: "sale",
      title: `Sale ${sale.saleId}`,
      desc: `Receipt ${sale.receiptId} issued to ${sale.buyerName}`,
      passport: sale.passportId,
      date: sale.createdAt,
      time: sale.createdAt,
      status: sale.status,
      block: "N/A",
      actor: "Retailer",
    }));

    const transferLogs = transfers.map((transfer) => ({
      id: String(transfer._id),
      hash: transfer.transactionHash,
      fullHash: transfer.transactionHash,
      type: transfer.transferType === "sale" ? "sale" : "arrival",
      title: "Ownership transfer",
      desc: `Ownership moved from ${transfer.fromRole} to ${transfer.toName || transfer.toRole}`,
      passport: passportIdFor(transfer.garmentId),
      date: transfer.createdAt,
      time: transfer.createdAt,
      status: transfer.status,
      block: "N/A",
      actor: transfer.fromRole,
    }));

    const logs = [...transactionLogs, ...saleLogs, ...transferLogs]
      .filter((log) => log.hash)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      stats: {
        entries: logs.length,
        sales: logs.filter((log) => log.type === "sale").length,
        scans: logs.filter((log) => log.type === "scan").length,
        receipts: logs.filter((log) => log.type === "receipt").length,
      },
      logs,
    });
  } catch (error) {
    console.error("RETAILER AUDIT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch retailer audit trail" });
  }
};
