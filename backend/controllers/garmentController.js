import Garment from "../models/Garment.js";

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

    /* =========================================
    CREATE GARMENT
    ========================================= */

    const garment = await Garment.create({

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
