import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:12345678_admin@ac-owaq0qj-shard-00-00.xb6nriq.mongodb.net:27017,ac-owaq0qj-shard-00-01.xb6nriq.mongodb.net:27017,ac-owaq0qj-shard-00-02.xb6nriq.mongodb.net:27017/?ssl=true&replicaSet=atlas-tqqhok-shard-0&authSource=admin&appName=loopi-cluster");

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;