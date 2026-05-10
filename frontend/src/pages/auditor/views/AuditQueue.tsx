import { useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import TableContainer from "../../../components/ui/TableContainer";

/* ICONS */
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import OpacityOutlinedIcon from "@mui/icons-material/OpacityOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";

export default function AuditQueue() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [openReview, setOpenReview] = useState(false);

  const audits = [
    {
      id: "AUD-9912",
      garment: "GP-9822",
      manufacturer: "Sthlm-MF-01",
      company: "Textilab AB",
      type: "Certificate Verification",
      priority: "HIGH",
      status: "PENDING",
      date: "2026-03-20",
    },

    {
      id: "AUD-9913",
      garment: "GP-9855",
      manufacturer: "Porto-MF-04",
      company: "Porto Fibres",
      type: "Emissions Audit",
      priority: "MEDIUM",
      status: "IN PROGRESS",
      date: "2026-03-21",
    },

    {
      id: "AUD-9914",
      garment: "GP-9821",
      manufacturer: "Sthlm-MF-01",
      company: "Textilab AB",
      type: "Full Lifecycle Review",
      priority: "LOW",
      status: "COMPLETED",
      date: "2026-03-15",
    },

    {
      id: "AUD-9915",
      garment: "GP-9877",
      manufacturer: "Amst-MF-07",
      company: "EcoWeave NL",
      type: "Material Verification",
      priority: "HIGH",
      status: "PENDING",
      date: "2026-03-22",
    },

    {
      id: "AUD-9916",
      garment: "GP-9890",
      manufacturer: "Berlin-MF-03",
      company: "BerlinKleid",
      type: "Sustainability Claim",
      priority: "MEDIUM",
      status: "PENDING",
      date: "2026-03-23",
    },
  ];

  const filteredAudits =
    selectedFilter === "ALL"
      ? audits
      : audits.filter((a) => a.status === selectedFilter);

  return (
    <>
      {/* OVERLAY */}
      {openReview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />
      )}

      <div className="space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            title="PENDING REVIEWS"
            value="14"
            icon={<AccessTimeOutlinedIcon style={{ fontSize: 22 }} />}
            bg="bg-yellow-50"
            color="text-yellow-500"
          />

          <StatCard
            title="ACTIVE AUDITS"
            value="08"
            icon={<MonitorHeartOutlinedIcon style={{ fontSize: 22 }} />}
            bg="bg-blue-50"
            color="text-blue-500"
          />

          <StatCard
            title="APPROVED (MO)"
            value="128"
            icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 22 }} />}
            bg="bg-green-50"
            color="text-green-500"
          />

          <StatCard
            title="REJECTED (MO)"
            value="05"
            icon={<HighlightOffOutlinedIcon style={{ fontSize: 22 }} />}
            bg="bg-red-50"
            color="text-red-500"
          />

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col xl:flex-row gap-4 justify-between xl:items-start">

            <div>
              <h2 className="text-[18px] font-bold text-gray-900">
                Audit Verification Queue
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Verify sustainability claims and blockchain documentation
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3">

              <FilterBtn
                label="ALL"
                active={selectedFilter === "ALL"}
                onClick={() => setSelectedFilter("ALL")}
              />

              <FilterBtn
                label="PENDING"
                active={selectedFilter === "PENDING"}
                onClick={() => setSelectedFilter("PENDING")}
              />

              <FilterBtn
                label="IN PROGRESS"
                active={selectedFilter === "IN PROGRESS"}
                onClick={() => setSelectedFilter("IN PROGRESS")}
              />

              <FilterBtn
                label="COMPLETED"
                active={selectedFilter === "COMPLETED"}
                onClick={() => setSelectedFilter("COMPLETED")}
              />

              {/* SEARCH */}
              <div className="relative">
                <SearchOutlinedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: 18 }}
                />

                <input
                  placeholder="ID, garment, manufacturer"
                  className="
                    w-full sm:w-[230px] h-10 pl-10 pr-4
                    border rounded-xl
                    text-sm outline-none
                    bg-gray-50
                  "
                />
              </div>

            </div>
          </div>

          {/* TABLE */}
          <TableContainer>

            <table className="min-w-[1100px] w-full">

              <thead>
                <tr className="border-t border-b bg-gray-50/70">

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    AUDIT REF
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    GARMENT ID
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    MANUFACTURER
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    AUDIT TYPE
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    PRIORITY
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    STATUS
                  </th>

                  <th className="px-6 py-5 text-left text-[11px] tracking-widest text-gray-400">
                    DATE
                  </th>

                  <th className="px-6 py-5 text-right text-[11px] tracking-widest text-gray-400">
                    ACTION
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="border-b last:border-b-0 hover:bg-gray-50/40 transition"
                  >

                    <td className="px-6 py-6 text-sm font-bold text-gray-900">
                      {audit.id}
                    </td>

                    <td className="px-6 py-6 text-sm font-bold text-[#2563EB]">
                      {audit.garment}
                    </td>

                    <td className="px-6 py-6">
                      <p className="text-sm font-semibold">
                        {audit.manufacturer}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {audit.company}
                      </p>
                    </td>

                    <td className="px-6 py-6 text-sm font-semibold text-gray-800">
                      {audit.type}
                    </td>

                    <td className="px-6 py-6">
                      <PriorityBadge priority={audit.priority} />
                    </td>

                    <td className="px-6 py-6">
                      <StatusBadge status={audit.status} />
                    </td>

                    <td className="px-6 py-6 text-sm text-gray-500">
                      {audit.date}
                    </td>

                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={() => setOpenReview(true)}
                        className="
                          h-9 px-5 rounded-xl
                          bg-[#166534] hover:bg-[#14532D]
                          text-white text-xs font-bold
                          inline-flex items-center gap-2
                        "
                      >
                        <RemoveRedEyeOutlinedIcon
                          style={{ fontSize: 16 }}
                        />

                        REVIEW
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </TableContainer>

          {/* FOOTER */}
          <div className="px-6 py-4 flex justify-between items-center">

            <p className="text-xs text-gray-400">
              {filteredAudits.length} audits shown
            </p>

            <button className="flex items-center gap-2 text-[#166534] text-xs font-bold">
              <DownloadOutlinedIcon style={{ fontSize: 16 }} />
              EXPORT
            </button>

          </div>
        </div>
      </div>

      {/* REVIEW DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-[590px]
          bg-white z-[90]
          shadow-[-10px_0_40px_rgba(0,0,0,0.12)]
          transition-all duration-300
          overflow-y-auto
          ${openReview ? "translate-x-0" : "translate-x-full"}
        `}
      >

        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-start">

          <div className="space-y-5">

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 text-[11px] font-bold">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              IN REVIEW SESSION
            </div>

            <div className="flex gap-4">

              <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center">
                <FileCopyOutlinedIcon />
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-gray-900">
                  Audit: AUD-9912
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Garment:
                  <span className="text-[#166534] font-semibold ml-1">
                    GP-9822
                  </span>

                  · Certificate Verification
                </p>
              </div>

            </div>

          </div>

          <button
            onClick={() => setOpenReview(false)}
            className="
              w-10 h-10 rounded-xl
              flex items-center justify-center
              text-gray-400 hover:bg-gray-100
            "
          >
            <CloseOutlinedIcon />
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* OVERVIEW */}
          <Section title="AUDIT OVERVIEW">

            <div className="grid grid-cols-2 gap-4">

              <InfoCard
                label="MANUFACTURER"
                value="Sthlm-MF-01"
              />

              <InfoCard
                label="SUBMITTED BY"
                value="Textilab AB"
              />

              <InfoCard
                label="PRIORITY"
                value="High"
              />

              <InfoCard
                label="SUBMITTED"
                value="2026-03-20"
              />

            </div>

          </Section>

          {/* SUSTAINABILITY */}
          <Section title="EMISSIONS & SUSTAINABILITY">

            <MetricCard
              icon={<EnergySavingsLeafOutlinedIcon />}
              title="Carbon Footprint"
              value="4.2 kg CO₂e"
              green
            />

            <MetricCard
              icon={<OpacityOutlinedIcon />}
              title="Water Consumption"
              value="12.5 L"
              blue
            />

          </Section>

          {/* CERTIFICATES */}
          <Section title="COMPLIANCE CERTIFICATES">

            <CertificateCard
              title="GOTS 6.0 Certificate"
              sub="Issued by: Global Standard"
              status="VERIFIED"
            />

            <CertificateCard
              title="LCA Analysis Report"
              sub="Issued by: EcoChain AI"
              status="VERIFIED"
            />

            <CertificateCard
              title="Material Safety Data"
              sub="Issued by: Manufacturer"
              status="PENDING"
              warning
            />

          </Section>

          {/* NOTES */}
          <Section title="AUDITOR NOTES">

            <textarea
              placeholder="Add your review notes here..."
              className="
                w-full h-[120px]
                border rounded-2xl
                bg-gray-50
                p-4 text-sm
                outline-none resize-none
              "
            />

          </Section>

        </div>

        {/* FOOTER */}
        <div
            className="
                sticky bottom-0
                bg-white border-t
                px-6 py-4 flex gap-4
                z-20
            "
            >

          <button
            className="
              flex-1 h-14 rounded-2xl
              border border-red-200
              text-red-500 font-bold text-sm
              hover:bg-red-50
            "
          >
            REJECT AUDIT
          </button>

          <button
            className="
              flex-1 h-14 rounded-2xl
              bg-[#166534]
              hover:bg-[#14532D]
              text-white font-bold text-sm
            "
          >
            FINALISE & APPROVE
          </button>

        </div>

      </div>
    </>
  );
}

/* ================= HELPERS ================= */

function StatCard({
  title,
  value,
  icon,
  border,
  bg,
  color,
}: any) {
  return (
    <div
      className={`
        bg-white rounded-[24px]
        border ${border}
        px-6 py-6
        flex justify-between items-center
        shadow-sm
      `}
    >
      <div>
        <p className="text-[11px] tracking-widest text-gray-400 font-bold">
          {title}
        </p>

        <h2 className="text-[24px] font-bold text-gray-900 mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ${bg} ${color}
        `}
      >
        {icon}
      </div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        h-9 px-4 rounded-xl
        text-xs font-bold transition
        ${
          active
            ? "bg-[#0F172A] text-white"
            : "border bg-white text-gray-500 hover:bg-gray-50"
        }
      `}
    >
      {label}
    </button>
  );
}

function PriorityBadge({ priority }: any) {
  const styles: any = {
    HIGH:
      "bg-red-50 text-red-500 border border-red-200",

    MEDIUM:
      "bg-orange-50 text-orange-500 border border-orange-200",

    LOW:
      "bg-blue-50 text-blue-500 border border-blue-200",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full
        text-[10px] font-bold tracking-wide
        ${styles[priority]}
      `}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    PENDING:
      "bg-yellow-50 text-yellow-600 border border-yellow-200",

    "IN PROGRESS":
      "bg-blue-50 text-blue-600 border border-blue-200",

    COMPLETED:
      "bg-green-50 text-green-600 border border-green-200",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full
        text-[10px] font-bold tracking-wide
        ${styles[status]}
      `}
    >
      • {status}
    </span>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-gray-50 rounded-[28px] p-5">
      <p className="text-[11px] tracking-widest text-gray-400 font-bold mb-5">
        {title}
      </p>

      {children}
    </div>
  );
}

function InfoCard({ label, value }: any) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <p className="text-[11px] tracking-widest text-gray-400 font-bold">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  green,
  blue,
}: any) {
  return (
    <div
      className={`
        rounded-2xl border p-5
        flex items-center justify-between
        mb-4 last:mb-0
        ${
          green
            ? "bg-green-50 border-green-200"
            : "bg-blue-50 border-blue-200"
        }
      `}
    >
      <div className="flex items-center gap-3">

        <div
          className={`
            ${green ? "text-green-600" : "text-blue-500"}
          `}
        >
          {icon}
        </div>

        <p className="font-semibold text-gray-800">
          {title}
        </p>

      </div>

      <p
        className={`
          font-bold text-lg
          ${green ? "text-green-600" : "text-blue-500"}
        `}
      >
        {value}
      </p>
    </div>
  );
}

function CertificateCard({
  title,
  sub,
  status,
  warning,
}: any) {
  return (
    <div
      className="
        bg-white border rounded-2xl
        p-5 mb-4 last:mb-0
        flex justify-between items-center
      "
    >

      <div className="flex items-start gap-4">

        <div className="text-gray-400">
          <FileCopyOutlinedIcon />
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            {title}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {sub}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <span
          className={`
            px-3 py-1 rounded-lg
            text-[10px] font-bold
            ${
              warning
                ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }
          `}
        >
          {status}
        </span>

        <button className="text-gray-300 hover:text-gray-600">
          <OpenInNewOutlinedIcon style={{ fontSize: 18 }} />
        </button>

      </div>

    </div>
  );
}