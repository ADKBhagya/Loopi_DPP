import crypto from "crypto";

import Shipment from "../models/Shipment.js";
import Transaction from "../models/Transaction.js";

import {
  createBlockchainTransaction,
} from "../services/blockchainService.js";

const statusMap = {
  arrived: "delivered",
  delayed: "delayed",
  in_transit: "in_transit",
  delivered: "delivered",
};

const formatShipment = (shipment) => ({
  id: shipment._id,
  shipmentId: shipment.shipmentId || `SHP-${String(shipment._id).slice(-4).toUpperCase()}`,
  garment: shipment.product || "Unassigned garment",
  route: `${shipment.from || "Origin pending"} -> ${shipment.to || "Destination pending"}`,
  from: shipment.from,
  to: shipment.to,
  mode: shipment.transport || "Road",
  distance: shipment.distance || "N/A",
  emissions: shipment.co2 || "0.00 kg",
  eta: shipment.eta || "TBD",
  status: shipment.status || "in_transit",
  provider: shipment.provider || "Unassigned",
  createdAt: shipment.createdAt,
  updatedAt: shipment.updatedAt,
});

export const getLogisticsOverview = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });

    const inTransit = shipments.filter((s) => s.status === "in_transit").length;
    const delivered = shipments.filter((s) => s.status === "delivered").length;
    const delayed = shipments.filter((s) => s.status === "delayed").length;

    res.status(200).json({
      stats: {
        activeVehicles: Math.max(inTransit + delayed, 0),
        inTransit,
        deliveredToday: delivered,
        delayed,
        activeRoutes: new Set(shipments.map((s) => `${s.from}-${s.to}`)).size,
      },
      fleet: shipments.slice(0, 8).map((shipment, index) => ({
        vehicleId: shipment.vehicleId || `FL-${String(shipment._id).slice(-4).toUpperCase()}`,
        status: shipment.status || "in_transit",
        route: `${shipment.from || "Origin"} -> ${shipment.to || "Destination"} · Driver: ${shipment.driver || "Unassigned"}`,
        location: shipment.currentLocation || shipment.from || "Location pending",
        progress: shipment.status === "delivered" ? 100 : shipment.status === "delayed" ? 28 : 62 + (index % 3) * 9,
        load: shipment.load || "N/A",
        transport: shipment.transport || "Road",
        garment: shipment.product || shipment.shipmentId,
      })),
      events: shipments.slice(0, 4).map((shipment) => ({
        time: new Date(shipment.updatedAt || shipment.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        title: `${shipment.shipmentId || "Shipment"} ${shipment.status || "in_transit"}`,
        subtitle: `${shipment.product || "Garment"} on ${shipment.transport || "Road"} route`,
        status: shipment.status || "in_transit",
      })),
    });
  } catch (error) {
    console.error("LOGISTICS OVERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to fetch logistics overview" });
  }
};

export const getLogisticsShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });

    const formatted = shipments.map(formatShipment);

    res.status(200).json({
      stats: {
        inTransit: formatted.filter((s) => s.status === "in_transit").length,
        delivered: formatted.filter((s) => s.status === "delivered").length,
        delayed: formatted.filter((s) => s.status === "delayed").length,
        activeRoutes: new Set(formatted.map((s) => s.route)).size,
      },
      shipments: formatted,
    });
  } catch (error) {
    console.error("LOGISTICS SHIPMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch logistics shipments" });
  }
};

export const updateLogisticsShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, arrivalDate, emission, documents = [] } = req.body;

    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.status = statusMap[status] || status || shipment.status;

    if (arrivalDate) {
      shipment.actualArrivalDate = arrivalDate;
    }

    if (emission) {
      shipment.co2 = `${emission} kg`;
    }

    if (documents.length > 0) {
      shipment.documents = documents;
    }

    await shipment.save();

    await createBlockchainTransaction({
      transactionType: "SHIPMENT_STATUS_UPDATED",
      entityType: "Shipment",
      entityId: shipment._id,
      garmentId: shipment.garmentId,
      user: req.user,
      metadata: {
        shipmentId: shipment.shipmentId,
        status: shipment.status,
        arrivalDate,
        emission,
      },
    });

    res.status(200).json({
      message: "Shipment updated successfully",
      shipment: formatShipment(shipment),
    });
  } catch (error) {
    console.error("UPDATE LOGISTICS SHIPMENT ERROR:", error);
    res.status(500).json({ message: "Failed to update shipment" });
  }
};

export const getProofOfDelivery = async (req, res) => {
  try {
    const deliveredShipments = await Shipment.find({ status: "delivered" })
      .sort({ updatedAt: -1 })
      .limit(50);

    const records = deliveredShipments.map((shipment) => {
      const hash = crypto
        .createHash("sha256")
        .update(`${shipment._id}-${shipment.updatedAt?.toISOString() || ""}`)
        .digest("hex");

      return {
        id: `POD-${String(shipment._id).slice(-6).toUpperCase()}`,
        shipment: shipment.shipmentId || `SHP-${String(shipment._id).slice(-4).toUpperCase()}`,
        garment: shipment.product || "Unassigned garment",
        hash,
        recipient: shipment.to || "Recipient pending",
        signedAt: shipment.updatedAt || shipment.createdAt,
      };
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("POD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch proof of delivery" });
  }
};

export const getEmissionsSummary = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    const numericEmissions = shipments
      .map((shipment) => Number.parseFloat(String(shipment.co2 || "0")))
      .filter((value) => Number.isFinite(value));

    const total = numericEmissions.reduce((sum, value) => sum + value, 0);
    const average = numericEmissions.length ? total / numericEmissions.length : 0;

    const byMode = ["Road", "Ship", "Air"].map((mode) => {
      const modeShipments = shipments.filter((shipment) => shipment.transport === mode);
      const modeTotal = modeShipments.reduce(
        (sum, shipment) => sum + (Number.parseFloat(String(shipment.co2 || "0")) || 0),
        0
      );

      return {
        mode,
        total: Number(modeTotal.toFixed(2)),
        count: modeShipments.length,
      };
    });

    res.status(200).json({
      total: Number(total.toFixed(2)),
      average: Number(average.toFixed(2)),
      shipmentCount: shipments.length,
      byMode,
      latestTransactions: await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(5),
    });
  } catch (error) {
    console.error("EMISSIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch emissions summary" });
  }
};
