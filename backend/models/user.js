// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,

  organization: String,

  role: {
    type: String,
    enum: ["Admin", "Manufacturer", "Retailer", "Auditor", "Authority", "Logistics", "Repair Center", "Recycler", "Consumer"],
    default: "Manufacturer"
  },

status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
isApproved: {
  type: Boolean,
  default: false,
},

  createdAt: { type: Date, default: Date.now },

  // SECURITY
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },

  // RESET
  resetToken: String,
  resetTokenExpiry: Date
});

export default mongoose.model("User", userSchema);