import { useMemo, useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

/* MODAL ICONS */
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";

export default function AuthorityControl() {
  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [selectedClaim, setSelectedClaim] =
    useState<any>(null);

  const complianceData = [
    {
      id: "COMP-8812",
      garment: "GP-9821",
      auditor: "EcoChain Auditor #9",
      date: "2026-03-20",
      type: "Sustainability Claim",
      region: "EU-NORTH",
      status: "AUDITOR APPROVED",
      statusColor: "blue",
      hash: "0x98c1_F221",
    },
    {
      id: "COMP-8813",
      garment: "GP-9822",
      auditor: "Sthlm Audit Lab",
      date: "2026-03-21",
      type: "Material Verification",
      region: "EU-WEST",
      status: "UNDER REVIEW",
      statusColor: "orange",
      hash: "0x3d4b_9A01",
    },
    {
      id: "COMP-8814",
      garment: "GP-9811",
      auditor: "Global Trust Auditor",
      date: "2026-03-15",
      type: "Full Compliance",
      region: "EU-SOUTH",
      status: "FINAL APPROVED",
      statusColor: "green",
      hash: "0x77fa_B430",
    },
    {
      id: "COMP-8815",
      garment: "GP-9877",
      auditor: "EcoWeave NL Auditors",
      date: "2026-03-22",
      type: "Lifecycle Assessment",
      region: "EU-WEST",
      status: "AUDITOR APPROVED",
      statusColor: "blue",
      hash: "0xC1e0_4421",
    },
    {
      id: "COMP-8816",
      garment: "GP-9890",
      auditor: "Berlin Compliance Hub",
      date: "2026-03-23",
      type: "Certificate Verify",
      region: "EU-EAST",
      status: "UNDER REVIEW",
      statusColor: "orange",
      hash: "0xA9b3_22F0",
    },
  ];

  /* FILTER LOGIC */
  const filteredData = useMemo(() => {
    if (activeFilter === "ALL")
      return complianceData;

    return complianceData.filter(
      (item) => item.status === activeFilter
    );
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="space-y-6">
        
        {/* STATS */}
        <div className="grid grid-cols-4 gap-5">
          
          <StatsCard
            title="TOTAL PASSPORTS ISSUED"
            value="4,812"
            icon={
              <ShieldOutlinedIcon
                style={{ fontSize: 30 }}
              />
            }
            color="green"
          />

          <StatsCard
            title="ACTIVE MANUFACTURERS"
            value="124"
            icon={
              <GroupsOutlinedIcon
                style={{ fontSize: 30 }}
              />
            }
            color="blue"
          />

          <StatsCard
            title="PENDING APPROVAL"
            value="18"
            icon={
              <AccessTimeOutlinedIcon
                style={{ fontSize: 30 }}
              />
            }
            color="orange"
          />

          <StatsCard
            title="COMPLIANCE RATE"
            value="98.2%"
            icon={
              <BarChartOutlinedIcon
                style={{ fontSize: 30 }}
              />
            }
            color="emerald"
          />
        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-[26px] border border-gray-100 overflow-hidden shadow-sm">
          
          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
            
            <div>
              <h2 className="text-[26px] font-bold text-gray-900">
                Final Compliance Oversight
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Verify auditor reports and issue
                regulatory trust badges
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-2">
              
              <FilterButton
                label="All"
                active={activeFilter === "ALL"}
                onClick={() =>
                  setActiveFilter("ALL")
                }
              />

              <FilterButton
                label="Under Review"
                active={
                  activeFilter ===
                  "UNDER REVIEW"
                }
                onClick={() =>
                  setActiveFilter(
                    "UNDER REVIEW"
                  )
                }
              />

              <FilterButton
                label="Auditor Approved"
                active={
                  activeFilter ===
                  "AUDITOR APPROVED"
                }
                onClick={() =>
                  setActiveFilter(
                    "AUDITOR APPROVED"
                  )
                }
              />

              <FilterButton
                label="Final Approved"
                active={
                  activeFilter ===
                  "FINAL APPROVED"
                }
                onClick={() =>
                  setActiveFilter(
                    "FINAL APPROVED"
                  )
                }
              />

              <div className="relative ml-2">
                
                <SearchOutlinedIcon
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 10,
                    fontSize: 16,
                    color: "#9CA3AF",
                  }}
                />

                <input
                  placeholder="ID, garment, auditor..."
                  className="w-[220px] h-[38px] rounded-xl border border-gray-200 bg-[#F9FAFB] pl-9 pr-4 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-8 px-6 py-4 bg-[#FAFAFA] text-[11px] font-bold tracking-[0.16em] text-gray-400">
            <div>COMPLIANCE ID</div>
            <div>GARMENT</div>
            <div>AUDITOR ENTITY</div>
            <div>TYPE</div>
            <div>REGION</div>
            <div>STATUS</div>
            <div>BLOCKCHAIN PROOF</div>
            <div className="text-right">
              ACTION
            </div>
          </div>

          {/* ROWS */}
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-8 px-6 py-5 border-t border-gray-50 items-center hover:bg-gray-50 transition-all"
            >
              
              {/* ID */}
              <div>
                <p className="font-bold text-sm text-gray-900">
                  {item.id}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {item.garment}
                </p>
              </div>

              {/* GARMENT */}
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                
                <Inventory2OutlinedIcon
                  style={{
                    fontSize: 18,
                    color: "#3B82F6",
                  }}
                />

                {item.garment}
              </div>

              {/* AUDITOR */}
              <div>
                <p className="font-bold text-sm text-gray-900">
                  {item.auditor}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {item.date}
                </p>
              </div>

              {/* TYPE */}
              <div className="text-sm text-gray-500">
                {item.type}
              </div>

              {/* REGION */}
              <div>
                <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-500 text-[10px] font-bold tracking-wider">
                  {item.region}
                </span>
              </div>

              {/* STATUS */}
              <div>
                <StatusBadge
                  status={item.status}
                  color={item.statusColor}
                />
              </div>

              {/* HASH */}
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                
                <CheckCircleRoundedIcon
                  style={{
                    fontSize: 16,
                    color: "#2563EB",
                  }}
                />

                {item.hash}
              </div>

              {/* ACTION */}
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setSelectedClaim(item)
                  }
                  className="h-[42px] px-5 rounded-xl border border-gray-200 bg-white text-[12px] font-bold tracking-wider text-gray-700 hover:bg-gray-50 transition-all"
                >
                  EXAMINE CLAIM
                </button>
              </div>
            </div>
          ))}

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            
            <p className="text-sm text-gray-400">
              {filteredData.length} compliance
              records
            </p>

            <button className="flex items-center gap-2 text-[#1B5E20] font-bold text-sm tracking-wider">
              
              <OpenInNewRoundedIcon
                style={{ fontSize: 18 }}
              />

              EXPORT
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {selectedClaim && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6">
          
          <div
            className="w-[840px] bg-white rounded-[18px] overflow-hidden shadow-2xl"
            style={{
              transform: "scale(0.96)",
            }}
          >
            
            {/* HEADER */}
            <div className="h-[76px] bg-[#16641E] px-5 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center">
                  
                  <ShieldOutlinedIcon
                    style={{
                      color: "white",
                      fontSize: 22,
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-[18px] font-bold text-white leading-none">
                    Government Compliance Review
                  </h2>

                  <p className="text-[9px] font-semibold tracking-[0.16em] text-green-100 mt-1">
                    AUTHORITY NODE:
                    EU-SEC-01-BRUSSELS •{" "}
                    {selectedClaim.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedClaim(null)
                }
                className="text-white/80 hover:text-white transition-all"
              >
                <CloseRoundedIcon
                  style={{ fontSize: 20 }}
                />
              </button>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-2 gap-5 p-5">
              
              {/* LEFT */}
              <div>
                
                {/* SCORE */}
                <div className="border border-gray-100 rounded-[16px] p-4">
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-gray-400 mb-4">
                    
                    <DonutLargeRoundedIcon
                      style={{ fontSize: 14 }}
                    />

                    LIFECYCLE COMPLETENESS SCORE
                  </div>

                  <div className="flex items-center gap-4">
                    
                    <div className="w-[72px] h-[72px] rounded-full border-[5px] border-[#16641E] flex items-center justify-center text-[18px] font-black text-gray-900">
                      92%
                    </div>

                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900">
                        Passes Benchmark
                      </h3>

                      <p className="text-[12px] text-gray-400 mt-2 leading-relaxed max-w-[240px]">
                        All critical blockchain
                        proofs verified by
                        decentralised auditors.
                      </p>
                    </div>
                  </div>
                </div>

                {/* EMISSIONS */}
                <div className="mt-5">
                  
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 mb-3">
                    EMISSIONS VERIFICATION
                  </p>

                  <EmissionCard
                    title="Manufacturing Emissions"
                    value="4.2 kg"
                    threshold="Threshold: < 4.5 kg"
                  />

                  <EmissionCard
                    title="Shipment Emissions"
                    value="0.82 kg"
                    threshold="Threshold: < 1.2 kg"
                  />

                  <EmissionCard
                    title="Recycling Capability"
                    value="A+"
                    threshold="Threshold: ≥ Grade B"
                  />
                </div>

                {/* CERTIFICATES */}
                <div className="mt-5">
                  
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 mb-3">
                    COMPLIANCE CERTIFICATES
                  </p>

                  <CertificateCard title="GOTS 6.0" />
                  <CertificateCard title="LCA Report" />
                </div>
              </div>

              {/* RIGHT */}
              <div>
                
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 mb-3">
                  TRUST BADGE PREVIEW
                </p>

                <div className="border border-[#DCE7DE] bg-[#F6FAF7] rounded-[18px] h-[260px] flex flex-col items-center justify-center">
                  
                  <div className="relative">
                    
                    <div className="w-[84px] h-[84px] rounded-full bg-white flex items-center justify-center shadow-sm border border-[#EEF2EE]">
                      
                      <VerifiedOutlinedIcon
                        style={{
                          fontSize: 44,
                          color: "#16641E",
                        }}
                      />
                    </div>

                    <div className="absolute bottom-[2px] right-[2px] w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center border-[3px] border-white shadow-sm">
                      
                      <LanguageRoundedIcon
                        style={{
                          color: "white",
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>

                  <h2 className="text-[18px] font-black text-gray-900 mt-6">
                    LOOPI GOLD SEAL
                  </h2>

                  <p className="text-[9px] font-bold tracking-[0.16em] text-gray-400 mt-2">
                    GOVERNMENT VERIFIED
                    SUSTAINABILITY
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    
                    <BadgePill
                      icon={
                        <ForestOutlinedIcon
                          style={{
                            fontSize: 12,
                            color: "#22C55E",
                          }}
                        />
                      }
                      text="Low Carbon"
                    />

                    <BadgePill
                      icon={
                        <WaterDropOutlinedIcon
                          style={{
                            fontSize: 12,
                            color: "#3B82F6",
                          }}
                        />
                      }
                      text="Eco-Water"
                    />
                  </div>
                </div>

                {/* SIGNATURE */}
                <div className="mt-5 border border-[#F2DFB0] bg-[#FFF9EC] rounded-[16px] p-4">
                  
                  <div className="flex items-start gap-3">
                    
                    <AccessTimeOutlinedIcon
                      style={{
                        color: "#D97706",
                        marginTop: 2,
                        fontSize: 18,
                      }}
                    />

                    <div>
                      <h3 className="text-[14px] font-black text-[#B45309]">
                        Authority Final Signature
                      </h3>

                      <p className="text-[12px] text-[#C26B1B] mt-2 leading-relaxed">
                        Final approval will mint
                        the “Verified
                        Authenticity” metadata to
                        the blockchain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* GARMENT */}
                <div className="mt-5 bg-[#F7F8FA] border border-gray-100 rounded-[16px] p-4">
                  
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 mb-3">
                    GARMENT BEING REVIEWED
                  </p>

                  <div className="flex items-center gap-3">
                    
                    <Inventory2OutlinedIcon
                      style={{
                        fontSize: 16,
                        color: "#2563EB",
                      }}
                    />

                    <p className="font-black text-[13px] text-gray-900">
                      {selectedClaim.garment}
                    </p>

                    <span className="text-gray-300">
                      →
                    </span>

                    <p className="font-bold text-[12px] text-gray-500">
                      {selectedClaim.auditor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between">
              
              <button className="text-[11px] font-bold tracking-[0.16em] text-gray-400">
                RETURN TO QUEUE
              </button>

              <div className="flex items-center gap-3">
                
                <button className="h-[40px] px-6 rounded-2xl border border-red-200 bg-white text-red-500 text-[11px] font-black tracking-[0.16em] hover:bg-red-50 transition-all flex items-center gap-2">
                  
                  <FlagOutlinedIcon
                    style={{ fontSize: 16 }}
                  />

                  FLAG FOR RE-AUDIT
                </button>

                <button className="h-[40px] px-7 rounded-2xl bg-[#16641E] text-white text-[11px] font-black tracking-[0.16em] shadow-lg shadow-green-900/20 hover:bg-[#0F4E16] transition-all flex items-center gap-2">
                  
                  <CheckCircleOutlineRoundedIcon
                    style={{ fontSize: 16 }}
                  />

                  GRANT FINAL APPROVAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({
  title,
  value,
  icon,
  color,
}: any) {
  const colorMap: any = {
    green: "text-[#1B5E20]",
    blue: "text-[#2563EB]",
    orange: "text-[#F59E0B]",
    emerald: "text-[#16A34A]",
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm relative overflow-hidden">
      
      <div className="absolute right-0 top-0 w-[120px] h-[120px] bg-gradient-to-br from-transparent to-gray-50 rounded-full translate-x-10 -translate-y-10" />

      <p className="text-[11px] font-bold tracking-[0.18em] text-gray-400">
        {title}
      </p>

      <div className="flex items-center justify-between mt-3">
        
        <h2 className="text-[24px] font-black text-gray-900 leading-none">
          {value}
        </h2>

        <div className={colorMap[color]}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================= FILTER ================= */

function FilterButton({
  label,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`h-[38px] px-4 rounded-xl text-[12px] font-bold transition-all ${
        active
          ? "bg-[#111827] text-white"
          : "bg-[#F9FAFB] border border-gray-200 text-gray-500 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

/* ================= STATUS ================= */

function StatusBadge({
  status,
  color,
}: any) {
  const colorStyles: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${colorStyles[color]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </div>
  );
}

/* ================= EMISSION CARD ================= */

function EmissionCard({
  title,
  value,
  threshold,
}: any) {
  return (
    <div className="border border-gray-100 rounded-[16px] px-4 py-4 flex items-center justify-between mb-3">
      
      <div>
        <h3 className="font-black text-gray-900 text-[15px]">
          {title}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {threshold}
        </p>
      </div>

      <div className="flex items-center gap-2">
        
        <p className="text-[20px] font-black text-[#16641E]">
          {value}
        </p>

        <CheckCircleOutlineRoundedIcon
          style={{
            color: "#22C55E",
            fontSize: 18,
          }}
        />
      </div>
    </div>
  );
}

/* ================= CERTIFICATE ================= */

function CertificateCard({ title }: any) {
  return (
    <div className="border border-gray-100 rounded-[14px] px-4 py-4 flex items-center justify-between mb-3">
      
      <div className="flex items-center gap-3">
        
        <DescriptionOutlinedIcon
          style={{
            color: "#9CA3AF",
            fontSize: 18,
          }}
        />

        <h3 className="font-black text-gray-900 text-[14px]">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-3">
        
        <span className="px-3 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-black">
          VERIFIED
        </span>

        <OpenInNewRoundedIcon
          style={{
            color: "#D1D5DB",
            fontSize: 16,
          }}
        />
      </div>
    </div>
  );
}

/* ================= BADGE ================= */

function BadgePill({
  icon,
  text,
}: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-100 text-[11px] font-bold text-gray-600">
      {icon}
      {text}
    </div>
  );
}
