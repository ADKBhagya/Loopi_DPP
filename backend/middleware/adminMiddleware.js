export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.put("/system-config", isAdmin, updateConfig);