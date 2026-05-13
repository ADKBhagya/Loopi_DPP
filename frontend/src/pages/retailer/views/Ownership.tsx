import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

type Transfer = {
  id: string;
  passport: string;
  item: string;
  from: string;
  to: string;
  type: string;
  date: string;
  amount: string;
};

const emptyStats = {
  total: 0,
  sales: 0,
  arrivals: 0,
  dispatched: 0,
};

export default function Ownership() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState(emptyStats);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOwnership = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<any>("/retailer/ownership");
      setStats(data.stats || emptyStats);
      setTransfers(data.transfers || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load ownership history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnership();
  }, []);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((item) => {
      const matchesFilter = filter === "all" || item.type.toLowerCase() === filter;
      const text = `${item.id} ${item.passport} ${item.item} ${item.from} ${item.to}`.toLowerCase();
      return matchesFilter && text.includes(query.toLowerCase());
    });
  }, [filter, query, transfers]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5">
        <StatCard title="TOTAL TRANSFERS" value={stats.total} icon={<HubOutlinedIcon />} iconColor="#166B2D" iconBg="#EAF7EE" />
        <StatCard title="SALES RECORDED" value={stats.sales} icon={<ShoppingCartOutlinedIcon />} iconColor="#9333EA" iconBg="#F3E8FF" />
        <StatCard title="ARRIVALS" value={stats.arrivals} icon={<Inventory2OutlinedIcon />} iconColor="#2563EB" iconBg="#EEF4FF" />
        <StatCard title="DISPATCHED" value={stats.dispatched} icon={<ArrowOutwardRoundedIcon />} iconColor="#EA8A00" iconBg="#FFF4E6" />
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[30px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-5 border-b border-[#F2F2F2] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Ownership Transfer History</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {loading ? "Loading blockchain transfer records..." : "Immutable blockchain transfer records"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            <FilterBtn active={filter === "all"} label="All" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "sale"} label="Sale" onClick={() => setFilter("sale")} />
            <FilterBtn active={filter === "arrival"} label="Arrival" onClick={() => setFilter("arrival")} />
            <FilterBtn active={filter === "dispatch"} label="Dispatch" onClick={() => setFilter("dispatch")} />
            <button
              onClick={loadOwnership}
              className="w-10 h-10 rounded-xl border border-[#ECECEC] flex items-center justify-center hover:bg-[#FAFAFA]"
            >
              <AutorenewRoundedIcon style={{ fontSize: 18, color: "#9CA3AF" }} />
            </button>

            <div className="relative w-full sm:w-[260px] xl:w-[320px]">
              <SearchRoundedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ownership..."
                className="w-full h-[48px] rounded-2xl border border-[#ECECEC] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#166B2D]"
              />
            </div>
          </div>
        </div>

        <div>
          {filteredTransfers.map((item) => (
            <div key={`${item.id}-${item.date}`} className="relative px-6 py-6 border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className="mt-1 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        item.type === "SALE" ? "#EAF7EE" : item.type === "ARRIVAL" ? "#EEF4FF" : "#F3F4F6",
                    }}
                  >
                    {item.type === "SALE" && <ShoppingCartOutlinedIcon style={{ fontSize: 20, color: "#16A34A" }} />}
                    {item.type === "ARRIVAL" && <LocalShippingOutlinedIcon style={{ fontSize: 20, color: "#2563EB" }} />}
                    {item.type === "DISPATCH" && <ArrowOutwardRoundedIcon style={{ fontSize: 20, color: "#6B7280" }} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-[#271c11] text-[14px] sm:text-[15px] break-words">{item.from}</p>
                      <ArrowOutwardRoundedIcon style={{ fontSize: 16, color: "#9CA3AF" }} />
                      <p className="font-bold text-[#271c11] text-[14px] sm:text-[15px] break-words">{item.to}</p>
                      <TypeBadge type={item.type} />
                    </div>

                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <p className="text-[11px] font-bold tracking-[0.12em] text-[#16A34A]">{item.passport}</p>
                      <p className="text-sm text-[#6B7280]">{item.item}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-[11px] text-[#A0A6B2]">
                      <p>{item.id}</p>
                      <p>{item.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="text-left lg:text-right pl-[60px] lg:pl-0">
                  <p className="text-[13px] font-semibold text-[#4B5563]">{new Date(item.date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-[#A0A6B2] mt-1">{new Date(item.date).toLocaleTimeString()} UTC</p>
                </div>
              </div>
            </div>
          ))}
          {filteredTransfers.length === 0 && (
            <div className="px-6 py-10 text-sm text-[#9CA3AF]">No ownership records found.</div>
          )}
        </div>

        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FAFAFA]">
          <p className="text-sm text-[#9CA3AF]">{filteredTransfers.length} transfers - Blockchain verified</p>
          <button className="flex items-center gap-2 text-[#166B2D] text-sm font-bold tracking-[0.12em] uppercase">
            <FileDownloadOutlinedIcon style={{ fontSize: 18 }} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor }: any) {
  return (
    <div className="h-[100px] rounded-[26px] border border-[#ECECEC] bg-white px-5 flex items-center justify-between">
      <div>
        <p className="text-[12px] tracking-[0.14em] text-[#A4AAB5] font-bold">{title}</p>
        <h2 className="text-[24px] leading-none font-bold text-[#111827] mt-3">{value}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}

function FilterBtn({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-4 rounded-xl text-sm font-semibold border transition-all ${
        active ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-[#ECECEC]"
      }`}
    >
      {label}
    </button>
  );
}

function TypeBadge({ type }: any) {
  const styles: any = {
    SALE: "bg-[#EAF7EE] text-[#16A34A]",
    ARRIVAL: "bg-[#EEF4FF] text-[#2563EB]",
    DISPATCH: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <div className={`h-6 px-2 rounded-lg text-[10px] font-bold tracking-[0.10em] flex items-center ${styles[type] || styles.DISPATCH}`}>
      {type}
    </div>
  );
}
