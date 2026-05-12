import express from "express";

import { verifyToken }
from "../middleware/authMiddleware.js";

import { allowRoles }
from "../middleware/roleMiddleware.js";

import {

  getManufacturerDashboard,

  getTransactions,

} from "../controllers/manufacturerController.js";

import {

  getGarments,
  createGarment,

} from "../controllers/garmentController.js";

import {

  getCertificates,
  createCertificate,

} from "../controllers/certificateController.js";

import {

  getShipments,
  createShipment,

} from "../controllers/shipmentController.js";

const router = express.Router();

/* ====================================
MANUFACTURER DASHBOARD
==================================== */

router.get(
  "/dashboard",
  verifyToken,
  allowRoles("Manufacturer"),
  getManufacturerDashboard
);

/* ====================================
BLOCKCHAIN TRANSACTIONS
==================================== */

router.get(
  "/transactions",
  verifyToken,
  allowRoles("Manufacturer"),
  getTransactions
);

/* ====================================
GARMENTS
==================================== */

router.get(
  "/garments",
  verifyToken,
  allowRoles("Manufacturer"),
  getGarments
);

router.post(
  "/garments",
  verifyToken,
  allowRoles("Manufacturer"),
  createGarment
);

/* ====================================
CERTIFICATES
==================================== */

router.get(
  "/certificates",
  verifyToken,
  allowRoles("Manufacturer"),
  getCertificates
);

router.post(
  "/certificates",
  verifyToken,
  allowRoles("Manufacturer"),
  createCertificate
);

/* ====================================
SHIPMENTS
==================================== */

router.get(
  "/shipments",
  verifyToken,
  allowRoles("Manufacturer"),
  getShipments
);

router.post(
  "/shipments",
  verifyToken,
  allowRoles("Manufacturer"),
  createShipment
);

export default router;