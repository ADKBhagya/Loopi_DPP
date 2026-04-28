import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  organization: String,
  role: String,
  password: {
    type: String,
    required: true,
  },
  
    // ✅ ADD THIS
  isApproved: {
    type: Boolean,
    default: false,
  },
  
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model("User", userSchema);

export default User;