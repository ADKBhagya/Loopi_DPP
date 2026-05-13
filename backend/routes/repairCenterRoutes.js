import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createRepairService,
  getRepairLogs,
  getRepairQueue,
  getRepairRecords,
  lookupRepairPassport,
  updateRepairService,
} from "../controllers/repairCenterController.js";

const router = express.Router();
const repairCenterAccess = [verifyToken, allowRoles("Repair Center", "Admin")];

router.get("/queue", repairCenterAccess, getRepairQueue);
router.post("/queue", repairCenterAccess, createRepairService);
router.patch("/queue/:id", repairCenterAccess, updateRepairService);
router.get("/records", repairCenterAccess, getRepairRecords);
router.get("/logs", repairCenterAccess, getRepairLogs);
router.get("/passport/:id", repairCenterAccess, lookupRepairPassport);

export default router;
