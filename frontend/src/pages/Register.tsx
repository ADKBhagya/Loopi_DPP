import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

type Errors = {
  fullName?: string;
  email?: string;
  organisation?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
};

function Register() {
  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(1);

const getPasswordStrength = () => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

  const getStrengthColor = (level: number) => {
    if (level === 1) return "#ef4444";
    if (level === 2) return "#f59e0b";
    if (level === 3) return "#3b82f6";
    if (level === 4) return "#16a34a";
    return "#e5e7eb";
  };

  const validate = () => {
  const newErrors: Errors = {};

  if (!fullName.trim()) {
    newErrors.fullName = "Full name is required.";
  }

  if (!email.trim()) {
    newErrors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  if (!organisation.trim()) {
    newErrors.organisation = "Organisation is required.";
  }

  if (!role.trim()) {
    newErrors.role = "Please select a role.";
  }

  if (!password) {
    newErrors.password = "Password is required.";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters."
  } 

  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const validateStep = () => {
  let newErrors: any = {};
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// ================= HANDLE REGISTER =================
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  const isValid = validate();
  if (!isValid) return;

  if (role === "Admin") {
    setErrorMessage("Admin registration is not allowed.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email: email.toLowerCase().trim(),
        organization: organisation,
        role,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.message || "Registration failed");
      setLoading(false);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setLoading(false);
    setSubmitted(true);

    // RESET FORM
    setFullName("");
    setEmail("");
    setOrganisation("");
    setPassword("");
    setConfirmPassword("");

  } catch (err) {
    console.error(err);
    setErrorMessage("Server error");
    setLoading(false);
  }
};

  const getFieldWrapperStyle = (fieldName: keyof Errors | string) => {
    if (errors[fieldName as keyof Errors]) {
      return { ...inputWrapper, ...inputError };
    }

    if (focusedField === fieldName) {
      return { ...inputWrapper, ...inputFocus };
    }

    return inputWrapper;
  };

  const roleNote =
    role === "Manufacturer" ||
    role === "Logistics" ||
    role === "Repair Center" ||
    role === "Recycler"
      ? "~ Pending admin approval"
      : role === "Retailer"
      ? "✓ Instant access"
      : "~ Pending admin approval";
      

  return (
    <div style={container}>
      <div style={card}>
        <div style={topLine}></div>

        <div style={content}>
          <div style={logoBox}>
            <div style={logoWrapper}>
              <img src={logo} style={{ width: 18 }} alt="LOOPI logo" />
            </div>

            <h2 style={title}>LOOPI</h2>
            <p style={subtitle}>BLOCKCHAIN DIGITAL PRODUCT PASSPORT</p>
          </div>

          {submitted ? (
            <>
              <div style={submittedWrapper}>
                <div style={successIconCircle}>
                  <CheckCircleOutlineRoundedIcon style={successIcon} />
                </div>

                <h3 style={submittedTitle}>Request Submitted</h3>

                <p style={submittedText}>
                  Your {role} account has been created successfully and is pending admin approval. You'll be
                  notified by email.
                </p>

                <Link to="/" style={backToSignIn}>
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>

            {errorMessage && (
              <div style={errorPopup}>
                <ErrorOutlineRoundedIcon style={errorIcon} />
                {errorMessage}
              </div>
            )}

              <form onSubmit={handleRegister} noValidate>
                <p style={sectionTitle}>CREATE ACCOUNT</p>

                <div style={field}>
                  <label style={label}>FULL NAME</label>
                  <div style={getFieldWrapperStyle("fullName")}>
                    <PersonOutlineOutlinedIcon style={iconStyle} />
                    <input
                      type="text"
                      placeholder="Jane Lindström"
                      style={input}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedField("fullName")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                  {errors.fullName && (
                    <p style={errorText}>{errors.fullName}</p>
                  )}
                </div>

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
                  {errors.email && <p style={errorText}>{errors.email}</p>}
                </div>

                <div style={field}>
                  <label style={label}>ORGANIZATION</label>
                  <div style={getFieldWrapperStyle("organisation")}>
                    <BusinessOutlinedIcon style={iconStyle} />
                    <input
                      type="text"
                      placeholder="Nordic Textiles AB"
                      style={input}
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      onFocus={() => setFocusedField("organisation")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                  {errors.organisation && (
                    <p style={errorText}>{errors.organisation}</p>
                  )}
                </div>

                <div style={field}>
                  <label style={label}>ROLE</label>
                  <div style={getFieldWrapperStyle("role")}>
                    <select
                      style={select}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onFocus={() => setFocusedField("role")}
                      onBlur={() => setFocusedField("")}
                    >
                      <option value="">Select Role</option>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Repair Center">Repair Center</option>
                      <option value="Recycler">Recycler</option>
                    </select>
                  </div>

                  <p
                    style={{
                      ...noteText,
                      color:
                        roleNote === "✓ Instant access"
                          ? "#16a34a"
                          : "#f59e0b",
                    }}
                  >
                    {roleNote}
                  </p>

                  <p style={subNoteText}>
                    Auditor · Authority · Admin require administrator
                    provisioning.
                  </p>

                  {errors.role && <p style={errorText}>{errors.role}</p>}
                </div>

                <div style={passwordRow}>
                  <div style={passwordCol}>
                  <label style={label}>PASSWORD</label>

                  <div style={getFieldWrapperStyle("password")}>
                    <LockOutlinedIcon style={iconStyle} />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars"
                      style={input}
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);

                        setErrors((prev) => ({
                          ...prev,
                          password:
                            value.length < 8
                              ? "Password must be at least 8 characters."
                              : "",
                          confirmPassword:
                            confirmPassword && value !== confirmPassword
                              ? "Passwords do not match"
                              : "",
                        }));
                      }}
                    />

                    <span
                      style={eyeWrap}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon style={eyeIcon} />
                      ) : (
                        <VisibilityOutlinedIcon style={eyeIcon} />
                      )}
                    </span>
                  </div>

                  {errors.password && <p style={errorText}>{errors.password}</p>}
                </div>

                  <div style={passwordCol}>
                    <label style={label}>CONFIRM</label>

                    <div style={getFieldWrapperStyle("confirmPassword")}>
                      <LockOutlinedIcon style={iconStyle} />

                     <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat"
                      style={input}
                      value={confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setConfirmPassword(value);

                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword:
                            value !== password ? "Passwords do not match" : "",
                        }));
                      }}
                    />

                      <span
                        style={eyeWrap}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon style={eyeIcon} />
                        ) : (
                          <VisibilityOutlinedIcon style={eyeIcon} />
                        )}
                      </span>
                    </div>

                    {errors.confirmPassword && (
                      <p style={errorText}>{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div style={strengthBarContainer}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        ...strengthSegment,
                        background:
                          getPasswordStrength() >= level
                            ? getStrengthColor(level)
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  style={loading ? loadingButton : button}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={loadingContent}>
                      <span style={spinner}></span>
                      Submitting...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p style={footer}>
                Already have an account?{" "}
                <Link to="/" style={signinLink}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <div style={bottom}>
          Secure enterprise system · EU GDPR compliant · Unauthorised access is
          monitored
        </div>
      </div>

      <div style={pageFooter}>
        Public Passport View · DPP Ready · Blockchain Enabled
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  minHeight: "100vh",
  padding: "16px",
  background: "#F5F7FA",
  display: "flex",
  flexDirection: "column",
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

const passwordCol: React.CSSProperties = {
  flex: "1 1 100%",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
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

const sectionTitle: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
  fontWeight: 600,
  letterSpacing: "1px",
  marginBottom: "12px",
};

const field: React.CSSProperties = {
  marginTop: "12px",
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
  gap: "6px",
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
  flex: "1 1 auto",
  minWidth: 0,
  fontSize: "13px",
};

const iconStyle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "15px",
  marginRight: "6px",
};

const eyeWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  minWidth: "28px",
  flexShrink: 0,
  cursor: "pointer",
};

const eyeIcon: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "14px",
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

const noteText: React.CSSProperties = {
  fontSize: "11px",
  marginTop: "8px",
  marginBottom: "0",
};

const subNoteText: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
  marginTop: "6px",
  marginBottom: "0",
};

const passwordRow: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "14px",
  alignItems: "stretch",
  width: "100%",
  flexWrap: "wrap",
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

const loadingButton: React.CSSProperties = {
  ...button,
  background: "#7fa583",
  cursor: "not-allowed",
};

const loadingContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const spinner: React.CSSProperties = {
  width: "13px",
  height: "13px",
  border: "2px solid rgba(255,255,255,0.55)",
  borderTop: "2px solid #ffffff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
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

const strengthBarContainer: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  marginTop: "8px",
};

const strengthSegment: React.CSSProperties = {
  height: "1.5px",
  flex: 1,
  borderRadius: "2px",
};

const submittedWrapper: React.CSSProperties = {
  textAlign: "center",
  padding: "34px 10px 28px",
};

const successIconCircle: React.CSSProperties = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  background: "#dcfce7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
};

const successIcon: React.CSSProperties = {
  color: "#15803d",
  fontSize: "30px",
};

const submittedTitle: React.CSSProperties = {
  marginTop: "18px",
  fontSize: "16px",
  fontWeight: 600,
  color: "#111827",
};

const submittedText: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: 1.6,
  marginTop: "8px",
  marginBottom: "0",
};

const backToSignIn: React.CSSProperties = {
  display: "inline-block",
  marginTop: "16px",
  color: "#1B5E20",
  fontWeight: 600,
  fontSize: "12px",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const errorPopup: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#FEE2E2",
  color: "#991B1B",
  padding: "12px 16px",
  borderRadius: "12px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  fontWeight: 500,
  zIndex: 999,
  border: "1px solid #FCA5A5",
  maxWidth: "260px",
  transition: "all 0.25s ease",
  transform: "translateY(0)",
};

const errorIcon: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "20px",
};
export default Register;