import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "../../manufacturer/components/Sidebar";
import Topbar from "../../manufacturer/components/Topbar";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function Dashboard() {
  const [view, setView] = useState("overview");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

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
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar view={view} setView={setView} />

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

      {/* MAIN */}
      <div className="flex-1 ml-[210px]">

        <Topbar />

        <div className="pt-[90px] px-6">
          <h1 className="text-xl font-bold">Manufacturer Dashboard</h1>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;