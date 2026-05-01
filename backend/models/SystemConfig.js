import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  security: {
    mfa: Boolean,
    sessionTimeout: Boolean,
    ipAllowlist: Boolean,
    sso: Boolean
  },

  blockchain: {
    autoSync: Boolean,
    gasAlerts: Boolean,
    archiveMode: Boolean,
    telemetry: Boolean
  },

  notifications: {
    securityAlerts: Boolean,
    nodeAlerts: Boolean,
    digestEmail: Boolean,
    auditExport: Boolean
  }
});

export default mongoose.model("SystemConfig", configSchema);