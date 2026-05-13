import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function ResetPassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");
  const { token } = useParams();

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

  const validate = () => {
    const newErrors: any = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    if (!confirm.trim()) {
      newErrors.confirm = "Please confirm password";
    } else if (confirm !== password) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(apiUrl("/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,   
          password,   
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);

        // show backend error (invalid / expired token)
        setErrors((prev: any) => ({
          ...prev,
          confirm: data.message,
        }));
        return;
      }

      // SUCCESS FLOW
      setMessage(data.message || "Password updated successfully");

      // store for login page popup
      localStorage.setItem(
        "loginSuccess",
        data.message || "Password updated successfully"
      );

      setTimeout(() => {
        navigate("/"); 
      }, 2500);

    } catch (error) {
      console.error("Reset error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const msg = localStorage.getItem("resetSuccess");

    if (msg) {
      setMessage(msg);
      localStorage.removeItem("resetSuccess");
      setTimeout(() => setMessage(""), 2500);
    }
  }, []);

  return (
    <div style={container}>
      <div style={card}>
        <div style={topLine}></div>

        <div style={content}>
          <div style={logoBox}>
            <div style={logoWrapper}>
              <LockResetOutlinedIcon style={{ color: "white" }} />
            </div>

            <h2 style={title}>Reset Password</h2>
            <p style={subtitle}>Create a new secure password for your account</p>
          </div>

          {message && (
            <div style={successPopup}>
              <CheckCircleRoundedIcon style={toastIcon} />
              <span style={text}>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASSWORD */}
            <div style={field}>
              <label style={label}>PASSWORD</label>

              <div
                style={{
                  ...inputWrapper,
                  ...(errors.password ? inputError : {}),
                }}
              >
                <LockOutlinedIcon style={icon} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  style={input}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev: any) => ({ ...prev, password: "" }));
                  }}
                />

                <span style={eye} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityOutlinedIcon style={{ fontSize: "15px" }} />
                  ) : (
                    <VisibilityOutlinedIcon style={{ fontSize: "15px" }} />
                  )}
                </span>
              </div>

              {errors.password && <p style={error}>{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={field}>
              <label style={label}>CONFIRM PASSWORD</label>

              <div
                style={{
                  ...inputWrapper,
                  ...(errors.confirm ? inputError : {}),
                }}
              >
                <LockOutlinedIcon style={icon} />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  style={input}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setErrors((prev: any) => ({ ...prev, confirm: "" }));
                  }}
                />

                <span style={eye} onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? (
                    <VisibilityOutlinedIcon style={{ fontSize: "15px" }} />
                  ) : (
                    <VisibilityOutlinedIcon style={{ fontSize: "15px" }} />
                  )}
                </span>
              </div>

              {errors.confirm && <p style={error}>{errors.confirm}</p>}
            </div>

            {/* PASSWORD STRENGTH BAR */}
            <div style={strengthWrap}>
              {[1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  style={{
                    ...strengthBar,
                    background: getStrength() >= lvl ? getColor(lvl) : "#e5e7eb",
                  }}
                />
              ))}
            </div>

            <button type="submit" style={button} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
            </button>



            {/* BACK TO LOGIN */}
            <div style={backLoginWrap}>
              <span style={backLoginText} onClick={() => navigate("/")}>
                Back to Login
              </span>
            </div>
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
  fontSize: "11px",
  color: "#9ca3af",
  marginTop: "4px",
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
  padding: "10px 12px",
  marginTop: "5px",
  transition: "all 0.2s ease",
} as const;

const inputError: React.CSSProperties = {
  border: "1.5px solid #dc2626",
  boxShadow: "0 0 0 3px rgba(220,38,38,0.12)",
  background: "#ffffff",
};

const inputFocus: React.CSSProperties = {
  border: "1.5px solid #1B5E20",
  boxShadow: "0 0 0 3px rgba(27,94,32,0.15)",
  background: "#ffffff",
};

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

const backLoginWrap = {
  marginTop: "14px",
  textAlign: "left" as const,
};

const backLoginText = {
  color: "#1B5E20",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
} as const;

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
  maxWidth: "260px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all 0.25s ease",
};

const toastIcon: React.CSSProperties = {
  color: "#16a34a",
  fontSize: "20px",
  flexShrink: 0,
};

const icon: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "16px",
  flexShrink: 0,
  marginRight: "8px",
};

const text: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default ResetPassword;
