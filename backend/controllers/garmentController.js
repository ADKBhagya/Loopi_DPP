import Garment from "../models/Garment.js";
import { saveUploadedFile } from "../services/fileStorageService.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

/* =========================================
CREATE GARMENT
========================================= */

export const createGarment = async (req, res) => {

  try {

    const {
      productName,
      category,
      material,
      manufacturingCountry,
      productionDate,
      batchNumber,
      quantity,
      location,
      materials,
      carbon,
      water,
      logisticsProvider,
      status,
    } = req.body;

    /* =========================================
    VALIDATION
    ========================================= */

    if (!productName) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Garment image is required",
      });
    }

    /* =========================================
    CREATE GARMENT
    ========================================= */

    let parsedMaterials = materials;
    if (typeof materials === "string") {
      try {
        parsedMaterials = JSON.parse(materials || "[]");
      } catch {
        parsedMaterials = materials.split(",").map((item) => item.trim()).filter(Boolean);
      }
    }

    const image = await saveUploadedFile(req.file, "garments");

    const garment = await Garment.create({

      productName,
      category,
      material,
      manufacturingCountry,
      productionDate,
      batchNumber,
      quantity,
      location,
      materials: parsedMaterials,
      carbon,
      water,
      logisticsProvider,
      imageUrl: image?.url,
      imageKey: image?.key,
      imageStorageProvider: image?.provider,
      status: status || "draft",

      createdBy: req.user._id,

    });

    /* =========================================
    BLOCKCHAIN TRANSACTION
    ========================================= */

    await createBlockchainTransaction({

      transactionType:
        "GARMENT_CREATED",

      entityType:
        "Garment",

      entityId:
        garment._id,

      garmentId:
        garment._id,

      user:
        req.user,

      metadata: {

        productName:
          garment.productName,

        category:
          garment.category,

        material:
          garment.material || garment.materials?.join(", "),

        manufacturingCountry:
          garment.manufacturingCountry,

        batchNumber:
          garment.batchNumber,

        quantity:
          garment.quantity,

        location:
          garment.location,

        carbon:
          garment.carbon,

        water:
          garment.water,

        imageUrl:
          garment.imageUrl,

      },

    });

    /* =========================================
    RESPONSE
    ========================================= */

    res.status(201).json(garment);

  } catch (error) {

    console.error(
      "CREATE GARMENT ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to create garment",
    });
  }
};

/* =========================================
GET GARMENTS
========================================= */

export const getGarments = async (req, res) => {

  try {

    const garments =
      await Garment.find()
        .sort({ createdAt: -1 });

    res.status(200).json(
      garments
    );

  } catch (error) {

    console.error(
      "GET GARMENTS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch garments",
    });
  }
};
