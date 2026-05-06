import { useEffect, useState } from "react";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import AuditQueue from "./views/AuditQueue";
import LifecycleReview from "./views/LifecycleReview";
import ComplianceCheck from "./views/ComplianceCheck";
import AuditTrail from "./views/AuditTrail";

function Auditor() {
  const [message, setMessage] = useState("");

  const [view, setView] = useState("queue");

  // SUCCESS TOAST
  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setMessage(msg);

      localStorage.removeItem("loginSuccess");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    }
  }, []);

  // DYNAMIC VIEW RENDER
  const renderView = () => {
    switch (view) {
      case "queue":
        return <AuditQueue />;

      case "lifecycle":
        return <LifecycleReview />;

      case "compliance":
        return <ComplianceCheck />;

      case "trail":
        return <AuditTrail />;

      default:
        return <AuditQueue />;
    }
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar view={view} setView={setView} />

      {/* TOPBAR */}
      <Topbar />

      {/* SUCCESS POPUP */}
      {message && (
        <div style={successPopup}>
          <CheckCircleRoundedIcon style={icon} />

          <span style={text}>{message}</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="ml-[210px] pt-[92px] px-8 pb-8">
        {renderView()}
      </main>

    </div>
  );
}

/* ================= STYLES ================= */

const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#EDF7ED",
  color: "#166534",
  padding: "14px 18px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  zIndex: 9999,
  border: "1px solid #C8E6C9",
};

const icon: React.CSSProperties = {
  fontSize: "22px",
};

const text: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
};

export default Auditor;