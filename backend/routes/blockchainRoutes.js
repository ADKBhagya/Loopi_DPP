import express from "express";

import {
  verifyToken,
} from "../middleware/authMiddleware.js";

import {
  allowRoles,
} from "../middleware/roleMiddleware.js";

import {

  getTransactions,

  getBlockchainStats,

  getGarmentTransactions,

} from "../controllers/blockchainController.js";

const router =
  express.Router();

/* ======================================================
GET ALL TRANSACTIONS
====================================================== */

router.get(
  "/transactions",

  verifyToken,

  allowRoles(
    "Manufacturer",
    "Admin"
  ),

  getTransactions
);

/* ======================================================
GET BLOCKCHAIN STATS
====================================================== */

router.get(
  "/stats",

  verifyToken,

  allowRoles(
    "Manufacturer",
    "Admin"
  ),

  getBlockchainStats
);

/* ======================================================
GET GARMENT TRANSACTIONS
====================================================== */

router.get(
  "/garment/:garmentId",

  verifyToken,

  allowRoles(
    "Manufacturer",
    "Admin"
  ),

  getGarmentTransactions
);

export default router;