import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  getEmissionsSummary,
  getLogisticsOverview,
  getLogisticsShipments,
  getProofOfDelivery,
  updateLogisticsShipment,
} from "../controllers/logisticsController.js";

const router = express.Router();

const logisticsAccess = [
  verifyToken,
  allowRoles("Logistics", "Admin"),
];

router.get(
  "/overview",
  logisticsAccess,
  getLogisticsOverview
);

router.get(
  "/shipments",
  logisticsAccess,
  getLogisticsShipments
);

router.patch(
  "/shipments/:id",
  logisticsAccess,
  updateLogisticsShipment
);

router.get(
  "/proof-of-delivery",
  logisticsAccess,
  getProofOfDelivery
);

router.get(
  "/emissions",
  logisticsAccess,
  getEmissionsSummary
);

export default router;
