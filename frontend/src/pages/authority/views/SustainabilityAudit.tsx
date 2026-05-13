import { useState } from "react";
import { apiFetch } from "../../../lib/api";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ModalPortal from "../../../components/modals/ModalPortal";

export default function SustainabilityAudit() {
  const [openTerminal, setOpenTerminal] = useState(false);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [auditPassport, setAuditPassport] = useState("GP-9822");
  const [auditScore, setAuditScore] = useState(0);
  const [apiError, setApiError] = useState("");

  const [logs, setLogs] = useState<string[]>([
    "> LOOPI Authority Audit Terminal v2.4.1",
  ]);

  const [auditItems, setAuditItems] = useState([
    {
      name: "Carbon Footprint Verification",
      weight: "25%",
      status: "idle",
    },
    {
      name: "Material Supply Chain Traceability",
      weight: "20%",
      status: "idle",
    },
    {
      name: "Water Usage Lifecycle Assessment",
      weight: "15%",
      status: "idle",
    },
    {
      name: "Recycling End-of-Life Score",
      weight: "15%",
      status: "idle",
    },
    {
      name: "Worker Welfare Standards (ILO)",
      weight: "15%",
      status: "idle",
    },
    {
      name: "EU-DPP Regulatory Alignment",
      weight: "10%",
      status: "idle",
    },
  ]);

  const resetAudit = () => {
    setCompleted(false);
    setRunning(false);

    setLogs([
      "> LOOPI Authority Audit Terminal v2.4.1",
    ]);

    setAuditItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: "idle",
      }))
    );
  };

  const runAudit = async () => {
    if (running) return;
    if (!auditPassport.trim()) {
      setApiError("Enter a passport ID before running an audit");
      return;
    }

    setRunning(true);
    setCompleted(false);
    setApiError("");
    setLogs([
      "> LOOPI Authority Audit Terminal v2.4.1",
    ]);

    const reset = auditItems.map((i) => ({
      ...i,
      status: "idle",
    }));

    setAuditItems(reset);

    try {
      const data = await apiFetch<any>("/authority/sustainability-audit/run", {
        method: "POST",
        body: JSON.stringify({ passportId: auditPassport.trim() }),
      });

      setAuditItems(data.items || []);
      setLogs(data.logs || []);
      setAuditScore(data.score || 0);
      setCompleted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to run sustainability audit";
      setApiError(message);
      setLogs((prev) => [...prev, `[ERROR] ${message}`]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="space-y-6">
        {apiError && (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-bold text-[#B91C1C]">
            {apiError}
          </div>
        )}
        
        {/* HERO */}
        <div className="bg-white border border-gray-100 rounded-[28px] h-[450px] shadow-sm relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            
            <div className="w-[60px] h-[60px] rounded-[15px] bg-[#FFF7E8] border border-[#FFE2A8] flex items-center justify-center mx-auto">
              <SearchOutlinedIcon
                style={{
                  fontSize: 35,
                  color: "#F59E0B",
                }}
              />
            </div>

            <h1 className="text-[22px] font-black text-gray-900 mt-8">
              Sustainability Audit Engine
            </h1>

            <p className="text-[17px] text-gray-500 mt-5 leading-relaxed max-w-[720px]">
              Perform deep-dive sustainability audits
              across the{" "}
              <span className="font-bold text-[#16641E]">
                entire
              </span>{" "}
              product lifecycle using{" "}
              <span className="font-bold text-[#2563EB]">
                AI-assisted
              </span>{" "}
              verification.
            </p>

            <button
              onClick={() => setOpenTerminal(true)}
              className="mt-10 h-[50px] px-10 rounded-[20px] bg-[#F59E0B] text-white text-[13px] font-black tracking-[0.16em] shadow-xl shadow-orange-200 hover:scale-[1.02] transition-all"
            >
              LAUNCH AUDIT TERMINAL
            </button>

            <p className="mt-8 text-[11px] font-bold tracking-[0.24em] text-gray-300">
              6 CATEGORIES · AI-ASSISTED ·
              BLOCKCHAIN-ANCHORED
            </p>
          </div>
        </div>
      </div>

      {/* TERMINAL */}
      {openTerminal && (
        <ModalPortal>
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[3px]">
          
          {/* PANEL */}
          <div className="absolute right-0 top-0 w-[590px] h-screen bg-[#F7F8FA] shadow-2xl">
            
            {/* HEADER */}
            <div className="h-[82px] border-b border-gray-200 bg-white px-6 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center">
                  <AutorenewRoundedIcon />
                </div>

                <div>
                  <h2 className="text-[22px] font-black text-gray-900">
                    Sustainability Audit Terminal
                  </h2>

                  <p className="text-[12px] text-gray-400 mt-1">
                    AI-assisted · EU Authority Grade
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setOpenTerminal(false)
                }
                className="text-gray-400 hover:text-gray-700"
              >
                <CloseRoundedIcon />
              </button>
            </div>

            {/* BODY */}
            <div className="p-5">
              
              {/* SEARCH */}
              <div className="flex items-center gap-3">
                
                <div className="flex-1 h-[50px] rounded-2xl border border-gray-200 bg-white flex items-center px-4">
                  <span className="text-gray-300 mr-3">
                    #
                  </span>

                  <input
                    value={auditPassport}
                    onChange={(event) => setAuditPassport(event.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm font-bold"
                  />
                </div>

                {!running && !completed && (
                  <button
                    onClick={runAudit}
                    className="h-[50px] px-6 rounded-2xl bg-[#F59E0B] text-white font-black text-[12px] tracking-[0.14em] flex items-center gap-2"
                  >
                    <PlayArrowRoundedIcon />
                    RUN
                  </button>
                )}

                {running && (
                  <button className="h-[50px] px-6 rounded-2xl border border-orange-200 bg-orange-50 text-[#F59E0B] font-black text-[12px] tracking-[0.14em] flex items-center gap-2">
                    <AutorenewRoundedIcon className="animate-spin" />
                    Running
                  </button>
                )}

                {completed && (
                  <button
                    onClick={resetAudit}
                    className="h-[50px] px-6 rounded-2xl border border-gray-200 bg-white text-gray-700 font-black text-[12px] tracking-[0.14em] flex items-center gap-2 hover:bg-gray-50"
                  >
                    <AutorenewRoundedIcon />
                    RESET
                  </button>
                )}
              </div>

              {/* SCORE */}
              {completed && (
                <div className="mt-5 bg-[#FFF9EC] border border-[#F2DFB0] rounded-[22px] p-5">
                  <div className="flex items-center justify-between">
                    
                    <div className="flex items-center gap-4">
                      
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE7B5] flex items-center justify-center">
                        <WorkspacePremiumRoundedIcon
                          style={{
                            color: "#F59E0B",
                            fontSize: 23,
                          }}
                        />
                      </div>

                      <div>
                        <h2 className="text-[17px] font-black text-gray-900">
                          Audit Score: {auditScore}/100
                        </h2>

                        <div className="mt-3 w-[320px] h-[8px] rounded-full bg-[#E5E7EB] overflow-hidden">
                          <div
                            className="h-full bg-[#F59E0B] rounded-full"
                            style={{ width: `${auditScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button className="h-[42px] px-4 rounded-xl border border-gray-200 bg-white text-[11px] font-black tracking-[0.14em] text-gray-600 flex items-center gap-2">
                      <DownloadRoundedIcon
                        style={{ fontSize: 16 }}
                      />
                      PDF
                    </button>
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              <div className="mt-5 bg-white border border-gray-100 rounded-[24px] overflow-hidden">
                
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-[11px] font-black tracking-[0.18em] text-gray-400">
                    AUDIT CATEGORIES
                  </p>
                </div>

                {auditItems.map((item, index) => (
                  <div
                    key={index}
                    className={`px-5 py-5 border-b border-gray-100 flex items-center justify-between transition-all ${
                      item.status === "pass"
                        ? "bg-green-50 border-l-[3px] border-l-[#22C55E]"
                        : item.status === "warning"
                        ? "bg-[#FFF8E8] border-l-[3px] border-l-[#F59E0B]"
                        : item.status === "running"
                        ? "bg-blue-50 border-l-[3px] border-l-[#3478F6]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      
                      {/* ICON */}
                      {item.status === "pass" && (
                        <CheckCircleRoundedIcon
                          style={{
                            color: "#22C55E",
                            fontSize: 18,
                          }}
                        />
                      )}

                      {item.status === "warning" && (
                        <WarningAmberRoundedIcon
                          style={{
                            color: "#F59E0B",
                            fontSize: 18,
                          }}
                        />
                      )}

                      {item.status === "running" && (
                        <AutorenewRoundedIcon
                          className="animate-spin"
                          style={{
                            color: "#3478F6",
                            fontSize: 18,
                          }}
                        />
                      )}

                      {item.status === "idle" && (
                        <div className="w-[16px] h-[16px] rounded-full border border-gray-300" />
                      )}

                      <div>
                        <h3
                          className={`text-[13px] font-black ${
                            item.status === "running"
                              ? "text-[#3478F6]"
                              : item.status === "warning"
                              ? "text-[#B45309]"
                              : "text-gray-800"
                          }`}
                        >
                          {item.name}
                        </h3>

                        <p className="text-[12px] text-gray-400 mt-1">
                          Weight: {item.weight}
                        </p>
                      </div>
                    </div>

                    {/* BADGE */}
                    {item.status === "pass" && (
                      <div className="px-3 py-1 rounded-lg bg-green-100 text-[#16A34A] text-[10px] font-black tracking-[0.12em]">
                        PASS
                      </div>
                    )}

                    {item.status === "warning" && (
                      <div className="px-3 py-1 rounded-lg bg-orange-100 text-[#D97706] text-[10px] font-black tracking-[0.12em]">
                        WARNING
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* TERMINAL LOGS */}
              <div className="mt-5 bg-[#081226] rounded-[20px] p-5 h-[260px] overflow-y-auto border border-[#12203B]">
                <pre className="text-[12px] leading-7 font-mono whitespace-pre-wrap text-[#E2E8F0]">
                  {logs.map((log, i) => {
                    let color = "#E2E8F0";

                    if (log.includes("PASSED"))
                      color = "#22C55E";

                    if (log.includes("WARNING"))
                      color = "#F59E0B";

                    if (log.includes("Checking"))
                      color = "#60A5FA";

                    return (
                      <div
                        key={i}
                        style={{
                          color,
                        }}
                      >
                        {log}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}

