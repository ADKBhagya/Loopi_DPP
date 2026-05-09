import { useMemo, useState } from "react";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function RepairRecords() {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  const [selectedRecord, setSelectedRecord] =
    useState<any>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [records, setRecords] = useState([
    {
      id: "REP-4401",
      passport: "GP-9821",
      garment: "Recycled Wool Blazer",
      service: "Lining",
      type: "Mending",
      technician: "Erik Lund",
      duration: "2h",
      cost: "€28",
      date: "2026-03-20",
      status: "COMPLETED",
      note:
        "Inner lining replaced using organic cotton materials.",
    },

    {
      id: "REP-4403",
      passport: "GP-9831",
      garment: "Eco Denim Jacket",
      service: "Zipper Repair",
      type: "Hardware",
      technician: "Erik Lund",
      duration: "1.5h",
      cost: "€18",
      date: "2026-03-18",
      status: "COMPLETED",
      note:
        "Premium zipper installed and stress tested.",
    },

    {
      id: "REP-4405",
      passport: "GP-9877",
      garment: "Organic Hoodie",
      service: "Stain Removal",
      type: "Cleaning",
      technician: "Sara Voss",
      duration: "3h",
      cost: "€35",
      date: "2026-03-15",
      status: "COMPLETED",
      note:
        "Eco-safe chemical cleaning performed successfully.",
    },

    {
      id: "REP-4410",
      passport: "GP-9888",
      garment: "Cotton Shirt",
      service: "Button Replacement",
      type: "Hardware",
      technician: "Emma Fischer",
      duration: "1h",
      cost: "€12",
      date: "2026-03-21",
      status: "IN PROGRESS",
      note:
        "Awaiting final quality inspection before closure.",
    },

    {
      id: "REP-4412",
      passport: "GP-9900",
      garment: "Winter Coat",
      service: "Sleeve Repair",
      type: "Mending",
      technician: "Jonas Keller",
      duration: "2.5h",
      cost: "€42",
      date: "2026-03-22",
      status: "QUEUED",
      note:
        "Repair scheduled for tomorrow morning.",
    },
  ]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const value = search.toLowerCase();

      const matchesSearch =
        record.id.toLowerCase().includes(value) ||
        record.passport
          .toLowerCase()
          .includes(value) ||
        record.garment
          .toLowerCase()
          .includes(value) ||
        record.technician
          .toLowerCase()
          .includes(value);

      const matchesFilter =
        filter === "ALL"
          ? true
          : record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const stats = {
    total: records.length,

    completed: records.filter(
      (r) => r.status === "COMPLETED"
    ).length,

    progress: records.filter(
      (r) => r.status === "IN PROGRESS"
    ).length,

    queued: records.filter(
      (r) => r.status === "QUEUED"
    ).length,
  };

  return (
    <div className="space-y-5 pb-10">

      {/* STATS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-4
        "
      >

        <StatCard
          title="TOTAL JOBS"
          value={stats.total}
          icon={<BuildOutlinedIcon />}
          bg="#F3F4F6"
          color="#111827"
        />

        <StatCard
          title="COMPLETED"
          value={stats.completed}
          icon={<CheckCircleRoundedIcon />}
          bg="#EEF7F1"
          color="#16A34A"
        />

        <StatCard
          title="IN PROGRESS"
          value={stats.progress}
          icon={<AutorenewRoundedIcon />}
          bg="#FFF7ED"
          color="#EA580C"
        />

        <StatCard
          title="QUEUED"
          value={stats.queued}
          icon={<AccessTimeRoundedIcon />}
          bg="#EEF4FF"
          color="#2563EB"
        />

      </div>

      {/* TABLE */}
      <section
        className="
          bg-white

          border border-[#ECECEC]

          rounded-[30px]

          overflow-hidden

          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
        "
      >

        {/* HEADER */}
        <div
          className="
            px-5 sm:px-6
            py-5

            border-b border-[#F3F4F6]

            flex flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4
          "
        >

          <div>

            <h2 className="text-[22px] font-black text-[#111827]">
              Repair Records
            </h2>

            <p className="mt-1 text-sm text-[#9CA3AF]">
              All service history · blockchain-signed
            </p>

          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-2 flex-wrap">

            {[
              "ALL",
              "COMPLETED",
              "IN PROGRESS",
              "QUEUED",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`
                  h-[38px]
                  px-4

                  rounded-xl

                  text-xs
                  font-black

                  transition-all

                  ${
                    filter === item
                      ? "bg-[#111827] text-white"
                      : "bg-[#F8FAFC] border border-[#ECECEC] text-[#6B7280]"
                  }
                `}
              >
                {item}
              </button>

            ))}
              
                       {/* SEARCH */}
        <div className="relative w-full xl:w-[300px]">

          <SearchRoundedIcon
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#9CA3AF]
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search repairs, garments..."
            className="
              w-full
              h-[52px]

              rounded-2xl

              border border-[#ECECEC]

              bg-white

              pl-11 pr-4

              text-sm

              outline-none

              focus:border-[#166B2D]
            "
          />

        </div>

          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-[#F5F5F5]">

                {[
                  "REF ID",
                  "GARMENT",
                  "SERVICE",
                  "TYPE",
                  "TECHNICIAN",
                  "DURATION",
                  "COST",
                  "DATE",
                  "STATUS",
                  "ACTION",
                ].map((head) => (

                  <th
                    key={head}
                    className="
                      px-4 py-5

                      text-left

                      text-[11px]

                      tracking-[0.12em]

                      font-black

                      text-[#9CA3AF]
                    "
                  >
                    {head}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {filteredRecords.map((record) => (

                <tr
                  key={record.id}
                  className="
                    border-b border-[#F7F7F7]

                    hover:bg-[#FAFAFA]

                    transition-all
                  "
                >

                  <td className="px-4 py-5 font-black text-[#111827]">
                    {record.id}
                  </td>

                  <td className="px-4 py-5">

                    <div>

                      <p className="font-black text-[#166B2D]">
                        {record.passport}
                      </p>

                      <p className="mt-1 text-sm text-[#6B7280]">
                        {record.garment}
                      </p>

                    </div>

                  </td>

                  <td className="px-4 py-5 font-black text-[#111827]">
                    {record.service}
                  </td>

                  <td className="px-4 py-5">

                    <TypeTag>
                      {record.type}
                    </TypeTag>

                  </td>

                  <td className="px-4 py-5 text-[#4B5563] font-semibold">
                    {record.technician}
                  </td>

                  <td className="px-4 py-5 text-[#6B7280]">
                    {record.duration}
                  </td>

                  <td className="px-4 py-5 font-black text-[#111827]">
                    {record.cost}
                  </td>

                  <td className="px-4 py-5 text-[#9CA3AF]">
                    {record.date}
                  </td>

                  <td className="px-4 py-5">

                    <StatusChip
                      status={record.status}
                    />

                  </td>

                  <td className="px-4 py-5">

                    <button
                      onClick={() =>
                        setSelectedRecord(record)
                      }
                      className="
                        w-10 h-10

                        rounded-xl

                        border border-[#ECECEC]

                        hover:bg-[#F8FAFC]

                        flex items-center justify-center
                      "
                    >
                      <VisibilityOutlinedIcon
                        style={{
                          fontSize: 20,
                        }}
                      />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}
        <div className="xl:hidden p-4 space-y-4">

          {filteredRecords.map((record) => (

            <div
              key={record.id}
              className="
                rounded-[24px]

                border border-[#ECECEC]

                bg-[#FAFAFA]

                p-4
              "
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="font-black text-[#111827]">
                    {record.id}
                  </h3>

                  <p className="mt-1 text-sm text-[#166B2D] font-bold">
                    {record.passport}
                  </p>

                </div>

                <StatusChip
                  status={record.status}
                />

              </div>

              <div className="mt-4 space-y-3">

                <MobileRow
                  label="Garment"
                  value={record.garment}
                />

                <MobileRow
                  label="Service"
                  value={record.service}
                />

                <MobileRow
                  label="Technician"
                  value={record.technician}
                />

                <MobileRow
                  label="Duration"
                  value={record.duration}
                />

                <MobileRow
                  label="Cost"
                  value={record.cost}
                />

              </div>

              <button
                onClick={() =>
                  setSelectedRecord(record)
                }
                className="
                  mt-5

                  h-[48px]
                  w-full

                  rounded-2xl

                  bg-[#166B2D]

                  text-white

                  text-sm
                  font-black

                  flex items-center justify-center
                  gap-2
                "
              >

                <VisibilityOutlinedIcon />

                VIEW DETAILS

              </button>

            </div>

          ))}

        </div>

        {/* FOOTER */}
        <div
          className="
            px-5 py-4

            border-t border-[#F3F4F6]

            flex items-center justify-between
          "
        >

          <p className="text-sm text-[#9CA3AF]">
            {filteredRecords.length} records
          </p>

          <button
            className="
              h-[42px]
              px-4

              rounded-xl

              bg-[#EEF7F1]

              text-[#166B2D]

              text-xs
              font-black

              tracking-[0.12em]

              flex items-center gap-2
            "
          >

            <FileDownloadOutlinedIcon
              style={{
                fontSize: 18,
              }}
            />

            EXPORT CSV

          </button>

        </div>

      </section>

{/* DETAILS MODAL */}
{selectedRecord && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() =>
        setSelectedRecord(null)
      }
      className="
        fixed inset-0
        bg-black/35
        backdrop-blur-[4px]
        z-[9998]
      "
    />

    {/* SIDEBAR */}
    <div
      className="
        fixed right-0 top-0

        h-screen
        w-full sm:w-[390px]

        bg-[#F3F4F6]

        z-[9999]

        border-l border-[#E5E7EB]

        shadow-[-25px_0_80px_rgba(0,0,0,0.14)]

        flex flex-col
      "
    >

      {/* HEADER */}
      <div
        className="
          h-[86px]

          bg-white

          border-b border-[#ECECEC]

          px-5

          flex items-center justify-between
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-11 h-11

              rounded-2xl

              bg-[#166B2D]

              text-white

              flex items-center justify-center

              shadow-[0_10px_20px_rgba(22,107,45,0.22)]
            "
          >
            <BuildOutlinedIcon
              style={{
                fontSize: 20,
              }}
            />
          </div>

          <div>

            <h2
              className="
                text-[22px]
                font-black
                text-[#111827]
                leading-none
              "
            >
              {selectedRecord.id}
            </h2>

            <p
              className="
                mt-1
                text-[12px]
                text-[#9CA3AF]
                font-semibold
              "
            >
              {selectedRecord.passport} ·{" "}
              {selectedRecord.service}
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            setSelectedRecord(null)
          }
          className="
            w-10 h-10

            rounded-xl

            hover:bg-[#F3F4F6]

            flex items-center justify-center

            transition-all
          "
        >
          <CloseRoundedIcon
            style={{
              fontSize: 20,
              color: "#9CA3AF",
            }}
          />
        </button>

      </div>

      {/* BODY */}
      <div
        className="
          flex-1
          overflow-y-auto

          p-4

          space-y-4
        "
      >

        {/* MAIN INFO CARD */}
        <div
          className="
            rounded-[24px]

            bg-white

            border border-[#ECECEC]

            overflow-hidden
          "
        >

          <InfoRow
            label="Status"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.status}
              </span>
            }
          />

          <InfoRow
            label="Service Type"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.type}
              </span>
            }
          />

          <InfoRow
            label="Part"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.service}
              </span>
            }
          />

          <InfoRow
            label="Technician"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.technician}
              </span>
            }
          />

          <InfoRow
            label="Duration"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.duration}
              </span>
            }
          />

          <InfoRow
            label="Cost"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.cost}
              </span>
            }
          />

          <InfoRow
            last
            label="Date"
            value={
              <span className="font-black text-[#111827]">
                {selectedRecord.date}
              </span>
            }
          />

        </div>

        {/* NOTES */}
        <div
          className="
            rounded-[22px]

            bg-white

            border border-[#ECECEC]

            p-4
          "
        >

          <p
            className="
              text-[11px]

              tracking-[0.12em]

              font-black

              text-[#9CA3AF]
            "
          >
            REPAIR NOTES
          </p>

          <p
            className="
              mt-3

              text-[14px]
              leading-relaxed

              text-[#4B5563]

              font-semibold
            "
          >
            {selectedRecord.note}
          </p>

        </div>

        {/* SUCCESS CARD */}
        <div
          className="
            rounded-[20px]

            border border-[#CDEFD7]

            bg-[#EEF9F1]

            px-4 py-4

            flex items-start
            gap-3
          "
        >

          <div
            className="
              w-9 h-9

              rounded-xl

              bg-[#DCF5E3]

              text-[#16A34A]

              flex items-center justify-center

              shrink-0
            "
          >
            <HandymanRoundedIcon
              style={{
                fontSize: 18,
              }}
            />
          </div>

          <div>

            <p
              className="
                text-[13px]

                font-black

                text-[#166534]
              "
            >
              +15 Circle Credits
              <span className="font-semibold">
                {" "}
                added to passport upon completion
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div
        className="
          px-4 py-4

          border-t border-[#E5E7EB]

          bg-white
        "
      >

        <button
          className="
            w-11 h-11

            rounded-xl

            border border-[#D1D5DB]

            bg-[#FAFAFA]

            hover:bg-[#F3F4F6]

            flex items-center justify-center

            transition-all
          "
        >
          <DownloadRoundedIcon
            style={{
              fontSize: 18,
              color: "#6B7280",
            }}
          />
        </button>

      </div>

    </div>

  </>
)}

    </div>
  );
}

/* COMPONENTS */

function StatCard({
  title,
  value,
  icon,
  bg,
  color,
}: any) {
  return (
    <div
      className="
        min-h-[110px]

        rounded-[24px]

        bg-white

        border border-[#ECECEC]

        px-5 py-5

        shadow-[0_12px_30px_rgba(0,0,0,0.04)]

        flex items-center justify-between
      "
    >

      <div>

        <p
          className="
            text-[11px]

            tracking-[0.14em]

            font-black

            text-[#9CA3AF]
          "
        >
          {title}
        </p>

        <h1 className="mt-3 text-[22px] font-black text-[#111827]">
          {value}
        </h1>

      </div>

      <div
        className="
          w-12 h-12

          rounded-2xl

          flex items-center justify-center
        "
        style={{
          background: bg,
          color,
        }}
      >
        {icon}
      </div>

    </div>
  );
}

function StatusChip({ status }: any) {
  const styles: any = {
    COMPLETED: {
      bg: "#EAF7EE",
      color: "#16A34A",
    },

    "IN PROGRESS": {
      bg: "#FFF4E6",
      color: "#EA580C",
    },

    QUEUED: {
      bg: "#EEF4FF",
      color: "#2563EB",
    },
  };

  return (
    <div
      className="
        h-7
        px-3

        rounded-xl

        text-[10px]
        font-black

        tracking-[0.10em]

        flex items-center
      "
      style={{
        background:
          styles[status]?.bg,

        color:
          styles[status]?.color,
      }}
    >
      {status}
    </div>
  );
}

function TypeTag({ children }: any) {
  return (
    <div
      className="
        h-7
        px-3

        rounded-lg

        bg-[#F3F4F6]

        text-[#4B5563]

        text-[10px]
        font-black

        flex items-center
        w-fit
      "
    >
      {children}
    </div>
  );
}

function DetailCard({
  label,
  value,
}: any) {
  return (
    <div
      className="
        rounded-[22px]

        border border-[#ECECEC]

        bg-white

        p-5
      "
    >

      <p
        className="
          text-[11px]

          tracking-[0.14em]

          text-[#9CA3AF]

          font-black
        "
      >
        {label}
      </p>

      <p className="mt-3 text-[#111827] font-bold">
        {value}
      </p>

    </div>
  );
}

function MobileRow({
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between gap-4">

      <p className="text-sm text-[#9CA3AF] font-semibold">
        {label}
      </p>

      <p className="text-sm font-black text-[#111827] text-right">
        {value}
      </p>

    </div>
  );
}

/* INFO ROW COMPONENT */
function InfoRow({
  label,
  value,
  last = false,
}: any) {
  return (
    <div
      className={`
        px-4 py-4

        flex items-center justify-between
        gap-4

        ${
          !last
            ? "border-b border-[#F3F4F6]"
            : ""
        }
      `}
    >

      <p
        className="
          text-[13px]
          text-[#9CA3AF]
          font-semibold
        "
      >
        {label}
      </p>

      <div className="text-right">
        {value}
      </div>

    </div>
  );
}