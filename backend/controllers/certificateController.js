import crypto from "crypto";

import Certificate from "../models/Certificate.js";
import Garment from "../models/Garment.js";
import { saveUploadedFile } from "../services/fileStorageService.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

/* ======================================================
CREATE CERTIFICATE
====================================================== */

export const createCertificate = async (req, res) => {

  try {

    const {
      garmentId,
      certificateType,
      issuer,
      expiryDate,
      fileName,
      fileUrl,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!garmentId) {
      return res.status(400).json({
        message: "Garment ID is required",
      });
    }

    if (!certificateType) {
      return res.status(400).json({
        message: "Certificate type is required",
      });
    }

    if (!fileName && !req.file) {
      return res.status(400).json({
        message: "Certificate file is required",
      });
    }

    /* ================= FIND GARMENT ================= */

    const garment = await Garment.findById(
      garmentId
    );

    if (!garment) {
      return res.status(404).json({
        message: "Garment not found",
      });
    }

    /* ================= GENERATE HASH ================= */

    const blockchainHash = crypto
      .createHash("sha256")
      .update(
        `${garmentId}-${certificateType}-${Date.now()}`
      )
      .digest("hex");

    /* ================= CREATE CERTIFICATE ================= */

    const storedFile = await saveUploadedFile(req.file, "certificates");

    const certificate = await Certificate.create({

      garmentId,

      garmentName:
        garment.productName,

      certificateType,

      issuer,

      expiryDate,

      fileName:
        storedFile?.fileName || fileName,

      fileUrl:
        storedFile?.url || fileUrl,

      fileKey:
        storedFile?.key,

      fileStorageProvider:
        storedFile?.provider,

      blockchainHash,

      verificationStatus:
        "verified",

      createdBy:
        req.user._id,

    });

    /* =====================================
       BLOCKCHAIN TRANSACTION
    ===================================== */

    await createBlockchainTransaction({

      transactionType:
        "CERTIFICATE_CREATED",

      entityType:
        "Certificate",

      entityId:
        certificate._id,

      garmentId:
        garment._id,

      user:
        req.user,

      metadata: {

        certificateType,

        garmentName:
          garment.productName,

        issuer,

      },

    });

    res.status(201).json(
      certificate
    );

  } catch (error) {

    console.error(
      "CREATE CERTIFICATE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create certificate",
    });
  }
};

/* ======================================================
GET ALL CERTIFICATES
====================================================== */

export const getCertificates = async (req, res) => {

  try {

    const certificates =
      await Certificate.find()
        .sort({ createdAt: -1 });

    res.status(200).json(
      certificates
    );

  } catch (error) {

    console.error(
      "GET CERTIFICATES ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch certificates",
    });
  }
};

/* ======================================================
GET SINGLE CERTIFICATE
====================================================== */

export const getCertificateById = async (req, res) => {

  try {

    const certificate =
      await Certificate.findById(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        message:
          "Certificate not found",
      });
    }

    res.status(200).json(
      certificate
    );

  } catch (error) {

    console.error(
      "GET CERTIFICATE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch certificate",
    });
  }
};

/* ======================================================
DELETE CERTIFICATE
====================================================== */

export const deleteCertificate = async (req, res) => {

  try {

    const certificate =
      await Certificate.findById(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        message:
          "Certificate not found",
      });
    }

    await certificate.deleteOne();

    res.status(200).json({
      message:
        "Certificate deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE CERTIFICATE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete certificate",
    });
  }
};
