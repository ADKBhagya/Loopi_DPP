import Shipment from "../models/Shipment.js";

export const createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};