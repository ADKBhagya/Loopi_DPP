import crypto from "crypto";

import Garment from "../models/Garment.js";
import LifecycleEvent from "../models/LifecycleEvent.js";
import Transaction from "../models/Transaction.js";

export const createLifecycleEvent = async (req, res) => {
  try {
    const { garmentId, stage, description, metadata } = req.body;

    if (!garmentId || !stage) {
      return res.status(400).json({
        message: "Garment ID and lifecycle stage are required",
      });
    }

    const garment = await Garment.findById(garmentId);

    if (!garment) {
      return res.status(404).json({
        message: "Garment not found",
      });
    }

    const blockchainHash = crypto
      .createHash("sha256")
      .update(`${garmentId}-${stage}-${Date.now()}`)
      .digest("hex");

    const lifecycleEvent = await LifecycleEvent.create({
      garmentId,
      stage,
      description,
      actorRole: req.user.role,
      actorId: req.user._id,
      blockchainHash,
      metadata: metadata || {},
    });

    garment.status = stage.toLowerCase();
    await garment.save();

    await Transaction.create({
      action: stage,
      entityType: "LifecycleEvent",
      entityId: lifecycleEvent._id,
      blockchainHash,
      metadata: {
        garmentId,
        stage,
        description,
      },
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Lifecycle event recorded successfully",
      lifecycleEvent,
    });
  } catch (error) {
    console.error("CREATE LIFECYCLE ERROR:", error);

    res.status(500).json({
      message: "Failed to create lifecycle event",
    });
  }
};

export const getLifecycleByGarment = async (req, res) => {
  try {
    const { garmentId } = req.params;

    const events = await LifecycleEvent.find({ garmentId }).sort({
      createdAt: 1,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("GET LIFECYCLE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch lifecycle events",
    });
  }
};