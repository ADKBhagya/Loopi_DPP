import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
      required: true,
    },

    garmentName: {
      type: String,
      required: true,
    },

    certificateType: {
      type: String,
      required: true,
    },

    issuer: {
      type: String,
      default: "LOOPI Verification Authority",
    },

    issuedDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },
    fileKey: {
      type: String,
    },
    fileStorageProvider: {
      type: String,
    },

    blockchainHash: {
      type: String,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["verified", "pending", "rejected"],
      default: "verified",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certificate", certificateSchema);
