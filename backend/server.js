import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import User from "./models/user.js";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import garmentRoutes from "./routes/garmentRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import passportRoutes from "./routes/passportRoutes.js";
import ownershipRoutes from "./routes/ownershipRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";

import { sendResetEmail } from "./utils/emailService.js";

/* =========================
   ENV CONFIG
========================= */

dotenv.config();

/* =========================
   EXPRESS APP
========================= */

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://loopidpp.online"
  ],
  credentials: true
}));

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/garments", garmentRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/manufacturer",manufacturerRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api/ownership", ownershipRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/lifecycle", lifecycleRoutes);
app.use("/api/blockchain", blockchainRoutes);
/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, organization, role, password } = req.body;

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = new User({
      fullName,
      email,
      organization,
      role,
      password: hashedPassword,
      status: "pending",
      isApproved: false
    });

    await newUser.save();

    res.json({
      message: "User registered successfully ✅"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */

app.post("/api/auth/forgot-password", async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent"
      });
    }

    // GENERATE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    /* =========================
       RESET LINK
    ========================= */

    const resetLink =
      `https://loopidpp.online/reset-password/${token}`;

    // SEND EMAIL
    await sendResetEmail(email, resetLink);

    res.json({
      message: "Reset link sent to your email"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =========================
   RESET PASSWORD
========================= */

app.post("/api/auth/reset-password", async (req, res) => {

  try {

    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // CLEAR TOKEN
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =========================
   TEST PENDING USERS
========================= */

app.get("/test-pending", async (req, res) => {

  try {

    const users = await User.find({
      status: "pending"
    });

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
