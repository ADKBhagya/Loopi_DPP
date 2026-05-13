import Garment from "../models/Garment.js";
import Shipment from "../models/Shipment.js";
import Certificate from "../models/Certificate.js";
import Transaction from "../models/Transaction.js";
import User from "../models/user.js";

/* =========================================
GET MANUFACTURER DASHBOARD STATS
========================================= */

export const getManufacturerDashboard =
async (req, res) => {

  try {

    /* =========================================
    TOTAL COUNTS
    ========================================= */

    const totalGarments =
      await Garment.countDocuments();

    const totalShipments =
      await Shipment.countDocuments();

    const totalCertificates =
      await Certificate.countDocuments();

    const totalTransactions =
      await Transaction.countDocuments();

    /* =========================================
    GARMENT STATUS COUNTS
    ========================================= */

    const approvedGarments =
      await Garment.countDocuments({
        status: "approved",
      });

    const pendingGarments =
      await Garment.countDocuments({
        status: "pending",
      });

    const shipmentGarments =
      await Garment.countDocuments({
        status: { $in: ["shipment", "shipped", "in_transit"] },
      });

    const draftGarments =
      await Garment.countDocuments({
        status: "draft",
      });

    /* =========================================
    RECENT TRANSACTIONS
    ========================================= */

    const recentTransactions =
      await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(5);

    /* =========================================
    RESPONSE
    ========================================= */

    res.status(200).json({

      totalGarments,
      totalShipments,
      totalCertificates,
      totalTransactions,

      approvedGarments,
      pendingGarments,
      shipmentGarments,
      draftGarments,

      recentTransactions,

    });

  } catch (error) {

    console.error(
      "MANUFACTURER DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch dashboard stats",
    });
  }
};

/* =========================================
GET BLOCKCHAIN TRANSACTIONS
========================================= */

export const getTransactions =
async (req, res) => {

  try {

    const transactions =
      await Transaction.find()
        .sort({ createdAt: -1 });

    res.status(200).json(
      transactions
    );

  } catch (error) {

    console.error(
      "GET TRANSACTIONS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch transactions",
    });
  }
};

export const getManufacturerRetailers =
async (req, res) => {

  try {

    const retailers =
      await User.find({
        role: "Retailer",
        status: "approved",
      })
        .select("fullName email organization")
        .sort({ organization: 1, fullName: 1 });

    res.status(200).json(
      retailers.map((retailer) => ({
        id: retailer._id,
        name: retailer.organization || retailer.fullName,
        contact: retailer.fullName,
        email: retailer.email,
        destination: retailer.organization || retailer.fullName,
      }))
    );

  } catch (error) {

    console.error(
      "GET MANUFACTURER RETAILERS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch retailers",
    });
  }
};
