import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  menuItems: any[];
}

export default function MobileSidebar({
  open,
  onClose,
  menuItems,
}: Props) {
  return (
    <div
      style={{
        ...overlay,
        left: open ? "0" : "-100%",
      }}
    >
      <div style={sidebar}>
        
        <div style={header}>
          <h2>LOOPI</h2>

          <button onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>

        <div style={menuContainer}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={menuItem}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  zIndex: 999,
  transition: "0.3s",
};

const sidebar: React.CSSProperties = {
  width: "260px",
  height: "100%",
  background: "#0B1120",
  padding: "20px",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  marginBottom: "30px",
};

const closeBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "22px",
  cursor: "pointer",
};

const menuContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const menuItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "white",
  textDecoration: "none",
  padding: "14px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.03)",
};