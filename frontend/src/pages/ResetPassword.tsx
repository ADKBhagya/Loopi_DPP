import { useState } from "react";
import logo from "../assets/logo.png";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const getStrength = () => {
  if (!password) return 0;
  if (password.length >= 8) return 4;
  if (password.length >= 6) return 3;
  if (password.length >= 4) return 2;
  return 1;
};

const getColor = (level: number) => {
  if (level === 1) return "#ef4444";
  if (level === 2) return "#f59e0b";
  if (level === 3) return "#3b82f6";
  if (level === 4) return "#16a34a";
  return "#e5e7eb";
};

  //  VALIDATION
  const validate = () => {
    const newErrors: any = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm password";
    } else if (confirm !== password) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Password updated successfully ✅");
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={topLine}></div>

        <div style={content}>
          {/* LOGO */}
          <div style={logoBox}>
            <div style={logoWrapper}>
              <img src={logo} style={{ width: 18 }} />
            </div>

            <h2 style={title}>LOOPI</h2>
            <p style={subtitle}>BLOCKCHAIN DIGITAL PRODUCT PASSPORT</p>
          </div>

          {/* HEADER */}
          <p style={sectionTitle}>RESET PASSWORD</p>
          <p style={desc}>
            Create a new secure password for your account
          </p>

          <form onSubmit={handleSubmit}>
            {/* PASSWORD */}
            <div style={field}>
              <label style={label}>PASSWORD</label>
              <div style={inputWrapper}>
                <LockOutlinedIcon style={icon} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  style={input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  style={eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p style={error}>{errors.password}</p>
              )}
            </div>

            {/* CONFIRM */}
            <div style={field}>
              <label style={label}>CONFIRM PASSWORD</label>
              <div style={inputWrapper}>
                <LockOutlinedIcon style={icon} />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  style={input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <span
                  style={eye}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </span>
              </div>
              {errors.confirm && (
                <p style={error}>{errors.confirm}</p>
              )}
            </div>

            {/*  PASSWORD STRENGTH BAR */}
            <div style={strengthWrap}>
            {[1, 2, 3, 4].map((lvl) => (
                <div
                key={lvl}
                style={{
                    ...strengthBar,
                    background:
                    getStrength() >= lvl
                        ? getColor(lvl)
                        : "#e5e7eb",
                }}
                />
            ))}
            </div>

            {/* BUTTON */}
            <button type="submit" style={button}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const strengthWrap = {
  display: "flex",
  gap: "4px",
  marginTop: "10px",
} as const;

const strengthBar = {
  flex: 1,
  height: "2px",
  borderRadius: "2px",
} as const;

const container = {
  minHeight: "100vh",
  background: "#F5F7FA",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
} as const;

const card = {
  width: "400px",
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
  overflow: "hidden",
} as const;

const topLine = {
  height: "3px",
  background: "linear-gradient(to right, #1B5E20, #1976D2)",
} as const;

const content = {
  padding: "26px",
} as const;

const logoBox = {
  textAlign: "center" as const,
  marginBottom: "18px",
};

const logoWrapper = {
  background: "#1B5E20",
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
} as const;

const title = {
  marginTop: "10px",
  fontWeight: 600,
  fontSize: "20px",
  color: "#111827",
} as const;

const subtitle = {
  fontSize: "10px",
  color: "#9ca3af",
  letterSpacing: "1.5px",
} as const;

const sectionTitle = {
  fontSize: "11px",
  color: "#9ca3af",
  fontWeight: 600,
  letterSpacing: "1px",
  marginTop: "10px",
} as const;

const desc = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "16px",
} as const;

const field = {
  marginTop: "14px",
} as const;

const label = {
  fontSize: "10px",
  color: "#9ca3af",
} as const;

const inputWrapper = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  background: "#f9fafb",
  padding: "11px 12px",
  marginTop: "6px",
  gap: "8px",
} as const;

const icon = {
  color: "#9ca3af",
  fontSize: "16px",
} as const;

const input = {
  border: "none",
  outline: "none",
  background: "transparent",
  flex: 1,
  fontSize: "13px",
  color: "#111827",
} as const;

const eye = {
  cursor: "pointer",
  color: "#9ca3af",
  display: "flex",
  alignItems: "center",
} as const;

const error = {
  color: "#dc2626",
  fontSize: "11px",
  marginTop: "5px",
} as const;

const button = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "#1B5E20",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
} as const;

export default ResetPassword;