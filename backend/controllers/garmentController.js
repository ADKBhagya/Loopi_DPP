import Garment from "../models/Garment.js";

export const createGarment = async (req, res) => {
  try {
    const garment = await Garment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(garment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGarments = async (req, res) => {
  try {
    const garments = await Garment.find().sort({ createdAt: -1 });
    res.json(garments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};