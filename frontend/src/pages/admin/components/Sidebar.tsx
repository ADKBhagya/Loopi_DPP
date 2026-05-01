import logo from "../../../assets/logo.png";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";

export default function Sidebar({ view, setView }: any) {
  return (
    <aside className="w-[210px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-0">

      <div>
        {/* LOGO */}
        <div className="h-[72px] flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#1B5E20] flex items-center justify-center">
            <img src={logo} className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-bold text-[18px] text-gray-900 leading-none">LOOPI</h2>
            <p className="text-[9px] font-bold tracking-widest text-[#1B5E20] mt-1">
              BLOCKCHAIN DPP
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 mt-6">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-3">
            NAVIGATION
          </p>

          <nav className="space-y-2">
            <NavItem
              icon={<GridViewOutlinedIcon />}
              label="Admin Overview"
              active={view === "overview"}
              onClick={() => setView("overview")}
            />

            <NavItem
              icon={<PeopleAltOutlinedIcon />}
              label="User Management"
              badge="5"
              active={view === "users"}
              onClick={() => setView("users")}
            />

            <NavItem
              icon={<StorageOutlinedIcon />}
              label="Blockchain Network"
              active={view === "network"}
              onClick={() => setView("network")}
            />

            <NavItem
              icon={<SettingsOutlinedIcon />}
              label="System Config"
              active={view === "settings"}
              onClick={() => setView("settings")}
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

          <button className="w-full mt-3 bg-white border border-blue-100 text-blue-600 text-[11px] font-bold py-2 rounded-lg shadow-sm">
            REFILL GAS CREDITS
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all text-sm font-medium ${
        active
          ? "bg-green-50 text-[#1B5E20]"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-[18px]">{icon}</span>
      <span className="flex-1 leading-tight">{label}</span>

      {badge && (
        <span className="bg-yellow-400 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {badge}
        </span>
      )}

      {active && (
        <span className="w-1.5 h-1.5 bg-[#1B5E20] rounded-full"></span>
      )}
    </div>
  );
}

function SidebarUserManagement() {
  return (
    <div className="flex items-center justify-between bg-green-50 text-[#1B5E20] px-4 py-3 rounded-xl cursor-pointer">

      <div className="flex items-center gap-3">
        {/* ICON */}
        <div className="text-[#1B5E20]">
          👤
        </div>

        <span className="font-medium text-sm">
          User Management
        </span>
      </div>

      {/* BADGE */}
      <span className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        5
      </span>
    </div>
  );
}