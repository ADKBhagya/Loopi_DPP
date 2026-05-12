import express from "express";

import {
  verifyPassport,
} from "../controllers/verificationController.js";

const router = express.Router();

/* ====================================
PUBLIC PASSPORT VERIFICATION
==================================== */

router.get(
  "/:garmentId",
  verifyPassport
);

export default router;