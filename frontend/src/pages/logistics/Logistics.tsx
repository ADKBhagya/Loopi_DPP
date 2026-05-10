import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FleetOverview from "./views/FleetOverview";
import ActiveShipments from "./views/ActiveShipments";
import ProofOfDelivery from "./views/ProofOfDelivery";
import EmissionsData from "./views/EmissionsData";

function Logistics() {
  const [message, setMessage] = useState("");
  const [view, setView] = useState("overview");

  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setMessage(msg);
      localStorage.removeItem("loginSuccess");

      setTimeout(() => setMessage(""), 3000);
    }
  }, []);

  return (
    <div style={page}>

      <Sidebar view={view} setView={setView} />

      <div style={main}>

        <Topbar />

        {message && (
          <div style={successPopup}>
            <span style={icon}>✔</span>
            {message}
          </div>
        )}

        {/* CONTENT */}
{view === "overview" && <FleetOverview />}
{view === "shipments" && <ActiveShipments />}
{view === "delivery" && <ProofOfDelivery />}
{view === "emissions" && <EmissionsData />}

      </div>
    </div>
  );
}

export default Logistics;

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#F4F7FB",
  fontFamily: "'Inter', sans-serif",
};

const main: React.CSSProperties = {
  flex: 1,
  marginLeft: "260px",
};

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
};

const icon: React.CSSProperties = {
  color: "#16a34a",
  fontSize: "18px",
};