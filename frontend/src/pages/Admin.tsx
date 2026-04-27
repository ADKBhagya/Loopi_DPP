import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Admin() {
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("userRole");

  // ROLE PROTECTION
  if (role !== "Admin") {
    return <Navigate to="/" />;
  }

  // SUCCESS POPUP
  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setMessage(msg);
      localStorage.removeItem("loginSuccess");

      setTimeout(() => setMessage(""), 3000);
    }
  }, []);

  return (
    <div>
      {message && (
        <div style={successPopup}>
          <span style={icon}>✔</span>
          {message}
        </div>
      )}

      <h1>Admin Dashboard</h1>
    </div>
  );
}

/* SAME STYLE */
const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#EDF7ED",
  color: "#166534",
  padding: "12px 16px",
  borderRadius: "12px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 500,
  zIndex: 999,
  border: "1px solid #CDEEDB",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all 0.25s ease",
  fontFamily: "'Inter', sans-serif",
};

const icon: React.CSSProperties = {
  color: "#16a34a",
  fontSize: "20px",
  flexShrink: 0,
};

export default Admin;