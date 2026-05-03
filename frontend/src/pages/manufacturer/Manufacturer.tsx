import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Dashboard from "./views/Dashboard";

function Manufacturer() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const getRole = () => localStorage.getItem("userRole")?.toLowerCase();

  if (getRole() !== "manufacturer") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/protected/manufacturer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log(data);
        

        setTimeout(() => setShow(false), 2500);
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* TOAST */}
      {message && (
        <div
          style={{
            ...successPopup,
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <CheckCircleRoundedIcon style={icon} />
          <span style={text}>{message}</span>
        </div>
      )}

      {/* REAL DASHBOARD */}
      <Dashboard />
    </>
  );
}

/* ================= STYLES ================= */

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
  transition: "all 0.25s ease",
};

const icon: React.CSSProperties = {
  color: "#16a34a",
  fontSize: "20px",
};

const text: React.CSSProperties = {};

export default Manufacturer;