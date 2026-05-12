import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
  createLifecycleEvent,
  getLifecycleByGarment,
} from "../controllers/lifecycleController.js";

const router = express.Router();

router.post("/", verifyToken, createLifecycleEvent);

router.get("/:garmentId", verifyToken, getLifecycleByGarment);

export default router;