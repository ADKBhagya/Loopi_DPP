import Garment from "../models/Garment.js";
import Certificate from "../models/Certificate.js";
import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";

/* ======================================================
GET COMPLETE DIGITAL PRODUCT PASSPORT
====================================================== */

export const getPassportByGarmentId = async (req, res) => {

  try {

    const { id } = req.params;

    /* ===============================
       GARMENT
    =============================== */

    const garment = await Garment.findById(id);

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
        owner: shipment.destination || "Unknown",
        organization: shipment.destination || "Distribution Center",
        date: shipment.createdAt,
        status: "TRANSFERRED",
      })),
    ];

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
        completed: false,
      },

      {
        stage: "Consumer Usage",
        completed: false,
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
        `https://loopidpp.online/passport/${garment._id}`,

      publicVerifyUrl:
        `https://loopidpp.online/verify/${garment._id}`,
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