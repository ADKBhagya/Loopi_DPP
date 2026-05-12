import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: String,
    garmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garment",
    },
    product: String,
    from: String,
    to: String,
    transport: String,
    provider: String,
    eta: String,
    co2: String,
    status: {
      type: String,
      default: "in_transit",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);
