import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createRepairService,
  getRepairDashboard,
  getRepairLogs,
  getRepairPassports,
  getRepairQueue,
  getRepairRecords,
  lookupRepairPassport,
  updateRepairService,
} from "../controllers/repairCenterController.js";

const router = express.Router();
const repairCenterAccess = [verifyToken, allowRoles("Repair Center", "Admin")];

router.get("/queue", repairCenterAccess, getRepairQueue);
router.get("/dashboard", repairCenterAccess, getRepairDashboard);
router.post(
  "/queue",
  repairCenterAccess,
  upload.fields([
    { name: "photos", maxCount: 12 },
    { name: "certificates", maxCount: 8 },
  ]),
  createRepairService
);
router.patch(
  "/queue/:id",
  repairCenterAccess,
  upload.fields([
    { name: "photos", maxCount: 12 },
    { name: "certificates", maxCount: 8 },
  ]),
  updateRepairService
);
router.get("/records", repairCenterAccess, getRepairRecords);
router.get("/logs", repairCenterAccess, getRepairLogs);
router.get("/passports", repairCenterAccess, getRepairPassports);
router.get("/passport/:id", repairCenterAccess, lookupRepairPassport);

export default router;
