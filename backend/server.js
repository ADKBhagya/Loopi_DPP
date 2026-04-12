import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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


app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});