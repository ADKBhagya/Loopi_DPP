import mongoose from "mongoose";

const retailSaleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      unique: true,
      index: true,
    },
    receiptId: {
      type: String,
      unique: true,
      index: true,
    },
    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
      required: true,
    },
    passportId: String,
    productName: String,
    buyerName: {
      type: String,
      default: "Consumer",
    },
    buyerEmail: String,
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    netAmount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 19,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    paymentMethod: {
      type: String,
      default: "card",
    },
    channel: {
      type: String,
      default: "store",
    },
    status: {
      type: String,
      enum: ["completed", "refunded", "void"],
      default: "completed",
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    blockchainHash: String,
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("RetailSale", retailSaleSchema);
