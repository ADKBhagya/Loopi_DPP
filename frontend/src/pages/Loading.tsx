import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  console.log("ROLE:", role);
  console.log("TOKEN:", token);

  const roleRoutes: Record<string, string> = {
    manufacturer: "/manufacturer",
    logistics: "/logistics",
    auditor: "/auditor",
    authority: "/authority",
    retailer: "/retailer",
    repaircenter: "/repair-center",
    recycler: "/recycler",
    admin: "/admin",
  };

  const timer = setTimeout(() => {
    // ✅ FIRST check role
    const path = roleRoutes[role || ""];

    if (!path) {
      console.warn("Invalid role → redirect login");
      navigate("/");
      return;
    }

    // ✅ THEN check token
    if (!token) {
      console.warn("No token → redirect login");
      navigate("/");
      return;
    }

    // ✅ SUCCESS → go dashboard
    navigate(path);

  }, 1500);

  return () => clearTimeout(timer);
}, [navigate]);

  return (
    <div style={container}>
      <div style={loaderBox}>

        {/* LOGO */}
        <div style={iconBox}>
          <img src={logo} alt="LOOPI" style={logoStyle} />
        </div>

        {/* DOTS */}
        <div style={dots}>
          <span style={{ ...dot, animationDelay: "0s" }}></span>
          <span style={{ ...dot, animationDelay: "0.2s" }}></span>
          <span style={{ ...dot, animationDelay: "0.4s" }}></span>
        </div>

        {/* TEXT */}
        <p style={text}>DECRYPTING SYSTEM NODE</p>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#E5E7EB",
  fontFamily: "'Inter', sans-serif",
};

const loaderBox: React.CSSProperties = {
  textAlign: "center",
};

const iconBox: React.CSSProperties = {
  width: "48px",
  height: "48px",
  background: "#1B5E20",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  animation: "pulse 1.6s ease-in-out infinite",
};

const logoStyle: React.CSSProperties = {
  width: "20px",
  height: "20px",
};

const dots: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "6px",
  marginTop: "10px",
};

const dot: React.CSSProperties = {
  width: "6px",
  height: "6px",
  background: "#1B5E20",
  borderRadius: "50%",
  animation: "blink 1.4s infinite both",
};

const text: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "10px",
  color: "#6B7280",
  letterSpacing: "1.5px",
  textAlign: "center",
  padding: "0 20px",
};


export default Loading;