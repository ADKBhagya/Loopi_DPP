import mongoose from "mongoose";

const garmentSchema = new mongoose.Schema({
  productName: String,
  location: String,
  materials: [String],
  carbon: String,
  water: String,
  logisticsProvider: String,
  status: {
    type: String,
    default: "draft",
  },
  createdBy: String,
}, { timestamps: true });

export default mongoose.model("Garment", garmentSchema);