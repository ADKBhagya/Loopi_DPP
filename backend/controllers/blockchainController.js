import Transaction from "../models/Transaction.js";

/* ======================================================
GET ALL BLOCKCHAIN TRANSACTIONS
====================================================== */

export const getTransactions = async (req, res) => {

  try {

    const transactions =
      await Transaction.find()
        .populate(
          "performedBy",
          "fullName email role"
        )
        .populate(
          "garmentId",
          "productName sku batchNumber category"
        )
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

/* ======================================================
GET BLOCKCHAIN STATS
====================================================== */

export const getBlockchainStats =
  async (req, res) => {

    try {

      const totalTransactions =
        await Transaction.countDocuments();

      const latestTransaction =
        await Transaction.findOne()
          .sort({ createdAt: -1 });

      const latestBlock =
        latestTransaction?.blockNumber || 8442109;

      const activeNodes =
        4;

      res.status(200).json({

        latestBlock,

        activeNodes,

        totalTransactions,

        latestTransaction,

        network:
          process.env.BLOCKCHAIN_NETWORK || "Polygon Amoy Testnet",

        chainId:
          Number(process.env.BLOCKCHAIN_CHAIN_ID || 80002),

        contractAddress:
          process.env.DPP_CONTRACT_ADDRESS || "",

        smartContract:
          "v3.2.1",

        status:
          "ONLINE",

      });

    } catch (error) {

      console.error(
        "BLOCKCHAIN STATS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch blockchain stats",
      });
    }
};

/* ======================================================
GET GARMENT TRANSACTION HISTORY
====================================================== */

export const getGarmentTransactions =
  async (req, res) => {

    try {

      const { garmentId } =
        req.params;

      const transactions =
        await Transaction.find({
          garmentId,
        })
          .populate(
            "performedBy",
            "fullName email role"
          )
          .populate(
            "garmentId",
            "productName sku batchNumber category"
          )
          .sort({ createdAt: -1 });

      res.status(200).json(
        transactions
      );

    } catch (error) {

      console.error(
        "GARMENT TRANSACTION ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch garment transactions",
      });
    }
};
