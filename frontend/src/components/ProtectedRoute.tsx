import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: Props) => {

  const role =
    localStorage.getItem("userRole");

  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const normalizedAllowedRoles =
    allowedRoles.map((r) =>
      r.toLowerCase().replace(/\s/g, "")
    );

  const normalizedRole =
    role?.toLowerCase().replace(/\s/g, "");

  if (
    !normalizedRole ||
    !normalizedAllowedRoles.includes(
      normalizedRole
    )
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;