import express from "express";

import {
  createCertificate,
  getCertificates,
  getCertificateById,
  deleteCertificate,
} from "../controllers/certificateController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
CREATE
POST /api/certificates
====================================================== */

router.post(
  "/",
  verifyToken,
  createCertificate
);

/* ======================================================
GET ALL
GET /api/certificates
====================================================== */

router.get(
  "/",
  verifyToken,
  getCertificates
);

/* ======================================================
GET SINGLE
GET /api/certificates/:id
====================================================== */

router.get(
  "/:id",
  verifyToken,
  getCertificateById
);

/* ======================================================
DELETE
DELETE /api/certificates/:id
====================================================== */

router.delete(
  "/:id",
  verifyToken,
  deleteCertificate
);

export default router;