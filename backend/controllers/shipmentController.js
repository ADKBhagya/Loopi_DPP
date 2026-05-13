import Shipment from "../models/Shipment.js";
import Garment from "../models/Garment.js";
import User from "../models/user.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

/* =========================================
CREATE SHIPMENT
========================================= */

export const createShipment = async (req, res) => {

  try {
    const retailer =
      req.body.retailerId
        ? await User.findById(req.body.retailerId)
        : null;

    const shipment =
      await Shipment.create({

        ...req.body,
        to:
          retailer?.organization ||
          retailer?.fullName ||
          req.body.to,

        createdBy:
          req.user._id,

      });

    if (shipment.garmentId) {
      const garment = await Garment.findById(shipment.garmentId);

      if (garment) {
        garment.retailStatus = "in_transit";
        garment.status = "in_transit";

        if (retailer) {
          garment.currentOwner = retailer._id;
          garment.currentOwnerName = retailer.organization || retailer.fullName;
          garment.currentOwnerRole = "Retailer";
        }

        await garment.save();
      }
    }

    /* =====================================
       BLOCKCHAIN TRANSACTION
    ===================================== */

    await createBlockchainTransaction({

      transactionType:
        "SHIPMENT_CREATED",

      entityType:
        "Shipment",

      entityId:
        shipment._id,

      garmentId:
        shipment.garmentId,

      user:
        req.user,

      metadata: {

        shipmentId:
          shipment.shipmentId,

        destination:
          shipment.to,

        origin:
          shipment.from,

        transport:
          shipment.transport,

        provider:
          shipment.provider,

      },

    });

    res.status(201).json(
      shipment
    );

  } catch (err) {

    console.error(
      "CREATE SHIPMENT ERROR:",
      err
    );

    res.status(500).json({
      error:
        err.message,
    });
  }
};

/* =========================================
GET SHIPMENTS
========================================= */

export const getShipments = async (req, res) => {

  try {

    const shipments =
      await Shipment.find()
        .sort({ createdAt: -1 });

    res.json(shipments);

  } catch (err) {

    console.error(
      "GET SHIPMENTS ERROR:",
      err
    );

    res.status(500).json({
      error:
        err.message,
    });
  }
};
