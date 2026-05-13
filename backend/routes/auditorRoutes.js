import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getAuditQueue,
  getAuditTrail,
  getLifecycleReview,
  runComplianceCheck,
  updateAuditDecision,
  verifyLifecycleStage,
} from "../controllers/auditorController.js";

const router = express.Router();
const auditorAccess = [verifyToken, allowRoles("Auditor", "Admin", "Authority")];

router.get("/queue", auditorAccess, getAuditQueue);
router.patch("/queue/:id", auditorAccess, updateAuditDecision);
router.post("/compliance-check", auditorAccess, runComplianceCheck);
router.get("/lifecycle/:passportId", auditorAccess, getLifecycleReview);
router.post("/lifecycle/:passportId/stages/:stageId/verify", auditorAccess, verifyLifecycleStage);
router.get("/audit-trail", auditorAccess, getAuditTrail);

export default router;
