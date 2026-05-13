import { useState } from "react";
import { apiFetch } from "../../../lib/api";
import { downloadJsonFile } from "../../../lib/download";

/* ICONS */
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";

export default function ComplianceCheck() {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [passportId, setPassportId] = useState("GP-9822");
  const [apiError, setApiError] = useState("");
  const [score, setScore] = useState(0);

  const initialChecks = [
    {
      title:
        "EU Digital Product Passport Regulation 2026 conformance",
      category: "Regulatory",
      weight: "Weight: 20%",
      status: "IDLE",
    },

    {
      title:
        "Material composition declaration (≥ 90% declared)",
      category: "Material",
      weight: "Weight: 15%",
      status: "IDLE",
    },

    {
      title:
        "Manufacturing carbon footprint below 5 kg CO₂e / unit",
      category: "Emissions",
      weight: "Weight: 15%",
      status: "IDLE",
    },

    {
      title:
        "GOTS, OEKO-TEX or equivalent sustainability certificate",
      category: "Certificate",
      weight: "Weight: 15%",
      status: "IDLE",
    },

    {
      title:
        "Complete blockchain provenance chain (0 gaps)",
      category: "Blockchain",
      weight: "Weight: 15%",
      status: "IDLE",
    },

    {
      title:
        "Recycling / end-of-life capability rating ≥ Grade B",
      category: "Lifecycle",
      weight: "Weight: 10%",
      status: "IDLE",
    },

    {
      title:
        "Water consumption per unit below 20 L",
      category: "Environment",
      weight: "Weight: 10%",
      status: "IDLE",
    },
  ];

  const [checks, setChecks] = useState(initialChecks);

  /* START / RERUN */
  const startComplianceCheck = async () => {
    if (running) return;

    setStarted(true);
    setRunning(true);
    setApiError("");

    setChecks(
      initialChecks.map((item) => ({
        ...item,
        status: "CHECKING",
      }))
    );

    try {
      const data = await apiFetch<any>("/auditor/compliance-check", {
        method: "POST",
        body: JSON.stringify({ passportId: passportId.trim() }),
      });

      setPassportId(data.passportId || passportId);
      setScore(data.score || 0);
      setChecks(data.checks || initialChecks);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to run compliance check");
      setChecks(initialChecks);
    } finally {
      setRunning(false);
    }
  };

  const passedCount = checks.filter(
    (item) => item.status === "PASS"
  ).length;

  const failedCount = checks.filter(
    (item) => item.status === "FAIL"
  ).length;

  const completedCount = passedCount + failedCount;

  const progress =
    checks.length === 0
      ? 0
      : Math.round(
          ((passedCount + failedCount) / checks.length) * 100
        );

  const fullyCompleted =
    completedCount === checks.length;

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

      {/* BEFORE START */}
      {!started && (
        <div
          className="
            bg-white rounded-[28px]
            border border-gray-100
            shadow-sm
            h-[470px]
            flex items-center justify-center
          "
        >

          <div className="w-full max-w-[420px] text-center">

            <div
              className="
                w-14 h-14 rounded-2xl
                bg-blue-50 border border-blue-100
                flex items-center justify-center
                mx-auto
              "
            >
              <DescriptionOutlinedIcon
                className="text-[#2563EB]"
                style={{ fontSize: 28 }}
              />
            </div>

            <h2 className="mt-7 text-[25px] leading-tight font-bold text-[#111827]">
              Compliance Check Console
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-gray-400 px-6">
              Automated compliance verification against{" "}
              <span className="font-semibold text-[#166534]">
                EU-DPP Regulation 2026
              </span>{" "}
              and international sustainability standards.
            </p>

            <div className="mt-8">

              <input
                value={passportId}
                onChange={(event) => setPassportId(event.target.value)}
                className="
                  w-full h-12
                  rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  px-5
                  text-sm font-semibold
                  outline-none
                  focus:border-[#166534]
                  focus:bg-white
                "
              />

            </div>

            <button
              onClick={startComplianceCheck}
              className="
                mt-6 w-full h-12
                rounded-2xl
                bg-[#166534]
                hover:bg-[#14532D]
                text-white
                font-bold text-[14px]
                tracking-wide
                flex items-center justify-center gap-3
                shadow-[0_12px_30px_rgba(22,101,52,0.18)]
              "
            >
              <PlayArrowRoundedIcon style={{ fontSize: 24 }} />
              START AUTOMATED CHECK
            </button>

            <p className="mt-6 text-[11px] tracking-[2px] text-gray-300 font-bold">
              7 RULES · 3 CATEGORIES
            </p>

          </div>

        </div>
      )}

      {/* AFTER START */}
      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

      {/* AFTER START */}
      {started && (
        <>
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-10 h-10 rounded-xl
                    bg-blue-50
                    border border-blue-100
                    flex items-center justify-center
                  "
                >
                  <DescriptionOutlinedIcon
                    className="text-[#2563EB]"
                    style={{ fontSize: 20 }}
                  />
                </div>

                <div>

                  <h2 className="text-[18px] font-bold text-gray-900">
                    Compliance Check —
                    <span className="text-[#166534] ml-1">
                      {passportId}
                    </span>
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {fullyCompleted
                      ? `${passedCount} passed · ${failedCount} failed`
                      : "Running automated verification..."}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              {fullyCompleted && (
                <div className="flex items-center gap-3">

                  <button
                    onClick={startComplianceCheck}
                    className="
                      h-10 px-4 rounded-xl
                      border border-gray-200
                      bg-gray-50
                      text-sm font-semibold text-gray-500
                      flex items-center gap-2
                    "
                  >
                    <AutorenewOutlinedIcon style={{ fontSize: 18 }} />
                    Re-run
                  </button>

                  <button
                    onClick={() => downloadJsonFile(`${passportId}-compliance-check.json`, { passportId, score, checks })}
                    className="
                      h-10 px-4 rounded-xl
                      bg-[#166534]
                      hover:bg-[#14532D]
                      text-white text-sm font-bold
                      flex items-center gap-2
                    "
                  >
                    <DownloadOutlinedIcon style={{ fontSize: 18 }} />
                    EXPORT
                  </button>

                </div>
              )}

            </div>

            {/* SCORE */}
            {started && (
              <div className="px-5 pt-5">

                <div className="flex items-center justify-between mb-3">

                  <p className="text-[11px] tracking-[2px] text-gray-400 font-bold">
                    COMPLIANCE SCORE
                  </p>

                  <div className="flex items-center gap-3">

                    <span className="text-sm font-bold text-[#166534]">
                      {fullyCompleted ? score : progress}%
                    </span>

                    <span
                      className="
                        px-3 py-1 rounded-full
                        bg-green-50 border border-green-200
                        text-green-600
                        text-xs font-bold
                      "
                    >
                      {passedCount} Passed
                    </span>

                    <span
                      className="
                        px-3 py-1 rounded-full
                        bg-red-50 border border-red-200
                        text-red-500
                        text-xs font-bold
                      "
                    >
                      {failedCount} Failed
                    </span>

                  </div>

                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className={`
                      h-full rounded-full transition-all duration-500
                      ${
                        failedCount > 0 && fullyCompleted
                          ? "bg-red-500"
                          : "bg-[#166534]"
                      }
                    `}
                    style={{ width: `${progress}%` }}
                  />

                </div>

              </div>
            )}

            {/* CHECKS */}
            <div className="p-5 space-y-3">

              {checks.map((item, index) => (
                <CheckCard
                  key={index}
                  item={item}
                />
              ))}

            </div>

          </div>

          {/* ACTION REQUIRED */}
          {fullyCompleted && failedCount > 0 && (
            <div
              className="
                rounded-[24px]
                border border-red-200
                bg-red-50/70
                p-6
              "
            >

              <div className="flex items-start gap-4">

                <div className="text-red-500 mt-1">
                  <ErrorOutlineOutlinedIcon style={{ fontSize: 22 }} />
                </div>

                <div className="flex-1">

                  <h2 className="text-[18px] font-bold text-red-600">
                    Action Required
                  </h2>

                  <p className="mt-2 text-sm text-red-500 leading-7">

                    1 rule failed:
                    <span className="font-semibold">
                      {" "}
                      Recycling / end-of-life capability rating ≥ Grade B.
                    </span>{" "}

                    The manufacturer must submit an updated
                    Material Recyclability Declaration before this
                    passport can receive full compliance status.

                  </p>

                  <button
                    className="
                      mt-5 h-11 px-5 rounded-xl
                      bg-red-500 hover:bg-red-600
                      text-white text-sm font-bold
                      inline-flex items-center gap-2
                    "
                  >
                    <BoltOutlinedIcon style={{ fontSize: 18 }} />
                    NOTIFY MANUFACTURER
                  </button>

                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}

/* CHECK CARD */

function CheckCard({ item }: any) {
  return (
    <div
      className={`
        rounded-[18px]
        border
        px-5 py-4
        flex items-center justify-between
        transition-all duration-500
        ${
          item.status === "PASS"
            ? "bg-green-50/70 border-green-100"
            : item.status === "FAIL"
            ? "bg-red-50/70 border-red-100"
            : item.status === "CHECKING"
            ? "bg-blue-50/70 border-blue-100"
            : "bg-gray-50 border-gray-100"
        }
      `}
    >

      <div className="flex items-start gap-4">

        <div
          className={`
            mt-1
            ${
              item.status === "PASS"
                ? "text-green-500"
                : item.status === "FAIL"
                ? "text-red-500"
                : item.status === "CHECKING"
                ? "text-blue-500"
                : "text-gray-300"
            }
          `}
        >

          {item.status === "PASS" ? (
            <CheckCircleOutlineOutlinedIcon
              style={{ fontSize: 20 }}
            />
          ) : item.status === "FAIL" ? (
            <HighlightOffOutlinedIcon
              style={{ fontSize: 20 }}
            />
          ) : item.status === "CHECKING" ? (
            <HourglassTopRoundedIcon
              className="animate-spin"
              style={{ fontSize: 20 }}
            />
          ) : (
            <div className="w-[18px] h-[18px] rounded-full border border-gray-300" />
          )}

        </div>

        <div>

          <h3
            className={`
              text-[14px] font-bold
              ${
                item.status === "PASS"
                  ? "text-[#166534]"
                  : item.status === "FAIL"
                  ? "text-red-600"
                  : item.status === "CHECKING"
                  ? "text-[#2563EB]"
                  : "text-gray-400"
              }
            `}
          >
            {item.title}
          </h3>

          <div className="flex items-center gap-5 mt-1">

            <p className="text-[11px] text-gray-400">
              {item.category}
            </p>

            <p className="text-[11px] text-gray-400">
              {item.weight}
            </p>

          </div>

        </div>

      </div>

      {item.status !== "IDLE" && (
        <span
          className={`
            px-3 py-1 rounded-md
            text-[10px] font-bold tracking-wide
            ${
              item.status === "PASS"
                ? "bg-green-100 text-green-600"
                : item.status === "FAIL"
                ? "bg-red-100 text-red-500"
                : "bg-blue-100 text-blue-500"
            }
          `}
        >
          {item.status === "CHECKING"
            ? "CHECKING..."
            : item.status}
        </span>
      )}

    </div>
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
