import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: String,
    product: String,
    from: String,
    to: String,
    transport: String,
    provider: String,
    eta: String,
    status: {
      type: String,
      default: "in_transit",
    },
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);