import express from "express";
import { createGarment, getGarments } from "../controllers/garmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createGarment);
router.get("/", verifyToken, getGarments);

export default router;