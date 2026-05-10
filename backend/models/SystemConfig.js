import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    security: {
      mfa: { type: Boolean, default: false },
      sessionTimeout: { type: Number, default: 30 },
      ipAllowlist: { type: Boolean, default: false },
      sso: { type: Boolean, default: false }
    },

    blockchain: {
      autoSync: { type: Boolean, default: true },
      gasAlerts: { type: Boolean, default: true },
      archiveMode: { type: Boolean, default: false },
      telemetry: { type: Boolean, default: true }
    },

    notifications: {
      securityAlerts: { type: Boolean, default: true },
      nodeAlerts: { type: Boolean, default: true },
      digestEmail: { type: Boolean, default: false },
      auditExport: { type: Boolean, default: false }
    },

    integrations: {
      apiKey: String,
      rpcUrl: String,
      webhookSecret: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("SystemConfig", configSchema);