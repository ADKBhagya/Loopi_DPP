import mongoose from "mongoose";

const lifecycleEventSchema = new mongoose.Schema(
  {
    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
      required: true,
    },

    stage: {
      type: String,
      required: true,
      enum: [
        "MANUFACTURED",
        "CERTIFIED",
        "SHIPPED",
        "RETAIL_RECEIVED",
        "CONSUMER_OWNED",
        "REPAIR_REQUESTED",
        "REPAIRED",
        "RECYCLED",
        "ARCHIVED",
      ],
    },

    description: {
      type: String,
      default: "",
    },

    actorRole: {
      type: String,
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    blockchainHash: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("LifecycleEvent", lifecycleEventSchema);