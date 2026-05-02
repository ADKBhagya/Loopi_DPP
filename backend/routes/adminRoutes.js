import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { provisionUser } from "../controllers/adminController.js";
import { getAuditLogs } from "../controllers/auditController.js";

import {
  getDashboardStats,
  getPendingUsers,
  approveUser,
  rejectUser,
  getApprovedUsers   
} from "../controllers/adminController.js";

import {
  getConfig,
  updateConfig,
  revealSecrets,
  getConfigVersions,
  rollbackConfig,
} from "../controllers/configController.js";

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

router.get(
  "/system-config",
  verifyToken,
  allowRoles("Admin"),
  getConfig
);

router.put(
  "/system-config",
  verifyToken,
  allowRoles("Admin"),
  updateConfig
);

router.get(
  "/audit-logs",
  verifyToken,
  allowRoles("Admin"),
  getAuditLogs
);

router.get(
  "/system-config/versions",
  verifyToken,
  allowRoles("Admin"),
  getConfigVersions
);

router.put(
  "/system-config/rollback/:versionId",
  verifyToken,
  allowRoles("Admin"),
  rollbackConfig
);

router.get(
  "/system-config/reveal",
  verifyToken,
  allowRoles("Admin"),
  revealSecrets
);

export default router;