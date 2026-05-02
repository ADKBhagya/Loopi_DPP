import SystemConfig from "../models/SystemConfig.js";
import AuditLog from "../models/AuditLog.js";
import ConfigVersion from "../models/ConfigVersion.js";
import { encrypt, decrypt } from "../utils/cryptoUtil.js";

/* ================= ALLOWED CONFIG FIELDS ================= */

const allowedConfigShape = {
  security: ["mfa", "sessionTimeout", "ipAllowlist", "sso"],
  blockchain: ["autoSync", "gasAlerts", "archiveMode", "telemetry"],
  notifications: ["securityAlerts", "nodeAlerts", "digestEmail", "auditExport"],
  integrations: ["apiKey", "rpcUrl", "webhookSecret"],
};

/* ================= SANITIZE PAYLOAD ================= */

const sanitizeConfigPayload = (body) => {
  const cleanPayload = {};

  Object.keys(allowedConfigShape).forEach((section) => {
    if (body[section] && typeof body[section] === "object") {
      cleanPayload[section] = {};

      allowedConfigShape[section].forEach((field) => {
        if (body[section][field] !== undefined) {
          cleanPayload[section][field] = body[section][field];
        }
      });

      if (Object.keys(cleanPayload[section]).length === 0) {
        delete cleanPayload[section];
      }
    }
  });

  return cleanPayload;
};



/* ================= ENCRYPT SECRETS ================= */

const encryptSecrets = (payload, existingConfig) => {
  if (!payload.integrations) return payload;

  ["apiKey", "rpcUrl", "webhookSecret"].forEach((field) => {
    const newValue = payload.integrations[field];
    const oldValue = existingConfig?.integrations?.[field];

    // CASE 1: user did not change field (still ********)
    if (newValue === "********") {
      payload.integrations[field] = oldValue;
      return;
    }

    // CASE 2: new value entered → encrypt
    if (newValue) {
      payload.integrations[field] = encrypt(newValue);
    }
  });

  return payload;
};

/* ================= FIND CHANGED FIELDS ================= */

const getChangedFields = (before, after) => {
  const changes = {};

  Object.keys(allowedConfigShape).forEach((section) => {
    allowedConfigShape[section].forEach((field) => {
      const beforeValue = before?.[section]?.[field];
      const afterValue = after?.[section]?.[field];

      if (beforeValue !== afterValue) {
        if (!changes[section]) changes[section] = {};

        changes[section][field] = {
          from: section === "integrations" ? "********" : beforeValue,
          to: section === "integrations" ? "********" : afterValue,
        };
      }
    });
  });

  return changes;
};

/* ================= GET CONFIG ================= */

export const getConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    const safeConfig = maskSecrets(config);

    res.json(safeConfig);

  } catch (error) {
    console.error("Get Config Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE CONFIG ================= */

export const updateConfig = async (req, res) => {
  try {
    const updated = await SystemConfig.findOneAndUpdate(
      {},
      req.body,
      { returnDocument: "after" } 
    );

    const safeConfig = maskSecrets(updated);

    res.json(safeConfig);

  } catch (error) {
    console.error("Update Config Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= REVEAL SECRETS ================= */

export const revealSecrets = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    return res.status(200).json({
      apiKey: decrypt(config.integrations?.apiKey),
      rpcUrl: decrypt(config.integrations?.rpcUrl),
      webhookSecret: decrypt(config.integrations?.webhookSecret),
    });
  } catch (error) {
    console.error("Reveal Secrets Error:", error);
    return res.status(500).json({
      message: "Failed to reveal secrets",
    });
  }
};

/* ================= GET CONFIG VERSIONS ================= */

export const getConfigVersions = async (req, res) => {
  try {
    const versions = await ConfigVersion.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(versions);
  } catch (error) {
    console.error("Get Config Versions Error:", error);
    return res.status(500).json({
      message: "Failed to load config versions",
    });
  }
};

/* ================= ROLLBACK CONFIG ================= */

export const rollbackConfig = async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await ConfigVersion.findById(versionId);

    if (!version) {
      return res.status(404).json({
        message: "Config version not found",
      });
    }

    const rollbackData = { ...version.configSnapshot };

    delete rollbackData._id;
    delete rollbackData.createdAt;
    delete rollbackData.updatedAt;
    delete rollbackData.__v;

    const currentConfig = await SystemConfig.findOne();

    if (currentConfig) {
      await ConfigVersion.create({
        configSnapshot: currentConfig.toObject(),
        changedBy: req.user?.email || req.user?.role || "Admin",
        reason: "Before rollback backup",
      });
    }

    const updated = await SystemConfig.findOneAndUpdate(
      {},
      { $set: rollbackData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await AuditLog.create({
      action: "CONFIG_ROLLBACK",
      performedBy: req.user?.email || req.user?.role || "Admin",
      details: {
        rolledBackToVersion: versionId,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({
      message: "Configuration rolled back successfully",
      config: maskSecrets(updated),
    });
  } catch (error) {
    console.error("Rollback Config Error:", error);
    return res.status(500).json({
      message: "Failed to rollback configuration",
    });
  }
};

/* ================= MASK SECRETS ================= */

const maskSecrets = (config) => {
  if (!config) return config;

  return {
    ...config.toObject(), // IMPORTANT for mongoose

    integrations: {
      ...config.integrations,

      apiKey: config.integrations?.apiKey
        ? "********"
        : "",

      rpcUrl: config.integrations?.rpcUrl
        ? "********"
        : "",

      webhookSecret: config.integrations?.webhookSecret
        ? "********"
        : "",
    },
  };
};