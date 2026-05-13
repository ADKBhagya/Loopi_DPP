import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  closeRecyclerLifecycle,
  createRecyclingProcess,
  getLifecycleCloseQueue,
  getRecyclerMaterials,
  getRecyclerProcessing,
  lookupRecyclerPassport,
  updateRecyclingProcess,
} from "../controllers/recyclerController.js";

const router = express.Router();
const recyclerAccess = [verifyToken, allowRoles("Recycler", "Admin")];

router.get("/processing", recyclerAccess, getRecyclerProcessing);
router.post("/processing", recyclerAccess, createRecyclingProcess);
router.patch("/processing/:id", recyclerAccess, updateRecyclingProcess);
router.post("/processing/:id/close", recyclerAccess, closeRecyclerLifecycle);
router.get("/materials", recyclerAccess, getRecyclerMaterials);
router.get("/passport/:id", recyclerAccess, lookupRecyclerPassport);
router.get("/lifecycle-close", recyclerAccess, getLifecycleCloseQueue);

export default router;
