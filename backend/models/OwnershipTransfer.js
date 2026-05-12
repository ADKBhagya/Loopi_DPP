import mongoose from "mongoose";

const ownershipTransferSchema =
  new mongoose.Schema({

    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
      required: true,
    },

    fromRole: {
      type: String,
      required: true,
    },

    toRole: {
      type: String,
      required: true,
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionHash: {
      type: String,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      default: "completed",
    },

  }, {
    timestamps: true,
  });

export default mongoose.model(
  "OwnershipTransfer",
  ownershipTransferSchema
);