import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    /* =====================================
       TRANSACTION TYPE
    ===================================== */

    transactionType: {
      type: String,
      required: true,
    },

    /* =====================================
       ENTITY DETAILS
    ===================================== */

    entityType: {
      type: String,
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    /* =====================================
       GARMENT REFERENCE
    ===================================== */

    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
    },

    /* =====================================
       BLOCKCHAIN HASH
    ===================================== */

    blockchainHash: {
      type: String,
      required: true,
    },

    /* =====================================
       USER / ROLE
    ===================================== */

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    performedRole: {
      type: String,
    },

    /* =====================================
       NETWORK INFO
    ===================================== */

    network: {
      type: String,
      default: "Polygon Amoy Testnet",
    },

    chainId: {
      type: Number,
      default: 80002,
    },

    contractAddress: {
      type: String,
      default: "",
    },

    explorerUrl: {
      type: String,
      default: "",
    },

    smartContractVersion: {
      type: String,
      default: "v3.2.1",
    },

    /* =====================================
       STATUS
    ===================================== */

    status: {
      type: String,
      default: "CONFIRMED",
    },

    /* =====================================
       GAS / BLOCK
    ===================================== */

    blockNumber: {
      type: Number,
      default: () =>
        Math.floor(
          8000000 + Math.random() * 100000
        ),
    },

    gasUsed: {
      type: Number,
      default: () =>
        Math.floor(
          20000 + Math.random() * 5000
        ),
    },

    /* =====================================
       METADATA
    ===================================== */

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;
