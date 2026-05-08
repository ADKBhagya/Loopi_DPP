import { useMemo, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import TableContainer from "../../../components/ui/TableContainer";

/* ICONS */
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

export default function AuditTrail() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("ALL_DATES");
  const [search, setSearch] = useState("");

  const logs = [
    {
      hash: "0x8821...F339",
      message: "Tx: Audit Approval recorded for GP-9821",
      status: "APPROVAL",
      garment: "GP-9821",
      time: "15:42:01",
      date: "Mar 20, 2026",
      dot: "green",
    },

    {
      hash: "0x7c4a...B112",
      message: "Tx: Certificate Verification started for GP-9822",
      status: "INITIATED",
      garment: "GP-9822",
      time: "14:38:22",
      date: "Mar 20, 2026",
      dot: "blue",
    },

    {
      hash: "0x3f2e...9D4A",
      message: "Tx: Emissions Audit in progress for GP-9855",
      status: "IN PROGRESS",
      garment: "GP-9855",
      time: "13:11:09",
      date: "Mar 20, 2026",
      dot: "orange",
    },

    {
      hash: "0xA9b0...C221",
      message: "Tx: Full Lifecycle Review completed for GP-9814",
      status: "COMPLETED",
      garment: "GP-9814",
      time: "11:05:44",
      date: "Mar 19, 2026",
      dot: "green",
    },

    {
      hash: "0x6d1c...E883",
      message: "Tx: Material certificate uploaded for GP-9801",
      status: "DOCUMENT",
      garment: "GP-9801",
      time: "09:27:33",
      date: "Mar 19, 2026",
      dot: "gray",
    },

    {
      hash: "0x2210...A74F",
      message: "Tx: Audit Rejected for GP-9799",
      status: "REJECTED",
      garment: "GP-9799",
      time: "16:55:18",
      date: "Mar 18, 2026",
      dot: "red",
    },

    {
      hash: "0xBC33...0F21",
      message: "Tx: Sustainability claim verified for GP-9797",
      status: "APPROVAL",
      garment: "GP-9797",
      time: "14:02:07",
      date: "Mar 18, 2026",
      dot: "green",
    },

    {
      hash: "0x5AA...D330",
      message: "Tx: New audit submitted for GP-9877",
      status: "INITIATED",
      garment: "GP-9877",
      time: "08:19:44",
      date: "Mar 17, 2026",
      dot: "blue",
    },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        selectedFilter === "ALL" ||
        log.status === selectedFilter;

      const matchesDate =
        selectedDate === "ALL_DATES" ||
        log.date === selectedDate;

      const matchesSearch =
        log.hash.toLowerCase().includes(search.toLowerCase()) ||
        log.garment.toLowerCase().includes(search.toLowerCase()) ||
        log.message.toLowerCase().includes(search.toLowerCase());

      return (
        matchesFilter &&
        matchesDate &&
        matchesSearch
      );
    });
  }, [selectedFilter, selectedDate, search]);

  return (
    <div className="space-y-5 pb-10">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="PENDING REVIEWS"
          value="14"
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
          icon={<AccessTimeOutlinedIcon style={{ fontSize: 20 }} />}
        />

        <StatCard
          title="ACTIVE AUDITS"
          value="08"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          icon={<MonitorHeartOutlinedIcon style={{ fontSize: 20 }} />}
        />

        <StatCard
          title="APPROVED (MO)"
          value="128"
          iconBg="bg-green-50"
          iconColor="text-green-500"
          icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />}
        />

        <StatCard
          title="REJECTED (MO)"
          value="05"
          iconBg="bg-red-50"
          iconColor="text-red-500"
          icon={<HighlightOffOutlinedIcon style={{ fontSize: 20 }} />}
        />

      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-[26px] border border-gray-100 shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-5 py-5 border-b border-gray-100 flex justify-between items-start">

          <div className="flex items-start gap-4">

            <div
              className="
                w-10 h-10 rounded-xl
                bg-green-50 border border-green-100
                flex items-center justify-center
              "
            >
              <ShieldOutlinedIcon
                className="text-[#166534]"
                style={{ fontSize: 20 }}
              />
            </div>

            <div>

              <h2 className="text-[20px] font-bold text-gray-900">
                Immutable Audit Logs
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                8 entries · Blockchain-anchored
              </p>

            </div>

          </div>

          <button
            className="
              h-11 px-5 rounded-xl
              text-[#166534]
              hover:bg-green-50
              text-xs font-bold
              flex items-center gap-2
              tracking-wide
            "
          >
            <DownloadOutlinedIcon style={{ fontSize: 18 }} />
            DOWNLOAD ALL JSON
          </button>

        </div>

        {/* FILTERS */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">

          <div className="flex items-center gap-3 flex-wrap">

            {/* SEARCH */}
            <div className="relative">

              <SearchOutlinedIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                style={{ fontSize: 18 }}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hash, tx, garment ID..."
                className="
                  w-[240px] h-10
                  rounded-xl border
                  bg-gray-50
                  pl-10 pr-4
                  text-sm outline-none
                  focus:border-[#166534]
                "
              />

            </div>

            {/* STATUS FILTERS */}
            <FilterBtn
              label="All"
              active={selectedFilter === "ALL"}
              onClick={() => setSelectedFilter("ALL")}
            />

            <FilterBtn
              label="Approval"
              active={selectedFilter === "APPROVAL"}
              onClick={() => setSelectedFilter("APPROVAL")}
            />

            <FilterBtn
              label="Rejected"
              active={selectedFilter === "REJECTED"}
              onClick={() => setSelectedFilter("REJECTED")}
            />

            <FilterBtn
              label="Initiated"
              active={selectedFilter === "INITIATED"}
              onClick={() => setSelectedFilter("INITIATED")}
            />

            {/* DATE FILTER */}
            <FilterBtn
              label="All Dates"
              dark
              active={selectedDate === "ALL_DATES"}
              onClick={() => setSelectedDate("ALL_DATES")}
            />

            <FilterBtn
              label="Mar 20"
              active={selectedDate === "Mar 20, 2026"}
              onClick={() => setSelectedDate("Mar 20, 2026")}
            />

            <FilterBtn
              label="Mar 19"
              active={selectedDate === "Mar 19, 2026"}
              onClick={() => setSelectedDate("Mar 19, 2026")}
            />

            <FilterBtn
              label="Mar 18"
              active={selectedDate === "Mar 18, 2026"}
              onClick={() => setSelectedDate("Mar 18, 2026")}
            />

            <FilterBtn
              label="Mar 17"
              active={selectedDate === "Mar 17, 2026"}
              onClick={() => setSelectedDate("Mar 17, 2026")}
            />

          </div>

        </div>

        {/* LOGS */}
        <div>

          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className="
                px-5 py-5
                border-b border-gray-100
                hover:bg-gray-50/50
                transition
                flex items-center justify-between
              "
            >

              {/* LEFT */}
              <div className="flex items-start gap-4">

                {/* DOT */}
                <div
                  className={`
                    mt-2 w-2.5 h-2.5 rounded-full
                    ${
                      log.dot === "green"
                        ? "bg-green-500"
                        : log.dot === "blue"
                        ? "bg-blue-500"
                        : log.dot === "orange"
                        ? "bg-orange-400"
                        : log.dot === "red"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }
                  `}
                />

                <div>

                  <h3 className="text-[13px] font-bold text-gray-900">
                    {log.hash}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {log.message}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-5">

                {/* STATUS */}
                <span
                  className={`
                    px-3 py-1 rounded-md
                    text-[10px] font-bold tracking-wide
                    ${
                      log.status === "APPROVAL"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : log.status === "INITIATED"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : log.status === "IN PROGRESS"
                        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                        : log.status === "COMPLETED"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : log.status === "DOCUMENT"
                        ? "bg-gray-50 text-gray-500 border border-gray-200"
                        : "bg-red-50 text-red-500 border border-red-200"
                    }
                  `}
                >
                  {log.status}
                </span>

                {/* GARMENT */}
                <span
                  className="
                    px-2 py-1 rounded-md
                    bg-green-50 border border-green-100
                    text-[#166534]
                    text-[10px] font-bold
                  "
                >
                  {log.garment}
                </span>

                {/* DATE */}
                <div className="text-right">

                  <p className="text-[12px] font-semibold text-gray-500">
                    {log.time}
                  </p>

                  <p className="text-[11px] text-gray-300 mt-1">
                    {log.date}
                  </p>

                </div>

                {/* OPEN */}
                <button className="text-gray-300 hover:text-gray-600 transition">
                  <OpenInNewOutlinedIcon style={{ fontSize: 18 }} />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 flex items-center justify-between">

          <p className="text-xs text-gray-300">
            {filteredLogs.length} of 8 entries ·
            All immutable on LOOPI blockchain
          </p>

          <button
            onClick={() => {
              setSelectedFilter("ALL");
              setSelectedDate("ALL_DATES");
              setSearch("");
            }}
            className="
              text-[11px]
              tracking-[2px]
              text-gray-400
              font-bold
              hover:text-gray-700
            "
          >
            CLEAR ALL FILTERS
          </button>

        </div>

      </div>

    </div>
  );
}

/* FILTER BUTTON */

function FilterBtn({
  label,
  active,
  onClick,
  dark,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`
        h-8 px-3 rounded-lg
        text-[11px] font-bold
        transition-all
        ${
          active
            ? dark
              ? "bg-[#0F172A] text-white"
              : "bg-[#166534] text-white"
            : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
        }
      `}
    >
      {label}
    </button>
  );
}

/* STAT CARD */

function StatCard({
  title,
  value,
  border,
  iconBg,
  iconColor,
  icon,
}: any) {
  return (
    <div
      className={`
        bg-white rounded-[22px]
        border ${border}
        px-5 py-4
        shadow-sm
      `}
    >

      <p className="text-[11px] tracking-[2px] text-gray-400 font-bold">
        {title}
      </p>

      <div className="flex justify-between items-center mt-3">

        <h2 className="text-[24px] leading-none font-bold text-gray-900">
          {value}
        </h2>

        <div
          className={`
            w-12 h-12 rounded-2xl
            flex items-center justify-center
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}