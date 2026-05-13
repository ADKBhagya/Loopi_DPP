import express from "express";
import { createGarment, getGarments } from "../controllers/garmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), createGarment);
router.get("/", verifyToken, getGarments);

export default router;
