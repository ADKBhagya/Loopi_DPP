import { useState } from "react";
import { Link } from "react-router-dom";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";

type Errors = {
  email?: string;
};

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [focusedField, setFocusedField] = useState("");

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors: Errors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setMessage(data.message);
    } catch (err) {
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  /* ================= INPUT STYLE LOGIC ================= */

  const getFieldWrapperStyle = (field: keyof Errors | string) => {
    if (errors[field as keyof Errors]) {
      return { ...inputWrapper, ...inputError };
    }

    if (focusedField === field) {
      return { ...inputWrapper, ...inputFocus };
    }

    return inputWrapper;
  };

  /* ================= UI ================= */

  return (
    <div style={container}>
      <div style={card}>
        <div style={topLine}></div>

        <div style={content}>
          <div style={logoBox}>
            <div style={logoWrapper}>
              <MarkEmailReadRoundedIcon style={{ color: "white" }} />
            </div>

            <h2 style={title}>Forgot Password</h2>
            <p style={subtitle}>
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={field}>
              <label style={label}>EMAIL ADDRESS</label>

              <div style={getFieldWrapperStyle("email")}>
                <EmailOutlinedIcon style={iconStyle} />
                <input
                  type="email"
                  placeholder="jane@company.com"
                  style={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {errors.email && (
                <p style={errorText}>{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              style={loading ? loadingButton : button}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* SUCCESS MESSAGE */}
          {message && <div style={messageBox}>{message}</div>}

          <p style={footer}>
            Remember your password?{" "}
            <Link to="/" style={signinLink}>
              Back to Login
            </Link>
          </p>
        </div>

        <div style={bottom}>
          Secure enterprise system · EU GDPR compliant · Unauthorised access is
          monitored
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  minHeight: "100vh",
  padding: "16px",
  background: "#F5F7FA",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: "395px",
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
};

const subtitle: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
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
  fontSize: "16px",
  marginRight: "6px",
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
  cursor: "pointer",
};

const loadingButton: React.CSSProperties = {
  ...button,
  background: "#7fa583",
  cursor: "not-allowed",
};

const messageBox: React.CSSProperties = {
  marginTop: "12px",
  fontSize: "12px",
  color: "#16a34a",
  textAlign: "center",
};

const errorText: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "11px",
  marginTop: "6px",
};

const footer: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "12px",
  textAlign: "center",
  color: "#9ca3af",
};

const signinLink: React.CSSProperties = {
  color: "#1B5E20",
  fontWeight: 600,
  textDecoration: "none",
};

const bottom: React.CSSProperties = {
  borderTop: "1px solid #eee",
  padding: "10px",
  fontSize: "10px",
  textAlign: "center",
  color: "#9ca3af",
};