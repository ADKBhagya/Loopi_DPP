import express from "express";

import {
  createCertificate,
  getCertificates,
  getCertificateById,
  deleteCertificate,
} from "../controllers/certificateController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================
CREATE CERTIFICATE
===================================== */

router.post(
  "/",
  verifyToken,
  createCertificate
);

/* =====================================
GET ALL CERTIFICATES
===================================== */

router.get(
  "/",
  verifyToken,
  getCertificates
);

/* =====================================
GET SINGLE CERTIFICATE
===================================== */

router.get(
  "/:id",
  verifyToken,
  getCertificateById
);

/* =====================================
DELETE CERTIFICATE
===================================== */

router.delete(
  "/:id",
  verifyToken,
  deleteCertificate
);

export default router;