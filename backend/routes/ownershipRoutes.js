import express from "express";

import { verifyToken }
from "../middleware/authMiddleware.js";

import { allowRoles }
from "../middleware/roleMiddleware.js";

import {
  transferOwnership,
} from "../controllers/ownershipController.js";

const router = express.Router();

/* ====================================
TRANSFER OWNERSHIP
==================================== */

router.post(
  "/transfer",
  verifyToken,
  allowRoles("Manufacturer"),
  transferOwnership
);

export default router;