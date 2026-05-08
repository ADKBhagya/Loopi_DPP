import logo from "../../assets/logo.png";

import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";

import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  menuItems: any[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  menuItems,
  mobileOpen,
  onClose,
}: Props) {

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-100
          flex flex-col justify-between z-50 transition-all duration-300

          w-[260px] lg:w-[210px]

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >

        {/* TOP */}
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
          <div className="px-3 mt-4 lg:mt-6">


            <nav className="space-y-1">

              {menuItems.map((item, index) => {

                const active =
                  location.pathname === item.path;

                return (
                  <NavItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    active={active}
                    onClick={() => {

                      navigate(item.path);

                      if (onClose) {
                        onClose();
                      }

                    }}
                  />
                );
              })}

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
              className="
                w-full mt-3 bg-white border border-blue-100
                text-blue-600 text-[11px] font-bold py-2 rounded-lg
                shadow-sm hover:bg-blue-50 transition-all
              "
            >
              REFILL GAS CREDITS
            </button>

          </div>

        </div>

      </aside>
    </>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: any) {

  return (
    <button
      onClick={onClick}
      className={`
        relative
        w-full flex items-center gap-3 px-3 py-3 rounded-xl
        transition-all text-sm font-semibold

        ${
          active
            ? "bg-[#EAF5EC] text-[#1B5E20]"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }
      `}
    >

      {/* ACTIVE BAR */}
      {active && (
        <div
          className="
            absolute left-0 top-2 bottom-2
            w-1 bg-[#1B5E20]
            rounded-r-full
          "
        />
      )}

      <span className="flex items-center justify-center text-[18px]">
        {icon}
      </span>

      <span className="flex-1 text-left leading-tight">
        {label}
      </span>

    </button>
  );
}