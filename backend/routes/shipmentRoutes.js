import express from "express";
import { createShipment, getShipments } from "../controllers/shipmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createShipment);
router.get("/", verifyToken, getShipments);

export default router;