import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

export default function Topbar() {
  return (
    <header className="h-[72px] bg-white border-b border-gray-100 fixed left-[210px] right-0 top-0 z-40 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-5">
        <button className="text-gray-500">
          <MenuOutlinedIcon />
        </button>

        <div className="relative">
          <SearchOutlinedIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            style={{ fontSize: 18 }}
          />

          <input
            placeholder="Search Passport ID, Batch or Batch ID..."
            className="w-[360px] h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#1B5E20] focus:bg-white"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <div className="px-4 py-2 rounded-full bg-green-50 border border-green-200 text-[#16a34a] text-[11px] font-bold tracking-wider">
          ● MAINNET ONLINE
        </div>

        <button className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500">
          <NotificationsNoneOutlinedIcon style={{ fontSize: 20 }} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-11 px-3 rounded-xl border border-gray-200 flex items-center gap-3 bg-white">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900 leading-none">
              Kaushanibhagya9
            </p>
            <p className="text-[10px] font-bold text-gray-400 mt-1">
              ADMIN
            </p>
          </div>

          <div className="w-9 h-9 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white">
            <PersonOutlineOutlinedIcon style={{ fontSize: 18 }} />
          </div>

          <KeyboardArrowDownOutlinedIcon
            className="text-gray-400"
            style={{ fontSize: 18 }}
          />
        </div>

      </div>
    </header>
  );
}