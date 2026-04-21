import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  organisation: String,
  role: String,
  password: {
    type: String,
    required: true,
  },
  
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model("User", userSchema);

export default User;