import AuditLog from "../models/AuditLog.js";

// ================= GET AUDIT LOGS =================
export const getAuditLogs = async (req, res) => {
  try {
    const {
      action,
      performedBy,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (action) filter.action = action;
    if (performedBy) filter.performedBy = performedBy;

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Audit Log Error:", error);
    res.status(500).json({
      message: "Failed to fetch audit logs"
    });
  }
};