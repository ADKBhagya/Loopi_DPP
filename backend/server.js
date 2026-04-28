import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { sendResetEmail } from "./utils/emailService.js";

const app = express();

// ✅ FIRST
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ SECOND
app.use(express.json());

// ✅ THEN routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/protected", protectedRoutes);

// 🔥 CONNECT DB
connectDB();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});


// ================= REGISTER =================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, organization, role, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      fullName,
      email,
      organization,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// ================= FORGOT PASSWORD =================
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "If this email exists, a reset link has been sent",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  await sendResetEmail(email, resetLink);

  res.json({
    message: "Reset link sent to your email",
  });
});


// ================= RESET PASSWORD =================
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
  return res.status(400).json({
    message: "Invalid or expired reset link",
  });
}

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({
    message: "Password updated successfully",
  });
});












app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});