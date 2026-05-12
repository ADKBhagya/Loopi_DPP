import crypto from "crypto";

import Garment from "../models/Garment.js";
import OwnershipTransfer
from "../models/OwnershipTransfer.js";

export const transferOwnership =
async (req, res) => {

  try {

    const {
      garmentId,
      toUser,
      toRole,
      notes,
    } = req.body;

    /* =========================
       FIND GARMENT
    ========================= */

    const garment =
      await Garment.findById(garmentId);

    if (!garment) {
      return res.status(404).json({
        message: "Garment not found",
      });
    }

    /* =========================
       GENERATE HASH
    ========================= */

    const transactionHash =
      crypto
        .createHash("sha256")
        .update(
          `${garmentId}-${Date.now()}`
        )
        .digest("hex");

    /* =========================
       CREATE TRANSFER
    ========================= */

    const transfer =
      await OwnershipTransfer.create({

        garmentId,

        fromRole: req.user.role,

        toRole,

        fromUser: req.user._id,

        toUser,

        transactionHash,

        notes,

      });

    /* =========================
       UPDATE GARMENT OWNER
    ========================= */

    garment.currentOwner = toUser;

    garment.currentOwnerRole = toRole;

    await garment.save();

    /* =========================
       RESPONSE
    ========================= */

    res.status(201).json({

      message:
        "Ownership transferred successfully",

      transfer,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Ownership transfer failed",
    });
  }
};