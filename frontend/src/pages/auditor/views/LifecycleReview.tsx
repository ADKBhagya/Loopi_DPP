import { useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";

import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import OpacityOutlinedIcon from "@mui/icons-material/OpacityOutlined";

import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";

export default function LifecycleReview() {
  const [passportId, setPassportId] = useState("GP-9821");
  const [lifecycle, setLifecycle] = useState<any>(null);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState("raw");

  const [timeline, setTimeline] = useState([
    {
      id: "raw",
      title: "Raw Material Sourcing",
      location: "FairFibre Coop, India",
      date: "Jan 02, 2026",
      status: "VERIFIED",
    },

    {
      id: "manufacturing",
      title: "Manufacturing",
      location: "Sthlm-MF-01, Stockholm",
      date: "Jan 14, 2026",
      status: "VERIFIED",
    },

    {
      id: "shipping",
      title: "Logistics & Shipping",
      location: "FL-STK-01 Road Fleet",
      date: "Feb 02, 2026",
      status: "VERIFIED",
    },

    {
      id: "retail",
      title: "Retail Distribution",
      location: "Hamburg Retail Hub",
      date: "Feb 10, 2026",
      status: "PENDING",
    },

    {
      id: "consumer",
      title: "Consumer Use",
      location: "— — —",
      date: "",
      status: "OPEN",
    },

    {
      id: "eol",
      title: "End of Life",
      location: "— — —",
      date: "",
      status: "OPEN",
    },
  ]);

  const verifiedCount = timeline.filter(
    (item) => item.status === "VERIFIED"
  ).length;

  const progress = Math.round(
    (verifiedCount / timeline.length) * 100
  );

  const loadLifecycle = async () => {
    if (!passportId.trim()) return;
    setLoading(true);
    try {
      const data = await apiFetch<any>(`/auditor/lifecycle/${passportId.trim()}`);
      setLifecycle(data);
      setTimeline(data.timeline || []);
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to load lifecycle review");
    } finally {
      setLoading(false);
    }
  };

  const verifyRetailStage = async () => {
    try {
      const data = await apiFetch<any>(`/auditor/lifecycle/${passportId.trim()}/stages/retail/verify`, {
        method: "POST",
      });
      setLifecycle(data);
      setTimeline(data.timeline || []);
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to verify lifecycle stage");
    }
  };

  return (
    <PageContainer>
    <div className="space-y-5 pb-10">
      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

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

      {/* LOOKUP */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-gray-100 shadow-sm p-5">

        <h2 className="text-[18px] font-bold text-gray-900">
          Garment Lifecycle Lookup
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Search any Digital Product Passport to review its full lifecycle chain
        </p>

        <div className="mt-4 flex gap-3">

          <div className="relative flex-1">

            <SearchOutlinedIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              style={{ fontSize: 20 }}
            />

            <input
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              className="
                w-full h-11 rounded-2xl
                border border-gray-200
                bg-gray-50
                pl-12 pr-4
                text-sm outline-none
                focus:border-[#166534]
                focus:bg-white
                transition-all
              "
            />
          </div>

          <button
            onClick={loadLifecycle}
            className="
              h-11 px-5 rounded-2xl
              bg-[#166534]
              hover:bg-[#14532D]
              text-white text-sm font-bold
              flex items-center gap-2
              shadow-lg shadow-green-900/10
              transition-all
            "
          >
            <SearchOutlinedIcon style={{ fontSize: 18 }} />
            {loading ? "LOADING..." : "LOAD LIFECYCLE"}
          </button>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-gray-100 p-5 shadow-sm">

        <div className="flex justify-between items-center mb-4">

          <p className="text-sm font-bold text-gray-800">
            {lifecycle?.passportId || passportId} - Lifecycle Completeness
          </p>

          <div className="text-right">

            <p className="text-sm font-bold text-[#166534]">
              {verifiedCount}/{timeline.length} stages verified
            </p>

            <p className="text-[22px] font-bold text-[#166534]">
              {progress}%
            </p>

          </div>

        </div>

        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

          <div
            className="
              h-full bg-[#166534]
              rounded-full transition-all duration-500
            "
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      {/* TIMELINE */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">

          <div>

            <h2 className="text-[18px] font-bold text-gray-900">
              Lifecycle Timeline - {lifecycle?.passportId || passportId}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {lifecycle?.manufacturer || "Manufacturer"} · Registered {lifecycle?.registeredDate || "pending"}
            </p>

          </div>

          <button
            className="
              h-10 px-4 rounded-xl
              border border-gray-200
              bg-gray-50
              text-sm font-semibold text-gray-500
              flex items-center gap-2
              hover:bg-gray-100
              transition-all
            "
          >
            <DownloadOutlinedIcon style={{ fontSize: 18 }} />
            Export
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-5">

          {timeline.map((stage, index) => (
            <div
              key={stage.id}
              className="relative pl-14 pb-6 last:pb-0"
            >

              {/* LINE */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-[14px] top-10 w-[2px] h-full bg-gray-200" />
              )}

              {/* ICON */}
              <div
                className={`
                  absolute left-0 top-0
                  w-7 h-7 rounded-full
                  flex items-center justify-center
                  border-[3px] border-white
                  shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                  z-10
                  ${
                    stage.status === "VERIFIED"
                      ? "bg-[#166534] text-white"
                      : stage.status === "PENDING"
                      ? "bg-yellow-400 text-white"
                      : "bg-white text-gray-300 border border-gray-200"
                  }
                `}
              >

                {stage.id === "eol" ? (
                  <ReplayOutlinedIcon style={{ fontSize: 14 }} />
                ) : stage.id === "consumer" ? (
                  <PersonOutlineOutlinedIcon style={{ fontSize: 14 }} />
                ) : stage.id === "retail" ? (
                  <Inventory2OutlinedIcon style={{ fontSize: 14 }} />
                ) : stage.id === "shipping" ? (
                  <LocalShippingOutlinedIcon style={{ fontSize: 14 }} />
                ) : stage.id === "manufacturing" ? (
                  <FactoryOutlinedIcon style={{ fontSize: 14 }} />
                ) : (
                  <EnergySavingsLeafOutlinedIcon style={{ fontSize: 14 }} />
                )}

              </div>

              {/* CARD */}
              <div
                className="
                  border border-gray-200
                  rounded-[22px]
                  px-5 py-4
                  bg-white
                  shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                  hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                  transition-all duration-300
                "
              >

                {/* TOP */}
                <div
                  onClick={() =>
                    setExpanded(
                      expanded === stage.id ? "" : stage.id
                    )
                  }
                  className="flex justify-between items-start cursor-pointer"
                >

                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-[15px] font-bold text-gray-900">
                        {stage.title}
                      </h3>

                      <span
                        className={`
                          px-2 py-1 rounded-md
                          text-[10px] font-bold tracking-wide
                          ${
                            stage.status === "VERIFIED"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : stage.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }
                        `}
                      >
                        {stage.status}
                      </span>

                    </div>

                    <p className="text-[13px] text-gray-400 mt-1">
                      {stage.location}
                      {stage.date && ` · ${stage.date}`}
                    </p>

                  </div>

                  <KeyboardArrowDownOutlinedIcon
                    className={`transition duration-300 ${
                      expanded === stage.id ? "rotate-180" : ""
                    }`}
                  />

                </div>

                {/* EXPANDED */}
                {expanded === stage.id && (
                  <div className="mt-4">

                    {/* DESCRIPTION */}
                    <p className="text-[13px] text-gray-500 leading-relaxed">

                      {stage.id === "raw" &&
                        "GOTS-certified organic cotton. Pesticide-free farming verified by accredited inspector."}

                      {stage.id === "manufacturing" &&
                        "100% renewable energy production. GOTS 6.0 certified facility. Worker wages above EU minimum."}

                      {stage.id === "shipping" &&
                        "Road transport Stockholm → Hamburg. 892 km. Emissions offset via LOOPI Carbon Pool."}

                      {stage.id === "retail" &&
                        "Received by FashForward GmbH. Awaiting auditor sign-off on shelf-life documentation."}

                      {stage.id === "consumer" &&
                        "End-consumer ownership not yet transferred. Passport awaiting retailer sale confirmation."}

                      {stage.id === "eol" &&
                        "Recycling lifecycle not yet initiated. Will be tracked when garment reaches certified recycler."}

                    </p>

                    {/* VERIFIED */}
                    {(stage.id === "raw" ||
                      stage.id === "manufacturing" ||
                      stage.id === "shipping") && (
                      <>
                        <div className="grid grid-cols-2 gap-3 mt-4">

                          <MetricBox
                            green
                            title="CO₂"
                            value={
                              stage.id === "raw"
                                ? "1.1 kg"
                                : stage.id === "manufacturing"
                                ? "3.1 kg"
                                : "0.82 kg"
                            }
                            icon={<EnergySavingsLeafOutlinedIcon style={{ fontSize: 18 }} />}
                          />

                          <MetricBox
                            blue
                            title="WATER"
                            value={
                              stage.id === "raw"
                                ? "5.2 L"
                                : stage.id === "manufacturing"
                                ? "9.3 L"
                                : "0.1 L"
                            }
                            icon={<OpacityOutlinedIcon style={{ fontSize: 18 }} />}
                          />

                        </div>

                        <div className="mt-4 flex items-center gap-2 text-[#166534]">

                          <CheckCircleOutlineOutlinedIcon
                            style={{ fontSize: 16 }}
                          />

                          <p className="text-[13px] font-semibold">
                            Blockchain proof on-chain
                          </p>

                        </div>
                      </>
                    )}

                    {/* RETAIL */}
                    {stage.id === "retail" && (
                      <div className="mt-4">

                        {stage.status === "PENDING" ? (
                          <button
                            onClick={verifyRetailStage}
                            className="
                              h-10 px-4 rounded-xl
                              bg-[#166534]
                              hover:bg-[#14532D]
                              text-white text-xs font-bold
                              inline-flex items-center gap-2
                              shadow-lg shadow-green-900/10
                              transition-all
                            "
                          >
                            <CheckCircleOutlineOutlinedIcon style={{ fontSize: 16 }} />
                            VERIFY THIS STAGE
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-[#166534]">

                            <CheckCircleOutlineOutlinedIcon
                              style={{ fontSize: 16 }}
                            />

                            <p className="text-[13px] font-semibold">
                              Blockchain proof on-chain
                            </p>

                          </div>
                        )}

                      </div>
                    )}

                    {/* OPEN */}
                    {(stage.id === "consumer" ||
                      stage.id === "eol") && (
                      <div className="mt-4 flex items-center gap-2 text-gray-400">

                        <AccessTimeOutlinedIcon
                          style={{ fontSize: 15 }}
                        />

                        <p className="text-[13px] font-semibold">
                          Not yet initiated
                        </p>

                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
    </PageContainer>
  );
}

/* HELPERS */

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
        hover:shadow-md
        transition-all duration-300
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

function MetricBox({
  title,
  value,
  icon,
  green,
}: any) {
  return (
    <div
      className={`
        rounded-2xl border
        px-4 py-3
        flex items-center gap-3
        ${
          green
            ? "bg-green-50 border-green-200"
            : "bg-blue-50 border-blue-200"
        }
      `}
    >

      <div
        className={`
          w-9 h-9 rounded-xl
          flex items-center justify-center
          ${green ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-500"}
        `}
      >
        {icon}
      </div>

      <div>

        <p
          className={`
            text-[10px] font-bold tracking-widest
            ${green ? "text-green-600" : "text-blue-500"}
          `}
        >
          {title}
        </p>

        <p
          className={`
            text-[13px] font-bold
            ${green ? "text-green-700" : "text-blue-600"}
          `}
        >
          {value}
        </p>

      </div>

    </div>
  );
}
