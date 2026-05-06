import logo from "../../../assets/logo.png";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";

type AuthoritySidebarProps = {
  view: string;
  setView: (view: string) => void;
};

export default function AuthoritySidebar({ view, setView }: AuthoritySidebarProps) {
  return (
    <aside className="w-[210px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-0 z-50">
      <div>
        {/* LOGO */}
        <div className="h-[72px] flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#1B5E20] flex items-center justify-center shadow-sm">
            <img src={logo} className="w-5 h-5" alt="LOOPI" />
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
          <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.18em] text-gray-400">
            NAVIGATION
          </p>

          <nav className="space-y-1">
            <NavItem
              icon={<ShieldOutlinedIcon />}
              label="Authority Control"
              active={view === "control"}
              onClick={() => setView("control")}
            />

            <NavItem
              icon={<FactCheckOutlinedIcon />}
              label="Compliance Review"
              active={view === "review"}
              onClick={() => setView("review")}
            />

            <NavItem
              icon={<SearchOutlinedIcon />}
              label="Sustainability Audit"
              active={view === "audit"}
              onClick={() => setView("audit")}
            />

            <NavItem
              icon={<PublicOutlinedIcon />}
              label="Public Records"
              active={view === "records"}
              onClick={() => setView("records")}
            />
          </nav>
        </div>
      </div>

      {/* WALLET */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
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
            type="button"
            className="w-full mt-3 bg-white border border-blue-100 text-blue-600 text-[11px] font-bold py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-all"
          >
            REFILL GAS CREDITS
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, badgeText }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-semibold ${
        active
          ? "bg-[#EAF5EC] text-[#1B5E20]"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
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