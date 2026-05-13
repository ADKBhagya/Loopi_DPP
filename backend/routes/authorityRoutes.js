import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getAuthorityControl,
  getComplianceReview,
  getPublicRecords,
  runSustainabilityAudit,
  updateComplianceRecord,
} from "../controllers/authorityController.js";

const router = express.Router();
const authorityAccess = [verifyToken, allowRoles("Authority", "Admin")];

router.get("/control", authorityAccess, getAuthorityControl);
router.patch("/compliance/:id", authorityAccess, updateComplianceRecord);
router.get("/compliance-review", authorityAccess, getComplianceReview);
router.post("/sustainability-audit/run", authorityAccess, runSustainabilityAudit);
router.get("/public-records", authorityAccess, getPublicRecords);

export default router;
