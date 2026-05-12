import mongoose from "mongoose";

const garmentSchema = new mongoose.Schema({
  productName: String,
  category: String,
  material: String,
  manufacturingCountry: String,
  productionDate: Date,
  batchNumber: String,
  quantity: Number,
  location: String,
  materials: [String],
  carbon: String,
  water: String,
  logisticsProvider: String,
  status: {
    type: String,
    default: "draft",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Garment", garmentSchema);
