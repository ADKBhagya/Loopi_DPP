import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";

type LogType =
  | "SIGNED"
  | "SCORE"
  | "UPLOAD"
  | "QUEUED"
  | "ASSIGN"
  | "VERIFIED"
  | "NOTIFY";

type ServiceLog = {
  id?: string;
  hash: string;
  description: string;
  type: LogType;
  passport: string;
  time: string;
  date: string;
  dot: string;
  explorerUrl?: string;
};

export default function ServiceLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | LogType>("All");

  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState("");

  useEffect(() => {
    setLogsLoading(true);
    setLogsError("");

    apiFetch<{ logs: ServiceLog[] }>("/repair-center/logs")
      .then((data) => {
        setLogs(data.logs || []);
      })
      .catch((error) => {
        console.error("Failed to load repair service logs", error);
        setLogs([]);
        setLogsError("Failed to load service logs");
      })
      .finally(() => {
        setLogsLoading(false);
      });
  }, []);

  const downloadLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "repair-service-logs.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        filter === "All" || log.type === filter;

      const value = search.toLowerCase();

      const matchesSearch =
        String(log.hash || "").toLowerCase().includes(value) ||
        String(log.description || "").toLowerCase().includes(value) ||
        String(log.passport || "").toLowerCase().includes(value) ||
        String(log.type || "").toLowerCase().includes(value);

      return matchesFilter && matchesSearch;
    });
  }, [logs, search, filter]);

  const totalSigned = logs.filter((l) => l.type === "SIGNED").length;
  const totalUploads = logs.filter((l) => l.type === "UPLOAD").length;
  const totalScores = logs.filter((l) => l.type === "SCORE").length;

  return (
    <div className="pb-10 space-y-5 sm:space-y-6">


      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL ENTRIES"
          value={logs.length}
          icon={<StorageRoundedIcon />}
          iconBg="#F3F4F6"
          iconColor="#6B7280"
        />
        <StatCard
          title="SIGNED"
          value={totalSigned}
          icon={<ShieldOutlinedIcon />}
          iconBg="#EAF7EE"
          iconColor="#16A34A"
        />
        <StatCard
          title="UPLOADS"
          value={totalUploads}
          icon={<FileUploadOutlinedIcon />}
          iconBg="#F3E8FF"
          iconColor="#A855F7"
        />
        <StatCard
          title="SCORE UPDATES"
          value={totalScores}
          icon={<StarBorderRoundedIcon />}
          iconBg="#EEF4FF"
          iconColor="#2563EB"
        />
      </div>

      {/* LOG TABLE */}
      <section
        className="
          rounded-[28px]
          bg-white
          border border-[#DCEFE1]
          overflow-hidden
          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
        "
      >
        {/* HEADER */}
        <div className="px-5 sm:px-6 py-5 border-b border-[#EAF3E8] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF7F1] text-[#166B2D] flex items-center justify-center">
              <ShieldOutlinedIcon style={{ fontSize: 20 }} />
            </div>

            <div>
              <h2 className="text-[18px] font-black text-[#111827]">
                Blockchain Service Log
              </h2>
              <p className="text-sm text-[#9CA3AF]">
                {filteredLogs.length} entries · Repair Center Node 12
              </p>
            </div>
          </div>

          <button
            onClick={downloadLogs}
            className="
              h-[42px] px-4
              rounded-xl
              text-[#166B2D]
              text-xs font-black tracking-[0.12em]
              flex items-center gap-2
              hover:bg-[#EEF7F1]
              transition-all
            "
          >
            <DownloadRoundedIcon style={{ fontSize: 17 }} />
            DOWNLOAD JSON
          </button>
        </div>

        {/* FILTERS */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EAF3E8] flex flex-wrap gap-2">
          {["All", "SIGNED", "SCORE", "UPLOAD", "QUEUED", "ASSIGN", "VERIFIED", "NOTIFY"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item as "All" | LogType)}
                className={`
                  h-8 px-4
                  rounded-xl
                  border
                  text-[11px]
                  font-black
                  transition-all
                  ${
                    filter === item
                      ? "bg-[#166B2D] text-white border-[#166B2D]"
                      : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#166B2D]"
                  }
                `}
              >
                {item === "All" ? "All" : capitalize(item)}
              </button>
               
              
            )
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block">
          {logsLoading && (
            <div className="px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
              Loading service logs...
            </div>
          )}

          {!logsLoading && logsError && (
            <div className="px-6 py-10 text-center text-sm font-semibold text-[#DC2626]">
              {logsError}
            </div>
          )}

          {!logsLoading && !logsError && filteredLogs.length === 0 && (
            <div className="px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
              No service logs found
            </div>
          )}

          {!logsLoading && !logsError && filteredLogs.map((log, index) => (
            <LogRow key={log.id || `${log.hash}-${index}`} log={log} />
          ))}
        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden p-4 space-y-3 bg-[#F8FAFC]">
          {logsLoading && (
            <div className="rounded-[22px] bg-white border border-[#E5E7EB] p-6 text-center text-sm font-semibold text-[#9CA3AF]">
              Loading service logs...
            </div>
          )}

          {!logsLoading && logsError && (
            <div className="rounded-[22px] bg-red-50 border border-red-100 p-6 text-center text-sm font-semibold text-[#DC2626]">
              {logsError}
            </div>
          )}

          {!logsLoading && !logsError && filteredLogs.length === 0 && (
            <div className="rounded-[22px] bg-white border border-[#E5E7EB] p-6 text-center text-sm font-semibold text-[#9CA3AF]">
              No service logs found
            </div>
          )}

          {!logsLoading && !logsError && filteredLogs.map((log, index) => (
            <MobileLogCard key={log.id || `${log.hash}-${index}`} log={log} />
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#EAF3E8] flex items-center justify-between">
          <p className="text-sm text-[#9CA3AF]">
            {filteredLogs.length} of {logs.length} entries
          </p>

          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            className="
              text-[11px]
              font-black
              tracking-[0.12em]
              text-[#A0A8B5]
              hover:text-[#166B2D]
            "
          >
            CLEAR FILTERS
          </button>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="
        h-[92px]
        rounded-[22px]
        bg-white
        border border-[#E5E7EB]
        px-5
        flex items-center justify-between
        shadow-[0_10px_28px_rgba(0,0,0,0.04)]
      "
    >
      <div>
        <p className="text-[11px] font-black tracking-[0.15em] text-[#A0A8B5]">
          {title}
        </p>
        <h2 className="mt-2 text-[25px] font-black text-[#111827]">
          {value}
        </h2>
      </div>

      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: ServiceLog }) {
  return (
    <div
      className="
        min-h-[78px]
        px-6
        border-b border-[#DDEAE3]
        bg-[#F1F8F4]
        hover:bg-[#EAF4EF]
        transition-all
        flex items-center justify-between
        gap-5
      "
    >
      <div className="flex items-center gap-4 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: log.dot }}
        />

        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#374151]">
            {log.hash}
          </h3>
          <p className="mt-1 text-sm text-[#8A94A6] truncate">
            {log.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <TypeChip type={log.type} />
        <PassportChip value={log.passport} />

        <div className="text-right w-[78px]">
          <p className="text-sm font-black text-[#8A94A6]">
            {log.time}
          </p>
          <p className="text-[11px] text-[#B0B7C3]">
            {log.date}
          </p>
        </div>

        <button
          disabled={!log.explorerUrl}
          onClick={() => {
            if (log.explorerUrl) window.open(log.explorerUrl, "_blank", "noopener,noreferrer");
          }}
          className="w-9 h-9 rounded-xl text-[#B0B7C3] hover:bg-white hover:text-[#166B2D] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#B0B7C3] transition-all flex items-center justify-center"
        >
          <OpenInNewRoundedIcon style={{ fontSize: 17 }} />
        </button>
      </div>
    </div>
  );
}

function MobileLogCard({ log }: { log: ServiceLog }) {
  return (
    <div className="rounded-[22px] bg-white border border-[#E5E7EB] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
            style={{ background: log.dot }}
          />

          <div className="min-w-0">
            <h3 className="text-sm font-black text-[#374151]">
              {log.hash}
            </h3>
            <p className="mt-1 text-sm text-[#8A94A6] leading-relaxed">
              {log.description}
            </p>
          </div>
        </div>

        <button
          disabled={!log.explorerUrl}
          onClick={() => {
            if (log.explorerUrl) window.open(log.explorerUrl, "_blank", "noopener,noreferrer");
          }}
          className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#9CA3AF] disabled:opacity-40 flex items-center justify-center shrink-0"
        >
          <OpenInNewRoundedIcon style={{ fontSize: 17 }} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TypeChip type={log.type} />
        <PassportChip value={log.passport} />

        <span className="ml-auto text-xs font-bold text-[#9CA3AF]">
          {log.time}
        </span>
      </div>
    </div>
  );
}

function TypeChip({ type }: { type: LogType }) {
  const styles: Record<LogType, { bg: string; color: string }> = {
    SIGNED: { bg: "#EAF7EE", color: "#16A34A" },
    SCORE: { bg: "#EEF4FF", color: "#2563EB" },
    UPLOAD: { bg: "#F3E8FF", color: "#A855F7" },
    QUEUED: { bg: "#FFF4E6", color: "#EA8A00" },
    ASSIGN: { bg: "#FEF3C7", color: "#D97706" },
    VERIFIED: { bg: "#CCFBF1", color: "#0F766E" },
    NOTIFY: { bg: "#FCE7F3", color: "#DB2777" },
  };

  return (
    <span
      className="
        h-7 px-3
        rounded-lg
        text-[10px]
        font-black
        tracking-[0.12em]
        flex items-center
      "
      style={{
        background: styles[type].bg,
        color: styles[type].color,
      }}
    >
      {type}
    </span>
  );
}

function PassportChip({ value }: { value: string }) {
  return (
    <span
      className="
        h-7 px-3
        rounded-lg
        bg-[#EAF7EE]
        text-[#166B2D]
        text-[10px]
        font-black
        tracking-[0.08em]
        flex items-center
      "
    >
      {value}
    </span>
  );
}

function capitalize(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
