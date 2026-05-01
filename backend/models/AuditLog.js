import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: String, // APPROVE_USER, LOGIN, CONFIG_CHANGE
  performedBy: String, // admin email
  targetUser: String,
  timestamp: { type: Date, default: Date.now },
  details: Object
});

export default mongoose.model("AuditLog", auditSchema);