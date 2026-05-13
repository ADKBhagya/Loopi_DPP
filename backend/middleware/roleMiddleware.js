export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const normalizeRole = (role = "") =>
      String(role).toLowerCase().replace(/[\s_-]/g, "");

    const userRole = normalizeRole(req.user?.role);
    const allowedRoles = roles.map(normalizeRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    next();
  };
};
