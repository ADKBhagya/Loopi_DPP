import mongoose from "mongoose";

const recyclingProcessSchema = new mongoose.Schema(
  {
    processId: {
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
    material: String,
    stage: {
      type: String,
      enum: ["SORTING", "FIBER RECOVERY", "CHEMICAL SORT", "HARDWARE STRIP", "COMPLETED", "CLOSED"],
      default: "SORTING",
      index: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    weight: String,
    recyclerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    consumerActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsumerAction",
    },
    blockchainHash: String,
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("RecyclingProcess", recyclingProcessSchema);
