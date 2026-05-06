import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode; 
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
const role = localStorage.getItem("userRole");
const token = localStorage.getItem("token");

if (!token) {
  return <Navigate to="/" />;
}

if (
  !role ||
  !allowedRoles
    .map((r) => r.toLowerCase())
    .includes(role.toLowerCase())
) {
  return <Navigate to="/" />;
}

  return <>{children}</>;
};

export default ProtectedRoute;