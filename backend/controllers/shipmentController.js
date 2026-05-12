import Shipment from "../models/Shipment.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

/* =========================================
CREATE SHIPMENT
========================================= */

export const createShipment = async (req, res) => {

  try {

    const shipment =
      await Shipment.create({

        ...req.body,

        createdBy:
          req.user._id,

      });

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
