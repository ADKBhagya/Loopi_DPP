import mongoose from "mongoose";

const consumerActionSchema = new mongoose.Schema(
  {
    actionId: {
      type: String,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["resale", "repair", "recycling", "issue"],
      required: true,
      index: true,
    },
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
      required: true,
      index: true,
    },
    passportId: {
      type: String,
      required: true,
      index: true,
    },
    productName: String,
    status: {
      type: String,
      default: "Submitted",
      index: true,
    },
    details: {
      type: Object,
      default: {},
    },
    blockchainHash: String,
  },
  { timestamps: true }
);

export default mongoose.model("ConsumerAction", consumerActionSchema);
