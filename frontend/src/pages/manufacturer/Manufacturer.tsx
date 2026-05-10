import { useState } from "react";
import { Navigate } from "react-router-dom";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Dashboard from "./views/Dashboard";

const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "16px",
  right: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 16px",
  borderRadius: "8px",
  background: "#e8f5e9",
  color: "#2e7d32",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
  transition: "opacity 0.2s ease, transform 0.2s ease",
  zIndex: 1000,
};

const icon: React.CSSProperties = {
  fontSize: "20px",
};

function Manufacturer() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // ✅ SIMPLE & STABLE CHECK
  if (!token || !role || role.toLowerCase() !== "manufacturer") {
    return <Navigate to="/" />;
  }

  return (
    <>
      {message && (
        <div
          style={{
            ...successPopup,
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <CheckCircleRoundedIcon style={icon} />
          <span>{message}</span>
        </div>
      )}

      <Dashboard />
    </>
  );
}

export default Manufacturer;