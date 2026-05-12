import { useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ModalPortal from "../../../components/modals/ModalPortal";

export default function EmissionsData() {
  const [showDetails, setShowDetails] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const chartData = [
    { month: "Sep", value: "6.2", height: 74 },
    { month: "Oct", value: "5.8", height: 68 },
    { month: "Nov", value: "7.1", height: 86 },
    { month: "Dec", value: "4.9", height: 58 },
    { month: "Jan", value: "5.5", height: 65 },
    { month: "Feb", value: "4.2", height: 50 },
    { month: "Mar", value: "3.9", height: 46, active: true },
  ];

  return (
    <div className="bg-[#F4F7FB] min-h-screen">

      {/* TOP STATS */}

      <div className="grid grid-cols-4 gap-5">

        <StatCard
          title="TOTAL CO₂e (MO)"
          value="6.5 t"
          icon={<Co2OutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-blue-50"
          color="text-blue-600"
        />

        <StatCard
          title="AVG PER SHIPMENT"
          value="0.82 kg"
          icon={<MonitorHeartOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-green-50"
          color="text-green-700"
        />

        <StatCard
          title="VS PREVIOUS MO"
          value="−12.5%"
          icon={<TrendingDownOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-orange-50"
          color="text-orange-500"
        />

        <StatCard
          title="CARBON OFFSET"
          value="1.2 t"
          icon={<ShieldOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-teal-50"
          color="text-teal-600"
        />
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-[1.9fr_0.9fr] gap-5 mt-6">

        {/* LEFT */}

        <div className="bg-white border border-gray-100 rounded-[30px] shadow-sm p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-[20px] font-bold text-gray-900">
                Monthly CO₂ Trend
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                kg CO₂e per shipment batch · last 7 months
              </p>
            </div>

            <button 
            onClick={() => setOpenExport(true)}
            className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-bold flex items-center gap-2 hover:bg-gray-50">

              <DownloadOutlinedIcon style={{ fontSize: 17 }} />

              Export
            </button>
          </div>

          {/* CHART */}

          <div className="mt-12 flex items-end justify-between gap-2 h-[180px]">

            {chartData.map((item) => (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center"
              >

                <p className="text-[12px] font-bold text-gray-500 mb-5">
                  {item.value}
                </p>

                <div
                  className={`w-full rounded-t-2xl transition-all ${
                    item.active
                      ? "bg-[#1B5E20]"
                      : "bg-[#A9C4E7]"
                  }`}
                  style={{
                    height: `${item.height}px`,
                  }}
                ></div>

                <p className="mt-4 text-[12px] font-bold text-gray-400">
                  {item.month}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-white border border-gray-100 rounded-[30px] shadow-sm p-6">

          <h2 className="text-[20px] font-bold text-gray-900">
            Emissions by Mode
          </h2>

          <div className="mt-8 space-y-7">

            <ProgressItem
              label="Road"
              value="4.2 t (65%)"
              width="65%"
              color="bg-blue-600"
            />

            <ProgressItem
              label="Ship"
              value="1.8 t (28%)"
              width="28%"
              color="bg-teal-500"
            />

            <ProgressItem
              label="Air"
              value="0.5 t (7%)"
              width="7%"
              color="bg-orange-500"
            />
          </div>

          {/* BLOCKCHAIN VERIFIED */}

          <div className="mt-8 rounded-2xl bg-[#F3F8F3] border border-[#D9E9DA] p-5">

            <div className="flex items-center gap-2">

              <ShieldOutlinedIcon
                className="text-[#1B5E20]"
                style={{ fontSize: 18 }}
              />

              <h3 className="font-bold text-[#1B5E20] text-sm">
                Blockchain Certified
              </h3>
            </div>

            <p className="text-xs text-gray-500 mt-3 leading-6">
              All emissions data notarised and immutable on-chain.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BANNER */}

      <div className="mt-6 rounded-[28px] bg-[#2458F3] shadow-2xl px-6 py-5 flex items-center justify-between">

        <div>

          <p className="text-[11px] tracking-[2px] font-bold text-blue-200 uppercase">
            Sustainability Milestone
          </p>

          <h2 className="text-white text-[31px] font-bold mt-3">
            12.5% CO₂ Reduction
          </h2>

          <p className="text-blue-100 mt-3 text-[18px] leading-8 max-w-[720px]">
            Emissions per garment unit decreased vs Q4 2025 —
            optimised road routing Stockholm → Hamburg.
          </p>
        </div>

        <button className="h-11 px-7 rounded-2xl bg-white text-[#2458F3] text-sm font-bold tracking-[1px] flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all">

          <DownloadOutlinedIcon style={{ fontSize: 18 }} />

          EXPORT REPORT
        </button>
      </div>

      {/* ================= EXPORT MODAL ================= */}

        {openExport && (
        <ModalPortal>
        <>
            {/* OVERLAY */}
            <div className="fixed inset-0 bg-black/35 backdrop-blur-[3px] z-[9998]"></div>

            {/* MODAL */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            <div className="w-[430px] rounded-[26px] bg-white shadow-2xl border border-gray-100 overflow-hidden">

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

                <div>
                    <h2 className="text-[20px] font-bold text-gray-900">
                    Export Emissions Data
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                    Generate sustainability reports and blockchain-certified exports
                    </p>
                </div>

                <button
                    onClick={() => setOpenExport(false)}
                    className="text-gray-400 hover:text-gray-700"
                >
                    <CloseOutlinedIcon />
                </button>
                </div>

                {/* OPTIONS */}
                <div className="p-6 space-y-4">

                <ExportOption
                    title="CSV (Spreadsheet)"
                    subtitle="Raw emissions metrics for analytics"
                />

                <ExportOption
                    title="JSON (API format)"
                    subtitle="Machine-readable blockchain payload"
                />

                <ExportOption
                    title="PDF Report"
                    subtitle="Executive sustainability report"
                />

                <ExportOption
                    title="EU DPP Format"
                    subtitle="Compliant Digital Product Passport export"
                />
                </div>

                {/* FOOTER */}
                <div className="px-6 py-5 border-t border-gray-100 flex justify-end">

                <button
                    onClick={() => setOpenExport(false)}
                    className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
        </>
        </ModalPortal>
        )} 
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
  bg,
  color,
}: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">

      <div>
        <p className="text-[12px] font-bold tracking-widest text-gray-400">
          {title}
        </p>

        <h1 className="text-[22px] font-bold text-gray-900 mt-2 leading-none">
          {value}
        </h1>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

/* ================= PROGRESS ================= */

function ProgressItem({
  label,
  value,
  width,
  color,
}: any) {
  return (
    <div>

      <div className="flex items-center justify-between mb-3">

        <p className="text-sm font-bold text-gray-700">
          {label}
        </p>

        <p className="text-sm font-bold text-gray-500">
          {value}
        </p>
      </div>

      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">

        <div
          className={`h-full rounded-full ${color}`}
          style={{ width }}
        ></div>
      </div>
    </div>
  );
}

/* ================= EXPORT OPTION ================= */

function ExportOption({
  title,
  subtitle,
}: any) {
  return (
    <button className="w-full rounded-2xl border border-gray-200 bg-[#F8FAFC] hover:bg-white hover:border-[#2458F3] transition-all p-5 flex items-center justify-between text-left group">

      <div>
        <h3 className="font-bold text-gray-900 text-sm">
          {title}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#2458F3] group-hover:border-[#2458F3] transition-all">

        <OpenInNewOutlinedIcon style={{ fontSize: 18 }} />
      </div>
    </button>
  );
}
