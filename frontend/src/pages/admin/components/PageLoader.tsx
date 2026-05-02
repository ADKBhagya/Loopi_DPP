import logo from "../../../assets/logo.png";

interface Props {
  text?: string;
}

function PageLoader({ text = "DECRYPTING SYSTEM NODE" }: Props) {
  return (
    <div style={container}>
      <div style={loaderBox}>
        <div style={iconBox}>
          <img src={logo} alt="LOOPI" style={logoStyle} />
        </div>

        <div style={dots}>
          <span style={{ ...dot, animationDelay: "0s" }}></span>
          <span style={{ ...dot, animationDelay: "0.2s" }}></span>
          <span style={{ ...dot, animationDelay: "0.4s" }}></span>
        </div>

        <p style={textStyle}>{text}</p>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F9FAFB",
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

const textStyle: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "10px",
  color: "#6B7280",
  letterSpacing: "1.5px",
};

export default PageLoader;