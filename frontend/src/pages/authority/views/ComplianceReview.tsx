import { useState } from "react";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export default function ComplianceReview() {
  const [expandedStage, setExpandedStage] =
    useState<string | null>(null);

  const pipelineData = [
    {
      label: "Submitted by Auditor",
      value: 22,
      width: "100%",
      color: "#98A2B3",
      icon: (
        <DescriptionOutlinedIcon
          style={{ fontSize: 15 }}
        />
      ),
      description:
        "22 compliance records submitted by certified auditors awaiting initial authority triage.",
    },
    {
      label: "Authority Initial Review",
      value: 18,
      width: "82%",
      color: "#3478F6",
      icon: (
        <VisibilityOutlinedIcon
          style={{ fontSize: 15 }}
        />
      ),
      description:
        "18 records assigned to authority officers for initial documentation and blockchain proof check.",
    },
    {
      label: "Deep Verification",
      value: 11,
      width: "50%",
      color: "#F59E0B",
      icon: (
        <SearchOutlinedIcon
          style={{ fontSize: 15 }}
        />
      ),
      description:
        "11 records undergoing deep verification — AI-assisted cross-check against EU-DPP standards.",
    },
    {
      label: "Final Authority Sign-off",
      value: 6,
      width: "28%",
      color: "#16641E",
      icon: (
        <CheckCircleOutlineOutlinedIcon
          style={{ fontSize: 15 }}
        />
      ),
      description:
        "6 records awaiting final authority officer signature and gold seal issuance.",
    },
    {
      label: "Gold Seal Issued",
      value: 4,
      width: "18%",
      color: "#0BAA43",
      icon: (
        <PublicOutlinedIcon
          style={{ fontSize: 15 }}
        />
      ),
      description:
        "4 records received gold seal this month — immutable on-chain.",
    },
  ];

  const regions = [
    {
      region: "EU-NORTH",
      records: "1204 records",
      percentage: "99.1%",
      width: "99%",
    },
    {
      region: "EU-WEST",
      records: "1892 records",
      percentage: "98.4%",
      width: "98%",
    },
    {
      region: "EU-SOUTH",
      records: "988 records",
      percentage: "97.8%",
      width: "97%",
    },
    {
      region: "EU-EAST",
      records: "728 records",
      percentage: "96.5%",
      width: "96%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="space-y-6">
        
        {/* PIPELINE CARD */}
        <div className="mt-3 bg-white border border-gray-100 rounded-[22px] p-5 shadow-sm">
          
          {/* HEADER */}
          <div className="flex items-start justify-between">
            
            <div>
              <h2 className="text-[22px] font-bold text-gray-900">
                Compliance Approval Pipeline
              </h2>

              <p className="text-[12px] text-gray-400 mt-1">
                Live flow of compliance records
                across all authority stages
              </p>
            </div>

            <button className="h-[38px] px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[11px] font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-100 transition-all">
              
              <DownloadOutlinedIcon
                style={{ fontSize: 16 }}
              />

              Export
            </button>
          </div>

          {/* PIPELINES */}
          <div className="mt-8 space-y-5">
            {pipelineData.map((item, index) => {
              const isExpanded =
                expandedStage === item.label;

              return (
                <div key={index}>
                  
                  {/* ROW */}
                  <div className="flex items-start gap-3">
                    
                    {/* ICON */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                      style={{
                        background: item.color,
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      
                      {/* TOP */}
                      <div className="flex items-center justify-between">
                        
                        <p className="text-[13px] font-bold text-gray-900">
                          {item.label}
                        </p>

                        <div className="flex items-center gap-4">
                          
                          <p className="text-[13px] font-black text-gray-700">
                            {item.value}
                          </p>

                          <button
                            onClick={() =>
                              setExpandedStage(
                                isExpanded
                                  ? null
                                  : item.label
                              )
                            }
                            className="text-gray-300 hover:text-gray-500 transition-all"
                          >
                            {isExpanded
                              ? "⌃"
                              : "⌄"}
                          </button>
                        </div>
                      </div>

                      {/* BAR */}
                      <div className="mt-3 w-full h-[7px] rounded-full bg-[#ECEEF2] overflow-hidden">
                        
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: item.width,
                            background:
                              item.color,
                          }}
                        />
                      </div>

                      {/* EXPANDED */}
                      {isExpanded && (
                        <div className="mt-4 ml-10 bg-[#F8F9FB] border border-gray-100 rounded-[12px] p-4">
                          
                          <p className="text-[12px] text-gray-500 leading-relaxed">
                            {item.description}
                          </p>

                          <button className="mt-4 h-[30px] px-3 rounded-lg border border-gray-200 bg-white text-[10px] font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
                            
                            <VisibilityOutlinedIcon
                              style={{
                                fontSize: 13,
                              }}
                            />

                            View Records
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-[1.1fr_1fr] gap-4 mt-5">
          
          {/* LEFT */}
          <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
            
            <h2 className="text-[20px] font-bold text-gray-900">
              Regional Compliance Rates
            </h2>

            <div className="mt-7 space-y-6">
              {regions.map((item, index) => (
                <div key={index}>
                  
                  <div className="flex items-center justify-between mb-2">
                    
                    <div className="flex items-center gap-2">
                      
                      <PublicOutlinedIcon
                        style={{
                          fontSize: 15,
                          color: "#9CA3AF",
                        }}
                      />

                      <p className="text-[12px] font-bold text-gray-800">
                        {item.region}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      
                      <p className="text-[11px] text-gray-400">
                        {item.records}
                      </p>

                      <p className="text-[11px] font-bold text-[#16641E]">
                        {item.percentage}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[6px] rounded-full bg-[#EEF0F2] overflow-hidden">
                    
                    <div
                      className="h-full rounded-full bg-[#16641E]"
                      style={{
                        width: item.width,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-[#16641E] rounded-[20px] p-5 shadow-xl shadow-green-900/10 text-white">
            
            <p className="text-[10px] font-bold tracking-[0.16em] text-green-100">
              MONTHLY SUMMARY
            </p>

            <h1 className="text-[25px] font-black mt-2">
              128 Seals
            </h1>

            <p className="text-[13px] text-green-100 mt-1">
              Issued this month across all EU
              authority nodes
            </p>

            {/* METRICS */}
            <div className="mt-8 space-y-5">
              
              <SummaryBar
                label="Gold Seals"
                value="82"
                width="100%"
                color="#EAB308"
              />

              <SummaryBar
                label="Silver Seals"
                value="31"
                width="48%"
                color="#D1D5DB"
              />

              <SummaryBar
                label="Bronze Seals"
                value="15"
                width="24%"
                color="#EA580C"
              />
            </div>

            {/* DOWNLOAD */}
            <button className="mt-8 h-[42px] px-5 rounded-xl bg-white/10 border border-white/10 text-[11px] font-bold tracking-[0.14em] text-white hover:bg-white/20 transition-all flex items-center gap-2">
              
              <DownloadOutlinedIcon
                style={{ fontSize: 16 }}
              />

              DOWNLOAD REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SUMMARY BAR ================= */

function SummaryBar({
  label,
  value,
  width,
  color,
}: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        
        <p className="text-[11px] font-bold text-white">
          {label}
        </p>

        <p className="text-[11px] font-bold text-white">
          {value}
        </p>
      </div>

      <div className="w-full h-[5px] rounded-full bg-white/15 overflow-hidden">
        
        <div
          className="h-full rounded-full"
          style={{
            width,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
