import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type AuditLog = {
  id: string;
  hash: string;
  fullHash: string;
  type: string;
  title: string;
  desc: string;
  passport: string;
  date: string;
  status: string;
  block: string | number;
  actor: string;
};

const emptyStats = {
  entries: 0,
  sales: 0,
  scans: 0,
  receipts: 0,
};

export default function AuditTrail() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedHash, setCopiedHash] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAudit = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<any>("/retailer/audit-trail");
      setStats(data.stats || emptyStats);
      setLogs(data.logs || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load audit trail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter = filter === "all" || log.type === filter;
      const text = `${log.hash} ${log.passport} ${log.title} ${log.desc}`.toLowerCase();
      return matchesFilter && text.includes(query.toLowerCase());
    });
  }, [filter, logs, query]);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(""), 1800);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5">
        <StatCard title="AUDIT ENTRIES" value={stats.entries} icon={<HistoryOutlinedIcon />} iconColor="#166B2D" iconBg="#EAF7EE" />
        <StatCard title="SALES" value={stats.sales} icon={<ShoppingCartOutlinedIcon />} iconColor="#9333EA" iconBg="#F3E8FF" />
        <StatCard title="SCANS" value={stats.scans} icon={<QrCodeScannerRoundedIcon />} iconColor="#2563EB" iconBg="#EEF4FF" />
        <StatCard title="RECEIPTS" value={stats.receipts} icon={<ReceiptLongOutlinedIcon />} iconColor="#EA8A00" iconBg="#FFF4E6" />
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[30px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-5 border-b border-[#F2F2F2] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Retailer Audit Trail</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {loading ? "Loading LOOPI immutable audit data..." : `${filteredLogs.length} entries - LOOPI immutable audit data`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterBtn active={filter === "all"} label="All" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "sale"} label="Sale" onClick={() => setFilter("sale")} />
            <FilterBtn active={filter === "scan"} label="Scan" onClick={() => setFilter("scan")} />
            <FilterBtn active={filter === "receipt"} label="Receipt" onClick={() => setFilter("receipt")} />
            <button onClick={loadAudit} className="w-10 h-10 rounded-xl border border-[#ECECEC] flex items-center justify-center hover:bg-[#FAFAFA]">
              <AutorenewRoundedIcon style={{ fontSize: 18, color: "#9CA3AF" }} />
            </button>
            <div className="relative w-full sm:w-[280px]">
              <SearchRoundedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Hash, tx, garment..."
                className="w-full h-[48px] rounded-2xl border border-[#ECECEC] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#166B2D]"
              />
            </div>
          </div>
        </div>

        <div>
          {filteredLogs.map((log) => (
            <div key={`${log.id}-${log.hash}`} className="px-6 py-5 border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-all">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <TypeIcon type={log.type} />
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-[#111827]">{log.title}</p>
                      <TypeBadge type={log.type} />
                    </div>
                    <p className="text-sm text-[#6B7280] mt-1">{log.desc}</p>
                    <div className="flex items-center gap-4 flex-wrap mt-3 text-[11px] text-[#A0A6B2]">
                      <span className="font-bold text-[#166B2D]">{log.passport}</span>
                      <span>{new Date(log.date).toLocaleString()}</span>
                      <span>Block {log.block}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyHash(log.fullHash)}
                    className="h-9 px-3 rounded-xl bg-[#F7F7F7] border border-[#ECECEC] text-[11px] font-bold text-[#6B7280] flex items-center gap-2"
                  >
                    <ContentCopyRoundedIcon style={{ fontSize: 15 }} />
                    {copiedHash === log.fullHash ? "COPIED" : log.hash.slice(0, 14)}
                  </button>
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="h-9 px-4 rounded-xl bg-[#EEF7F1] text-[#166B2D] text-[11px] font-bold"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="px-6 py-10 text-sm text-[#9CA3AF]">No audit records found.</div>
          )}
        </div>
      </div>

      {selectedLog && (
        <>
          <div onClick={() => setSelectedLog(null)} className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9998]" />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="w-full max-w-[560px] bg-white rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.28)] overflow-hidden">
              <div className="h-[70px] border-b border-[#F0F0F0] px-6 flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#111827]">Audit Entry</h2>
                <button onClick={() => setSelectedLog(null)} className="w-10 h-10 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-center">
                  <CloseRoundedIcon />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <Info label="Hash" value={selectedLog.fullHash} />
                <Info label="Passport" value={selectedLog.passport} />
                <Info label="Type" value={selectedLog.type} />
                <Info label="Title" value={selectedLog.title} />
                <Info label="Description" value={selectedLog.desc} />
                <Info label="Timestamp" value={new Date(selectedLog.date).toLocaleString()} />
              </div>
            </div>
          </div>
        </>
      )}
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

function TypeIcon({ type }: any) {
  const icon =
    type === "sale" ? <ShoppingCartOutlinedIcon /> : type === "scan" ? <QrCodeScannerRoundedIcon /> : <ReceiptLongOutlinedIcon />;

  return (
    <div className="w-11 h-11 rounded-2xl bg-[#EEF7F1] text-[#166B2D] flex items-center justify-center">
      {icon}
    </div>
  );
}

function TypeBadge({ type }: any) {
  return (
    <div className="h-6 px-2 rounded-lg text-[10px] font-bold tracking-[0.10em] flex items-center bg-[#F3F4F6] text-[#6B7280] uppercase">
      {type}
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-4">
      <p className="text-[11px] tracking-[0.12em] text-[#A4AAB5] font-bold">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#111827] break-all">{value || "N/A"}</p>
    </div>
  );
}
