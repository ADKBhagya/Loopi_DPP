import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import connectDB from "./config/db.js";
import User from "./models/User.js";

const app = express();

app.use(cors());
app.use(express.json());

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


// ================= LOGIN =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful ✅",
      user: {
        email: user.email,
        role: user.role,
      },
    });

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

  // GENERATE TOKEN
  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

  await user.save();

  // TEMP (NO EMAIL YET)
  console.log("RESET LINK:");
  console.log(`http://localhost:5173/reset-password/${token}`);

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
      message: "Invalid or expired token",
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