import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";




// ================= DASHBOARD STATS =================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ status: "pending" });
    const approvedUsers = await User.countDocuments({ status: "approved" });
    

    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      activeNodes: 4,
      systemHealth: "Operational",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PENDING USERS =================
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= APPROVE USER =================
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        isApproved: true,
      },
      { new: true }
    );

    res.json({ message: "User approved", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REJECT USER =================
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        isApproved: false,
      },
      { new: true }
    );

    res.json({ message: "User rejected", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({
      status: { $in: ["approved", "rejected"] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const provisionUser = async (req, res) => {
  try {
    const { fullName, email, role, organization, status } = req.body;

    const existing = await User.findOne({ email });

    if (!fullName || !email || !role || !organization) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const tempPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      organization,

      // DYNAMIC STATUS
      status: status === "suspended" ? "rejected" : "approved",
      isApproved: status !== "suspended",
    });

    await newUser.save();

    res.json({
      message: "User provisioned successfully",
      tempPassword,
    });

  } catch (err) {
  console.error("Provision Error:", err);
  res.status(500).json({ message: err.message }); 
}
};

