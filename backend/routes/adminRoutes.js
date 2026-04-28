import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// 🔹 GET PENDING USERS
router.get(
  "/pending-users",
  verifyToken,
  allowRoles("Admin"),
  async (req, res) => {
    const users = await User.find({ isApproved: false });
    res.json(users);
  }
);

// 🔹 APPROVE USER
router.put(
  "/approve/:id",
  verifyToken,
  allowRoles("Admin"),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json({
      message: "User approved",
      user,
    });
  }
);

// 🔹 REJECT USER
router.delete(
  "/reject/:id",
  verifyToken,
  allowRoles("Admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User rejected and removed",
    });
  }
);

export default router;