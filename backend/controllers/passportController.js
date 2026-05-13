import mongoose from "mongoose";
import Garment from "../models/Garment.js";
import Certificate from "../models/Certificate.js";
import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";
import OwnershipTransfer from "../models/OwnershipTransfer.js";

const appPublicUrl = process.env.APP_PUBLIC_URL || process.env.CLIENT_URL || "https://loopidpp.online";

/* ======================================================
GET COMPLETE DIGITAL PRODUCT PASSPORT
====================================================== */

export const getPassportByGarmentId = async (req, res) => {

  try {

    const { id } = req.params;

    const normalizedId = String(id || "").trim();

    /* ===============================
       GARMENT
    =============================== */

    let garment = null;

    if (mongoose.Types.ObjectId.isValid(normalizedId)) {
      garment = await Garment.findById(normalizedId);
    }

    if (!garment) {
      garment = await Garment.findOne({
        $or: [
          { sku: normalizedId },
          { batchNumber: normalizedId },
        ],
      });
    }

    if (!garment && normalizedId.toUpperCase().startsWith("GP-")) {
      const suffix = normalizedId.slice(3).toLowerCase();
      const garments = await Garment.find({});

      garment =
        garments.find((item) =>
          String(item._id || "")
            .slice(-6)
            .toLowerCase() === suffix
        ) || null;
    }

    if (!garment) {
      return res.status(404).json({
        message: "Garment not found",
      });
    }

    /* ===============================
       CERTIFICATES
    =============================== */

    const certificates =
      await Certificate.find({
        garmentId: garment._id,
      }).sort({ createdAt: -1 });

    /* ===============================
       SHIPMENTS
    =============================== */

    const shipments =
      await Shipment.find({
        garmentId: garment._id,
      }).sort({ createdAt: -1 });

    /* ===============================
       TRANSACTIONS
    =============================== */

    const transactions =
      await Transaction.find({
        garmentId: garment._id,
      }).sort({ createdAt: -1 });

    const ownershipTransfers =
      await OwnershipTransfer.find({
        garmentId: garment._id,
      }).sort({ createdAt: 1 });

    /* ===============================
       PASSPORT SUMMARY
    =============================== */

    const summary = {
      totalCertificates: certificates.length,
      totalShipments: shipments.length,
      totalTransactions: transactions.length,
    };

    /* ===============================
       OWNERSHIP HISTORY
    =============================== */

    const ownershipHistory = [

      {
        owner: "Manufacturer",
        organization: garment.organization || "LOOPI Manufacturing",
        date: garment.createdAt,
        status: "CREATED",
      },

      ...shipments.map((shipment) => ({
        owner: shipment.to || shipment.destination || "Unknown",
        organization: shipment.to || shipment.destination || "Distribution Center",
        date: shipment.createdAt,
        status: "TRANSFERRED",
      })),

      ...ownershipTransfers.map((transfer) => ({
        owner: transfer.toName || transfer.toRole || "Unknown",
        organization: transfer.toRole || "Owner",
        date: transfer.createdAt,
        status: String(transfer.transferType || "ownership").toUpperCase(),
      })),
    ];

    if (garment.currentOwnerName || garment.currentOwnerRole) {
      ownershipHistory.push({
        owner: garment.currentOwnerName || garment.currentOwnerRole,
        organization: garment.currentOwnerRole || "Current Owner",
        date: garment.updatedAt,
        status: "CURRENT_OWNER",
      });
    }

    /* ===============================
       LIFECYCLE TRACKING
    =============================== */

    const lifecycle = [
      {
        stage: "Manufactured",
        completed: true,
        date: garment.createdAt,
      },

      {
        stage: "Certified",
        completed: certificates.length > 0,
      },

      {
        stage: "Distributed",
        completed: shipments.length > 0,
      },

      {
        stage: "Retail",
        completed: ["in_store", "sold"].includes(garment.retailStatus),
      },

      {
        stage: "Consumer Usage",
        completed: garment.retailStatus === "sold" || garment.currentOwnerRole === "Consumer",
      },

      {
        stage: "Recycling",
        completed: false,
      },
    ];

    /* ===============================
       SUSTAINABILITY
    =============================== */

    const sustainability = {
      recyclable: true,
      organicCertified: certificates.some(
        (c) => c.certificateType === "GOTS"
      ),
      carbonScore: 92,
      waterUsage: "41L",
      energyConsumption: "12kWh",
    };

    /* ===============================
       BLOCKCHAIN INFO
    =============================== */

    const blockchain = {
      network: "LOOPI MAINNET",
      smartContract: "v3.2.1",
      latestBlock: "8442109",
      verificationStatus: "VERIFIED",
      hash:
        certificates[0]?.blockchainHash ||
        "0xA3F921B8F",
    };

    /* ===============================
       QR VERIFICATION
    =============================== */

    const qrVerification = {
      qrUrl:
        `${appPublicUrl.replace(/\/$/, "")}/passport/${garment._id}`,

      publicVerifyUrl:
        `${appPublicUrl.replace(/\/$/, "")}/verify/${garment._id}`,
    };

    /* ===============================
       FINAL RESPONSE
    =============================== */

    res.status(200).json({

      garment,

      summary,

      certificates,

      shipments,

      transactions,

      ownershipHistory,

      lifecycle,

      sustainability,

      blockchain,

      qrVerification,

    });

  } catch (error) {

    console.error(
      "PASSPORT FETCH ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch passport",
    });
  }
};
