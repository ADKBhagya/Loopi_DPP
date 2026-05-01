import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  const { fullName, email, password, organization, role } = req.body;

  try {
    // ================= CHECK EXISTING USER =================
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= ROLES THAT NEED ADMIN APPROVAL =================
    const approvalRequiredRoles = [
      "Manufacturer",
      "Logistics",
      "Repair Center",
      "Recycler",
    ]; 

    const isApprovalRequired = approvalRequiredRoles.includes(role);

    // ================= CREATE USER =================
    const newUser = new User({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      organization,
      role,
      status: isApprovalRequired ? "pending" : "approved",
      isApproved: !isApprovalRequired,
    });

    await newUser.save();

    // ================= RESPONSE =================
    res.status(201).json({
      message: isApprovalRequired
        ? "Registration submitted for admin approval"
        : "Account created successfully",
      requiresApproval: isApprovalRequired, // 🔥 important for frontend
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // ================= FIND USER =================
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ================= ROLE VALIDATION =================
    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch" });
    }

    // ================= APPROVAL CHECK =================
    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Your account is pending admin approval",
      });
    }

    // ================= GENERATE TOKEN =================
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    // ================= RESPONSE =================
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};