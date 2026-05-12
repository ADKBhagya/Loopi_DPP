import { useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ModalPortal from "../../../components/modals/ModalPortal";

export default function PublicRecords() {
  const [openExplorer, setOpenExplorer] =
    useState(false);

  const [selectedRecord, setSelectedRecord] =
    useState<any>(null);

  const records = [
    {
      id: "GP-9822",
      type: "GOLD SEAL",
      garment: "Premium Cotton Hoodie",
      factory: "FCA Compliance",
      country: "Germany",
      date: "2026-03-19",
      status: "PUBLIC VERIFIED",
      color: "#16A34A",
    },
    {
      id: "GP-9821",
      type: "SILVER SEAL",
      garment: "Organic Sports Tee",
      factory: "Nordic Textile Lab",
      country: "Sweden",
      date: "2026-03-16",
      status: "PUBLIC VERIFIED",
      color: "#94A3B8",
    },
    {
      id: "GP-4770",
      type: "BRONZE SEAL",
      garment: "Eco Denim",
      factory: "EU Textile Group",
      country: "France",
      date: "2026-03-14",
      status: "UNDER REVIEW",
      color: "#D97706",
    },
    {
      id: "GP-4716",
      type: "GOLD SEAL",
      garment: "Recycled Jacket",
      factory: "Berlin Fabric Labs",
      country: "Germany",
      date: "2026-03-11",
      status: "PUBLIC VERIFIED",
      color: "#16A34A",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="space-y-6">
        
        {/* HERO */}
        <div className="bg-white border border-gray-100 rounded-[28px] h-[430px] shadow-sm flex items-center justify-center relative overflow-hidden">
        

          <div className="text-center relative z-10">
            
            <div className="w-[64px] h-[64px] rounded-[18px] bg-[#EEF4FF] border border-[#DCE7FF] flex items-center justify-center mx-auto shadow-sm">
              
              <Inventory2OutlinedIcon
                style={{
                  fontSize: 28,
                  color: "#2563EB",
                }}
              />
            </div>

            <h1 className="text-[30px] font-black text-gray-900 mt-7">
              Public Records Explorer
            </h1>

            <p className="text-[16px] text-gray-500 mt-4 leading-relaxed max-w-[620px]">
              Access publicly shared product
              sustainability records and
              verification data from LOOPI
              ecosystem.
            </p>

            <button
              onClick={() =>
                setOpenExplorer(true)
              }
              className="mt-8 h-[52px] px-9 rounded-[18px] bg-[#16641E] text-white text-[12px] font-black tracking-[0.16em] shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-all"
            >
              CONNECT AUTHORITY NODE
            </button>

            <p className="mt-7 text-[10px] font-bold tracking-[0.24em] text-gray-300">
              VERIFIED PUBLIC BLOCKCHAIN ACCESS
            </p>
          </div>
        </div>
      </div>

      {/* EXPLORER */}
      {openExplorer && (
        <ModalPortal>
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[3px]">
          
          {/* LEFT PANEL */}
          <div className="absolute right-0 top-0 w-[620px] h-screen bg-[#F7F8FA] shadow-2xl">
            
            {/* HEADER */}
            <div className="h-[82px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                
                <div className="w-11 h-11 rounded-2xl bg-[#16641E] text-white flex items-center justify-center shadow-sm">
                  
                  <PublicRoundedIcon />
                </div>

                <div>
                  <h2 className="text-[20px] font-black text-gray-900">
                    Public Records Explorer
                  </h2>

                  <p className="text-[12px] text-gray-400 mt-1">
                    Open sustainability blockchain
                    records
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenExplorer(false);
                  setSelectedRecord(null);
                }}
                className="text-gray-400 hover:text-gray-700 transition-all"
              >
                <CloseRoundedIcon />
              </button>
            </div>

            {/* SEARCH */}
            <div className="p-5 border-b border-gray-100 bg-white">
              
              <div className="relative">
                
                <SearchOutlinedIcon
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    fontSize: 18,
                    color: "#9CA3AF",
                  }}
                />

                <input
                  placeholder="Search garment passport..."
                  className="w-full h-[48px] rounded-2xl border border-gray-200 bg-[#F9FAFB] pl-11 pr-4 text-sm outline-none focus:border-[#16641E]"
                />
              </div>

              {/* FILTERS */}
              <div className="flex items-center gap-2 mt-4">
                
                <FilterButton active label="All" />
                <FilterButton label="Gold" />
                <FilterButton label="Silver" />
                <FilterButton label="Bronze" />
              </div>
            </div>

            {/* RECORDS */}
            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-180px)]">
              
              {records.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedRecord(item)
                  }
                  className={`w-full text-left bg-white border rounded-[20px] p-5 transition-all hover:shadow-md ${
                    selectedRecord?.id ===
                    item.id
                      ? "border-[#16641E] shadow-md"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    
                    <div>
                      
                      <div className="flex items-center gap-3">
                        
                        <p className="font-black text-gray-900 text-[15px]">
                          {item.id}
                        </p>

                        <span
                          className="px-2 py-1 rounded-lg text-[9px] font-black tracking-[0.14em] text-white"
                          style={{
                            background: item.color,
                          }}
                        >
                          {item.type}
                        </span>
                      </div>

                      <p className="text-[13px] text-gray-500 mt-2">
                        {item.garment}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        
                        <CheckCircleRoundedIcon
                          style={{
                            fontSize: 16,
                            color:
                              item.status ===
                              "PUBLIC VERIFIED"
                                ? "#16A34A"
                                : "#D97706",
                          }}
                        />

                        <p
                          className={`text-[10px] font-black tracking-[0.14em] ${
                            item.status ===
                            "PUBLIC VERIFIED"
                              ? "text-[#16A34A]"
                              : "text-[#D97706]"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>

                    <OpenInNewRoundedIcon
                      style={{
                        fontSize: 18,
                        color: "#D1D5DB",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS PANEL */}
          {selectedRecord && (
            <div className="absolute right-[620px] top-0 w-[420px] h-screen bg-white border-r border-gray-200 shadow-2xl">
              
              {/* HEADER */}
              <div className="h-[82px] border-b border-gray-100 px-6 flex items-center">
                
                <div>
                  <h2 className="text-[20px] font-black text-gray-900">
                    Public Record Details
                  </h2>

                  <p className="text-[12px] text-gray-400 mt-1">
                    Immutable blockchain entry
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                
                {/* STATUS */}
                <div className="rounded-[22px] border border-green-100 bg-green-50 p-5">
                  
                  <div className="flex items-center gap-3">
                    
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      
                      <WorkspacePremiumRoundedIcon
                        style={{
                          color: "#16A34A",
                          fontSize: 30,
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-green-600">
                        PUBLIC RECORD STATUS
                      </p>

                      <h2 className="text-[24px] font-black text-gray-900 mt-1">
                        {selectedRecord.type}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* INFO */}
                <div className="mt-5 space-y-4">
                  
                  <InfoRow
                    label="Passport ID"
                    value={selectedRecord.id}
                  />

                  <InfoRow
                    label="Garment"
                    value={selectedRecord.garment}
                  />

                  <InfoRow
                    label="Factory"
                    value={selectedRecord.factory}
                  />

                  <InfoRow
                    label="Country"
                    value={selectedRecord.country}
                  />

                  <InfoRow
                    label="Audit Date"
                    value={selectedRecord.date}
                  />

                  <InfoRow
                    label="Verification"
                    value="EU VERIFIED"
                  />
                </div>

                {/* HASH */}
                <div className="mt-6 rounded-[18px] border border-gray-100 bg-[#F9FAFB] p-4">
                  
                  <p className="text-[10px] font-black tracking-[0.18em] text-gray-400">
                    BLOCKCHAIN HASH
                  </p>

                  <p className="mt-3 text-[13px] font-bold text-gray-700 break-all">
                    0x98a2_77bc_44fa_9901_cc77_efaa
                  </p>
                </div>

                {/* ACTION */}
                <button className="mt-7 w-full h-[54px] rounded-[18px] bg-[#16641E] text-white text-[12px] font-black tracking-[0.16em] shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 hover:bg-[#0F4E16] transition-all">
                  
                  <DownloadRoundedIcon
                    style={{ fontSize: 18 }}
                  />

                  DOWNLOAD RECORD
                </button>

                {/* VERIFIED */}
                <div className="mt-6 flex items-center gap-3 rounded-[18px] border border-gray-100 bg-[#FAFAFA] p-4">
                  
                  <VerifiedRoundedIcon
                    style={{
                      color: "#16A34A",
                    }}
                  />

                  <p className="text-[12px] font-bold text-gray-600">
                    This record has been publicly
                    verified and anchored on-chain.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        </ModalPortal>
      )}
    </div>
  );
}

/* FILTER */

function FilterButton({
  label,
  active,
}: any) {
  return (
    <button
      className={`h-[34px] px-4 rounded-xl text-[11px] font-black tracking-[0.12em] transition-all ${
        active
          ? "bg-[#111827] text-white"
          : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

/* INFO */

function InfoRow({
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      
      <p className="text-[12px] font-bold text-gray-400">
        {label}
      </p>

      <p className="text-[13px] font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}
