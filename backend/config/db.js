import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:12345678_admin@loopi-cluster.xb6nriq.mongodb.net/?appName=loopi-cluster");

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;