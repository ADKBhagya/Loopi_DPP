import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";
import BlockchainNetwork from "./views/BlockchainNetwork";
import SystemConfig from "./views/SystemConfig";
import SecurityExplorer from "./components/SecurityExplorer";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"; 

export default function AdminLayout({ view, setView }: any) {

  // GLOBAL STATE FOR SECURITY EXPLORER
  const [showExplorer, setShowExplorer] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const OverviewComponent: any = Overview;

  useEffect(() => {
  const msg = localStorage.getItem("loginSuccess");

  if (msg) {
    setMessage(msg);
    setShow(true);

    localStorage.removeItem("loginSuccess");

    setTimeout(() => setShow(false), 2500);
    setTimeout(() => setMessage(""), 3000);
  }
}, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      <Sidebar
        view={view}
        setView={setView}
        pendingCount={pendingCount}
      />

{message && (
  <div
    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
      show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
    }`}
    style={{
      background: "rgba(220, 252, 231, 0.9)", // soft green glass
      border: "1px solid #BBF7D0",
      color: "#166534",
    }}
  >
    {/* ICON */}
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white">
      <CheckCircleRoundedIcon style={{ fontSize: 16 }} />
    </div>

    {/* TEXT */}
    <span className="text-sm font-medium">
      {message}
    </span>
  </div>
)}

      <Topbar onOpenExplorer={() => setShowExplorer(true)} />

      <main className="ml-[210px] pt-[72px] px-8 py-6">

        {view === "overview" && (
          <OverviewComponent
            setView={setView}
            onOpenExplorer={() => setShowExplorer(true)}
            setPendingCount={setPendingCount}
          />
        )}

        {view === "users" && (
          <UserManagement setPendingCount={setPendingCount} />
        )}
        {view === "network" && <BlockchainNetwork />}
        {view === "settings" && <SystemConfig />}
        
      </main>
      
      {showExplorer && (
        <SecurityExplorer onClose={() => setShowExplorer(false)} />
      )}

    </div>
  );
}