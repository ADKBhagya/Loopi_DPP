import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import AuthoritySidebar from "./components/Sidebar";
import AuthorityControl from "./views/AuthorityControl";
import ComplianceReview from "./views/ComplianceReview";
import SustainabilityAudit from "./views/SustainabilityAudit";
import PublicRecord from "./views/PublicRecords";

function Authority() {
  const [message, setMessage] = useState("");
  const [view, setView] = useState("control");

  const role = localStorage.getItem("userRole");

  // ROLE PROTECTION
  if (role?.toLowerCase() !== "authority") {
    return <Navigate to="/" />;
  }

  // LOGIN SUCCESS POPUP
  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setMessage(msg);

      localStorage.removeItem("loginSuccess");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, []);

  // VIEW RENDER
  const renderView = () => {
    switch (view) {
      case "control":
        return <AuthorityControl />;

      case "review":
        return <ComplianceReview />;

      case "audit":
        return <SustainabilityAudit />;

      case "records":
        return <PublicRecord />;

      default:
        return <AuthorityControl />;
    }
  };

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      {/* SUCCESS POPUP */}
      {message && (
        <div style={successPopup}>
          <span style={icon}>✔</span>
          {message}
        </div>
      )}

      {/* SIDEBAR */}
      <AuthoritySidebar
        view={view}
        setView={setView}
      />

      {/* MAIN CONTENT */}
      {renderView()}
    </div>
  );
}

/* ================= SUCCESS POPUP ================= */

const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#E6F4EA",
  color: "#1B5E20",
  padding: "14px 20px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 600,
  zIndex: 9999,
};

const icon: React.CSSProperties = {
  background: "#1B5E20",
  color: "white",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 700,
};

export default Authority;