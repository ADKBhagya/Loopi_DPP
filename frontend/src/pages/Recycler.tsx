import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Recycler() {
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("userRole");

  if (role !== "Recycler") {
    return <Navigate to="/" />;
  }

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

      <h1>Recycler Dashboard</h1>
    </div>
  );
}

const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#E6F4EA",
  color: "#1B5E20",
  padding: "14px 20px",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 500,
  zIndex: 999,
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
  fontSize: "12px",
};

export default Recycler;