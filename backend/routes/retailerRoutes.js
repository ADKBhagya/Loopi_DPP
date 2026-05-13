import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  createRetailerSale,
  getRetailerAuditTrail,
  getRetailerInventory,
  getRetailerOverview,
  getRetailerOwnership,
  getRetailerPassport,
  getRetailerSales,
  scanRetailerPassport,
  transferRetailerOwnership,
} from "../controllers/retailerController.js";

const router = express.Router();

const retailerAccess = [
  verifyToken,
  allowRoles("Retailer", "Admin"),
];

router.get("/overview", retailerAccess, getRetailerOverview);
router.get("/inventory", retailerAccess, getRetailerInventory);
router.get("/passport/:id", retailerAccess, getRetailerPassport);
router.post("/passport/scan", retailerAccess, scanRetailerPassport);
router.post("/passport/:id/scan", retailerAccess, scanRetailerPassport);
router.get("/ownership", retailerAccess, getRetailerOwnership);
router.post("/ownership/transfer", retailerAccess, transferRetailerOwnership);
router.get("/sales", retailerAccess, getRetailerSales);
router.post("/sales", retailerAccess, createRetailerSale);
router.get("/audit-trail", retailerAccess, getRetailerAuditTrail);

export default router;
