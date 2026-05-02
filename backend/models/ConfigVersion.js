import mongoose from "mongoose";

const configVersionSchema = new mongoose.Schema(
  {
    configSnapshot: {
      type: Object,
      required: true,
    },

    changedBy: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "System configuration updated",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConfigVersion", configVersionSchema);