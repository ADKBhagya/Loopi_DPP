import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Manufacturer Dashboard API
router.get(
  "/manufacturer",
  verifyToken,
  allowRoles("Manufacturer"),
  (req, res) => {
    res.json({
      message: "Manufacturer Dashboard Data",
      user: req.user,
    });
  }
);

// ✅ Admin Dashboard API
router.get(
  "/admin",
  verifyToken,
  allowRoles("Admin"),
  (req, res) => {
    res.json({
      message: "Admin Dashboard Data",
    });
  }
);

export default router;