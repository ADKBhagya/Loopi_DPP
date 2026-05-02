import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { provisionUser } from "../controllers/adminController.js";

import {
  getDashboardStats,
  getPendingUsers,
  approveUser,
  rejectUser,
  getApprovedUsers   
} from "../controllers/adminController.js";

const router = express.Router();

// GET PENDING USERS
router.get("/pending-users", verifyToken, allowRoles("Admin"), getPendingUsers);

// APPROVE USER
router.put("/approve/:id", verifyToken, allowRoles("Admin"), approveUser);

// REJECT USER
router.put("/reject/:id", verifyToken, allowRoles("Admin"), rejectUser);

// DASHBOARD
router.get("/dashboard", verifyToken, allowRoles("Admin"), getDashboardStats);
router.get("/stats", verifyToken, allowRoles("Admin"), getDashboardStats);

router.get(
  "/approved-users",
  verifyToken,
  allowRoles("Admin"),
  getApprovedUsers
);

router.post(
  "/provision-user",
  verifyToken,
  allowRoles("Admin"),
  provisionUser
);

export default router;