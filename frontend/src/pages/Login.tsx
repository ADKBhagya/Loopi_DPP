import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

type Errors = {
  email?: string;
  password?: string;
  role?: string;
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Manufacturer");

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(""); 

  const validate = () => {
    const newErrors: Errors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!role.trim()) {
      newErrors.role = "Please select an access role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setSuccess("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: "Invalid email or password" });
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

            // Save message for next page
      localStorage.setItem("loginSuccess", `Welcome back, ${email}!`);

      // Redirect immediately
      localStorage.setItem("userRole", role);

      if (role === "Manufacturer") {
        window.location.href = "/manufacturer";
      } else if (role === "Logistics") {
        window.location.href = "/logistics";
      } else if (role === "Auditor") {
        window.location.href = "/auditor";
      } else if (role === "Authority") {
        window.location.href = "/authority";
      } else if (role === "Retailer") {
        window.location.href = "/retailer";
      } else if (role === "Repair Center") {
        window.location.href = "/repair-center";
      } else if (role === "Recycler") {
        window.location.href = "/recycler";
      } else if (role === "Admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  const msg = localStorage.getItem("loginSuccess");

  if (msg) {
    setSuccess(msg);

    localStorage.removeItem("loginSuccess");

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }
}, []);

  const getFieldWrapperStyle = (fieldName: string) => {
    if (errors[fieldName as keyof Errors]) {
      return { ...inputWrapper, ...inputError };
    }

    if (focusedField === fieldName) {
      return { ...inputWrapper, ...inputFocus };
    }

    return inputWrapper;
  };

  return (
    <div style={container}>

      {/* SUCCESS POPUP */}
      {success && (
        <div style={successPopup}>
          <span style={successIcon}>✔</span>
          {success}
        </div>
      )}

      <div style={card}>
        <div style={topLine}></div>

        <div style={content}>
          <div style={logoBox}>
            <div style={logoWrapper}>
              <img src={logo} style={{ width: 18 }} />
            </div>

            <h2 style={title}>LOOPI</h2>

            <p style={subtitle}>
              BLOCKCHAIN DIGITAL PRODUCT PASSPORT
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* EMAIL */}
            <div style={field}>
              <label style={label}>EMAIL ADDRESS</label>

              <div style={getFieldWrapperStyle("email")}>
                <EmailOutlinedIcon style={iconStyle} />

                <input
                  type="email"
                  placeholder="name@company.com"
                  style={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {errors.email && <p style={errorText}>{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div style={field}>
              <div style={passwordTop}>
                <label style={label}>PASSWORD</label>
                <Link to="/forgot-password" style={forgot}>Forgot password?</Link>
              </div>

              <div style={getFieldWrapperStyle("password")}>
                <LockOutlinedIcon style={iconStyle} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  style={input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                />

                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon style={eyeIcon} />
                  ) : (
                    <VisibilityOutlinedIcon style={eyeIcon} />
                  )}
                </span>
              </div>

              {errors.password && <p style={errorText}>{errors.password}</p>}
            </div>

            {/* ROLE */}
            <div style={field}>
              <label style={label}>ACCESS ROLE</label>

              <div style={getFieldWrapperStyle("role")}>
                <select
                  style={select}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField("")}
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Authority">Authority</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Repair Center">Repair Center</option>
                  <option value="Recycler">Recycler</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {errors.role && <p style={errorText}>{errors.role}</p>}
            </div>

            {/* BUTTON */}
            <button type="submit" style={button}>
              Sign In
            </button>
          </form>

          <p style={footer}>
            Don't have an account? <Link to="/register" style={register}>Register</Link>
          </p>
        </div>

        <div style={bottom}>
          Secure enterprise system · EU GDPR compliant · Unauthorized access is monitored
        </div>
      </div>

      <div style={pageFooter}>
        Public Passport View · DPP Ready · Blockchain Enabled
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const successPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#EAF7EE",
  color: "#14532d",
  padding: "12px 16px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 500,
  zIndex: 999,
  border: "1px solid #D1FADF",
  maxWidth: "260px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const successIcon: React.CSSProperties = {
  width: "40px",
  height: "20px",
  borderRadius: "50%",
  background: "#16a34a",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 700,
  flexShrink: 0,
};

const container: React.CSSProperties = {
  minHeight: "100vh",
  background: "#F5F7FA",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
};

const card: React.CSSProperties = {
  width: "380px",
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const topLine: React.CSSProperties = {
  height: "3px",
  background: "linear-gradient(to right, #1B5E20, #1976D2)",
};

const content: React.CSSProperties = {
  padding: "24px",
};

const logoBox: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "18px",
};

const logoWrapper: React.CSSProperties = {
  background: "#1B5E20",
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
};

const title: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: 600,
  fontSize: "20px",
  color: "#111827",
};

const subtitle: React.CSSProperties = {
  fontSize: "10px",
  color: "#9ca3af",
  letterSpacing: "1.5px",
  marginTop: "4px",
};

const field: React.CSSProperties = {
  marginTop: "14px",
};

const label: React.CSSProperties = {
  fontSize: "10px",
  color: "#9ca3af",
  fontWeight: 500,
};

const inputWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  background: "#f9fafb",
  padding: "10px 12px",
  marginTop: "5px",
  transition: "all 0.2s ease",
};

const inputFocus: React.CSSProperties = {
  border: "1.5px solid #1B5E20",
  boxShadow: "0 0 0 3px rgba(27,94,32,0.15)",
  background: "#ffffff",
};

const inputError: React.CSSProperties = {
  border: "1.5px solid #dc2626",
  boxShadow: "0 0 0 3px rgba(220,38,38,0.12)",
  background: "#ffffff",
};

const input: React.CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  flex: 1,
  fontSize: "13px",
};

const iconStyle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "15px",
  marginRight: "6px",
};

const eyeIcon: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "14px",
  cursor: "pointer",
};

const passwordTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const forgot: React.CSSProperties = {
  fontSize: "10px",
  color: "#3b82f6",
  cursor: "pointer",
};

const select: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "13px",
  cursor: "pointer",
};

const button: React.CSSProperties = {
  width: "100%",
  marginTop: "18px",
  padding: "12px",
  background: "#1B5E20",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
};

const footer: React.CSSProperties = {
  marginTop: "14px",
  fontSize: "12px",
  textAlign: "center",
  color: "#9ca3af",
};

const register: React.CSSProperties = {
  color: "#1B5E20",
  fontWeight: 600,
};

const bottom: React.CSSProperties = {
  borderTop: "1px solid #eee",
  padding: "10px",
  fontSize: "10px",
  textAlign: "center",
  color: "#9ca3af",
};

const pageFooter: React.CSSProperties = {
  marginTop: "12px",
  fontSize: "11px",
  color: "#9ca3af",
};

const errorText: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "11px",
  marginTop: "6px",
  marginBottom: "0",
};

export default Login;