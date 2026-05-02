import SystemConfig from "../models/SystemConfig.js";
import AuditLog from "../models/AuditLog.js";

// ================= GET CONFIG =================
export const getConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();

    // First time → create default config
    if (!config) {
      config = await SystemConfig.create({});
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE CONFIG =================
export const updateConfig = async (req, res) => {
  try {
    const existing = await SystemConfig.findOne();

    const updated = await SystemConfig.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    // ✅ AUDIT LOG
    await AuditLog.create({
      action: "CONFIG_CHANGE",
      performedBy: req.user?.email || "Admin",
      details: {
        before: existing,
        after: updated
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Configuration updated successfully",
      config: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};