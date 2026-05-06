import logo from "../../../assets/logo.png";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";

type SidebarProps = {
  view: string;
  setView: (view: string) => void;
};

export default function AuditorSidebar({
  view,
  setView,
}: SidebarProps) {
  return (
    <aside className="w-[210px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-0 z-50">
      <div>
        {/* LOGO */}
        <div className="h-[72px] flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#1B5E20] flex items-center justify-center">
            <img src={logo} className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-[18px] text-gray-900 leading-none">
              LOOPI
            </h2>

            <p className="text-[9px] font-bold tracking-widest text-[#1B5E20] mt-1">
              BLOCKCHAIN DPP
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-3 mt-6">

          <nav className="space-y-1">
            <NavItem
              icon={<FactCheckOutlinedIcon />}
              label="Audit Queue"
              active={view === "queue"}
              onClick={() => setView("queue")}
            />

            <NavItem
              icon={<AutoAwesomeMotionOutlinedIcon />}
              label="Lifecycle Review"
              active={view === "lifecycle"}
              onClick={() => setView("lifecycle")}
            />

            <NavItem
              icon={<VerifiedOutlinedIcon />}
              label="Compliance Check"
              active={view === "compliance"}
              onClick={() => setView("compliance")}
            />

            <NavItem
              icon={<HistoryOutlinedIcon />}
              label="Audit Trail"
              active={view === "trail"}
              onClick={() => setView("trail")}
            />
          </nav>

        </div>
      </div>

      {/* WALLET */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center">
              <ElectricBoltOutlinedIcon style={{ fontSize: 18 }} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#1B5E20]">
                ENTERPRISE WALLET
              </p>

              <p className="text-xs font-bold text-gray-900">
                4,285.50 LOOPI
              </p>
            </div>
          </div>

          <button
            className="
              w-full mt-3 bg-white border border-blue-100
              text-blue-600 text-[11px] font-bold
              py-2 rounded-lg shadow-sm
            "
          >
            REFILL GAS CREDITS
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badgeText,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-semibold ${
        active
          ? "bg-[#EAF5EC] text-[#1B5E20]"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center justify-center text-[18px]">
        {icon}
      </span>

      <span className="flex-1 text-left leading-tight">
        {label}
      </span>

      {badgeText && (
        <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-1 rounded-md">
          {badgeText}
        </span>
      )}

      {active && (
        <span className="w-1.5 h-1.5 bg-[#1B5E20] rounded-full" />
      )}
    </button>
  );
}