import User from "../models/User.js";

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