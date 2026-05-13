import express from "express";

import { verifyToken }
from "../middleware/authMiddleware.js";

import { allowRoles }
from "../middleware/roleMiddleware.js";

import {
  getPassportByGarmentId,
} from "../controllers/passportController.js";

const router = express.Router();

/* =========================================
GET PASSPORT BY GARMENT ID
========================================= */

router.get(
  "/:id",
  verifyToken,
  allowRoles("Manufacturer", "Retailer", "Logistics", "Admin"),
  getPassportByGarmentId
);



export default router;
