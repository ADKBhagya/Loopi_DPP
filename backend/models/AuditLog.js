import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  targetUser: String,

  details: Object,

  ipAddress: String, 
  userAgent: String, 

  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditSchema);