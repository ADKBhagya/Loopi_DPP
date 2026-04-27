import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode; 
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // NOT LOGGED IN
  if (!token) {
    return <Navigate to="/" />;
  }

  // WRONG ROLE
  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;