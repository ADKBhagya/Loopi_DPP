import mongoose from "mongoose";

const repairServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      unique: true,
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
    garmentName: String,
    service: String,
    type: String,
    technician: String,
    duration: String,
    cost: Number,
    currency: {
      type: String,
      default: "EUR",
    },
    status: {
      type: String,
      enum: ["QUEUED", "IN PROGRESS", "COMPLETED"],
      default: "QUEUED",
      index: true,
    },
    note: String,
    repairCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    consumerActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsumerAction",
    },
    blockchainHash: String,
  },
  { timestamps: true }
);

export default mongoose.model("RepairService", repairServiceSchema);
