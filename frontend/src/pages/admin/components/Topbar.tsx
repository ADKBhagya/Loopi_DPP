import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function NotificationDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-[320px] bg-white border rounded-xl shadow-xl p-4 space-y-3">

      <p className="font-semibold text-sm">Blockchain Activity</p>

      {[
        "Blockchain Confirmation",
        "Audit Required",
        "System Update"
      ].map((item, i) => (
        <div key={i} className="text-sm border-b pb-2">
          {item}
        </div>
      ))}

      <button className="w-full text-green-700 text-xs mt-2">
        VIEW SECURITY EXPLORER
      </button>
    </div>
  );
}

function UserDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-[260px] bg-white border rounded-xl shadow-xl p-4 space-y-3">

      <p className="text-sm font-semibold">Authenticated Identity</p>
      <p className="text-xs text-gray-500">kaushanibhagya9@gmail.com</p>

      <div className="space-y-2 text-sm">
        <div className="cursor-pointer">Identity Controls</div>
        <div className="cursor-pointer">System Prefs</div>
        <div className="cursor-pointer">Gas Credits</div>
      </div>

      <div className="border-t pt-2 text-red-500 cursor-pointer text-sm">
        Secure Termination
      </div>
    </div>
  );
} 


export default function Topbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSync = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <header className="h-[72px] bg-white border-b fixed left-[210px] right-0 top-0 flex items-center justify-between px-6 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-5">
        <MenuOutlinedIcon className="text-gray-500" />

        <div className="relative">
          <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            placeholder="Search Passport ID, Batch or Batch ID..."
            className="w-[360px] h-10 pl-10 pr-4 rounded-xl border bg-gray-50 text-sm outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* STATUS */}
        <div className="px-4 py-2 rounded-full bg-green-50 border text-green-600 text-xs font-bold">
          ● MAINNET ONLINE
        </div>

        {/* NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-10 h-10 border rounded-xl flex items-center justify-center"
          >
            <NotificationsNoneOutlinedIcon />
          </button>

          {showNotif && <NotificationDropdown />}
        </div>

        {/* USER */}
        <div className="relative">
          <button
            onClick={() => setShowUser(!showUser)}
            className="flex items-center gap-3 border rounded-xl px-3 h-11"
          >
            <div className="text-right">
              <p className="text-xs font-bold">Kaushanibhagya9</p>
              <p className="text-[10px] text-gray-400">ADMIN</p>
            </div>

            <div className="w-9 h-9 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white">
              <PersonOutlineOutlinedIcon />
            </div>

            <KeyboardArrowDownOutlinedIcon />
          </button>

          {showUser && <UserDropdown />}
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-20 right-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <CheckCircleIcon />
          Node Synced — Block #8,442,109
        </div>
      )}
    </header>
  );
}