import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import RecyclingRequestModal from "./components/RecyclingRequestModal";

/* OUTLINED ICONS */
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import TokenOutlinedIcon from "@mui/icons-material/TokenOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { EnergySavingsLeafOutlined } from "@mui/icons-material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

type ActiveTab = "overview" | "materials" | "lifecycle";

export default function PublicPassportView() {
  const navigate = useNavigate();
  const { passportId } = useParams();

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);
  const [showTrustSealModal, setShowTrustSealModal] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRecycleModal, setShowRecycleModal] = useState(false);

  const displayPassportId = passportId || "GP-9822";

  const requireLogin = () => {
    setShowLoginRequired(true);
  };

  const handleRecycleRequest = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const isConsumerLoggedIn =
    Boolean(token) &&
    userRole?.toLowerCase().replace(/\s+/g, "") === "consumer";

  if (!isConsumerLoggedIn) {
    sessionStorage.setItem("pendingConsumerAction", "recycle");
    sessionStorage.setItem("consumerReturnPath", `/consumer/passport/${displayPassportId}`);
    setShowLoginRequired(true);
    return;
  }

  setShowRecycleModal(true);
};

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#102A1A]">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[999] h-16 bg-white/95 backdrop-blur-xl border-b border-[#DDE8DF] px-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/consumer")}
          className="h-10 w-10 rounded-xl bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[#062414] flex items-center justify-center p-1">
            <img src={logo} alt="LOOPI" className="h-full w-full object-contain" />
          </div>

          <div className="leading-tight">
            <p className="text-xs font-black">LOOPI Passport</p>
            <p className="text-[10px] text-[#1B5E20] font-black">
              {displayPassportId}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTrustSealModal(true)}
          className="h-10 w-10 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center"
        >
          <ShieldOutlinedIcon fontSize="small" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] pt-16 lg:pt-0 lg:h-screen lg:overflow-hidden">
        {/* LEFT PRODUCT VISUAL */}
        <aside className="relative min-h-[520px] lg:h-screen lg:min-h-0 bg-[#0B2E17] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/65 z-10" />

          {/* Placeholder product image area */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F3A2D] via-[#203C32] to-[#111827]">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#D1FAE5,transparent_24%),radial-gradient(circle_at_70%_80%,#065F46,transparent_30%)]" />

            <div className="h-full w-full flex items-center justify-center">
              <div className="w-[72%] max-w-[420px] aspect-[3/4] rounded-[40px] bg-gradient-to-br from-[#334155] to-[#111827] shadow-2xl border border-white/10 flex items-center justify-center">
                <Inventory2OutlinedIcon sx={{ fontSize: 110 }} className="text-white/25" />
              </div>
            </div>
          </div>

          {/* DESKTOP BACK */}
          <button
            onClick={() => navigate("/consumer")}
            className="hidden lg:flex absolute top-6 left-6 z-20 h-11 w-11 rounded-full bg-white/90 text-[#102A1A] items-center justify-center hover:bg-white transition"
          >
            <ArrowBackOutlinedIcon />
          </button>

          {/* RIGHT FLOATING ACTIONS */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <button className="h-11 w-11 rounded-full bg-white/90 text-[#102A1A] flex items-center justify-center hover:bg-white transition">
              <FavoriteBorderOutlinedIcon />
            </button>

            <button
            onClick={() => setShowShareModal(true)}
            className="h-11 w-11 rounded-full bg-white/90 text-[#102A1A] flex items-center justify-center hover:bg-white transition"
            >
            <ShareOutlinedIcon />
            </button>
          </div>

          {/* BADGES */}
          <div className="absolute top-24 left-6 z-20 hidden lg:flex flex-col gap-3">
            <button
              onClick={() => setShowTrustSealModal(true)}
              className="w-20 rounded-2xl bg-white/95 text-[#1B5E20] p-3 shadow-lg flex flex-col items-center gap-1"
            >
              <ShieldOutlinedIcon />
              <span className="text-[10px] font-black">VERIFIED</span>
            </button>

            <div className="w-20 rounded-2xl bg-[#1B5E20] text-white p-3 shadow-lg flex flex-col items-center gap-1">
              <WorkspacePremiumOutlinedIcon />
              <span className="text-[10px] font-black">GOLD TIER</span>
            </div>
          </div>

          {/* PRODUCT TITLE */}
          <div className="absolute bottom-8 left-6 right-6 z-20 text-white">
            <h1 className="text-2xl sm:text-3xl font-black">
              Recycled Wool Blazer
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-white text-[#1B5E20] text-xs font-black tracking-wide">
                LOOPI HERITAGE
              </span>

              <span className="flex items-center gap-1 text-white/80 text-sm font-semibold">
                <LocationOnOutlinedIcon fontSize="small" />
                Stockholm, Sweden
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="bg-white min-h-screen lg:min-h-0 lg:h-screen lg:overflow-y-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <div className="max-w-4xl mx-auto">
            {/* LOGO HEADER DESKTOP */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#062414] flex items-center justify-center p-1">
                  <img
                    src={logo}
                    alt="LOOPI"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h2 className="font-black">LOOPI Public Passport</h2>
                  <p className="text-sm text-[#6B7280]">
                    Passport ID: {displayPassportId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTrustSealModal(true)}
                className="h-11 px-4 rounded-full border border-[#1B5E20]/20 bg-[#F1F8F4] text-[#1B5E20] font-black text-sm flex items-center gap-2"
              >
                <ShieldOutlinedIcon fontSize="small" />
                Trust Seal
              </button>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TopMetric
                icon={<EnergySavingsLeafOutlined />}
                value="4.2 kg"
                label="Carbon Footprint"
                color="green"
              />

              <TopMetric
                icon={<WaterDropOutlinedIcon />}
                value="15.0 L"
                label="Water Used"
                color="blue"
              />
            </div>

            {/* TABS */}
            <div className="mt-8 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-6 overflow-x-auto">
                <TabButton
                  label="Overview"
                  active={activeTab === "overview"}
                  onClick={() => setActiveTab("overview")}
                />

                <TabButton
                  label="Materials"
                  active={activeTab === "materials"}
                  onClick={() => setActiveTab("materials")}
                />

                <TabButton
                  label="Lifecycle"
                  active={activeTab === "lifecycle"}
                  onClick={() => setActiveTab("lifecycle")}
                />
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="mt-8">
              {activeTab === "overview" && (
                <OverviewTab onBlockchain={() => setShowBlockchainModal(true)} />
              )}

              {activeTab === "materials" && (
                <MaterialsTab onRecycle={handleRecycleRequest} />
              )}

              {activeTab === "lifecycle" && (
                <LifecycleTab
                  onBlockchain={() => setShowBlockchainModal(true)}
                  onRepair={requireLogin}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* BLOCKCHAIN MODAL */}
      {showBlockchainModal && (
        <ModalShell onClose={() => setShowBlockchainModal(false)}>
          <div className="bg-white rounded-[28px] w-full max-w-2xl mx-auto shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#EEF2F0] flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">Blockchain Explorer</h3>
                <p className="text-sm text-[#6B7280] mt-1">
                  All public lifecycle transactions for this product.
                </p>
              </div>

              <button
                onClick={() => setShowBlockchainModal(false)}
                className="h-10 w-10 rounded-full bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center"
              >
                <CloseOutlinedIcon />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {blockchainRecords.map((record, index) => (
                <BlockchainRecord key={index} {...record} />
              ))}
            </div>

            <div className="p-5 bg-[#F8FAFC] text-center text-xs text-[#6B7280] font-semibold">
              All records are immutable and publicly verifiable in the LOOPI demo ledger.
            </div>
          </div>
        </ModalShell>
      )}

      {/* SHARE PASSPORT MODAL */}
        {showShareModal && (
        <ModalShell onClose={() => setShowShareModal(false)}>
            <div className="bg-white rounded-[28px] w-full max-w-md mx-auto shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#EEF2F0] flex items-start justify-between">
                <div>
                <h3 className="text-xl font-black text-[#102A1A]">
                    Share Passport
                </h3>
                <p className="text-xs text-[#94A3B8] font-semibold mt-1">
                    Share this Digital Product Passport
                </p>
                </div>

                <button
                onClick={() => setShowShareModal(false)}
                className="h-10 w-10 rounded-full bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E8F5E9] hover:text-[#1B5E20] transition flex items-center justify-center"
                >
                <CloseOutlinedIcon fontSize="small" />
                </button>
            </div>

            <div className="p-6 space-y-3">
                <ShareOption
                icon={<ContentCopyOutlinedIcon />}
                title="Copy Link"
                text="Share via messaging or social media"
                onClick={() => {
                    navigator.clipboard?.writeText(
                    `https://loopi.io/passport/${displayPassportId}`
                    );
                    alert("Passport link copied");
                }}
                />

                <ShareOption
                icon={<FileDownloadOutlinedIcon />}
                title="Download PDF"
                text="Save a complete passport report"
                onClick={() => alert("Demo: PDF download will be connected later")}
                />

                <ShareOption
                icon={<QrCode2OutlinedIcon />}
                title="Generate QR Code"
                text="Create scannable code"
                onClick={() => alert("Demo: QR generation will be connected later")}
                />

                <ShareOption
                icon={<PublicOutlinedIcon />}
                title="EU DPP Portal"
                text="View on official EU platform"
                highlight
                onClick={() =>
                    alert("Demo: External DPP portal link will be connected later")
                }
                />

                <div className="mt-5 rounded-2xl border border-[#EEF2F0] bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#94A3B8] font-black">
                    Link
                </p>
                <p className="text-sm font-black text-[#475569] mt-1 break-all">
                    https://loopi.io/passport/{displayPassportId}
                </p>
                </div>
            </div>
            </div>
        </ModalShell>
        )}

      {/* TRUST SEAL MODAL */}
      {showTrustSealModal && (
        <ModalShell onClose={() => setShowTrustSealModal(false)}>
          <div className="bg-[#1B5E20] text-white rounded-[28px] w-full max-w-3xl mx-auto shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            <button
              onClick={() => setShowTrustSealModal(false)}
              className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <CloseOutlinedIcon />
            </button>

            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-white text-[#1B5E20] flex items-center justify-center">
                <ShieldOutlinedIcon sx={{ fontSize: 56 }} />
              </div>

              <h3 className="text-3xl font-black mt-6">LOOPI Trust Seal</h3>
              <p className="text-white/70 mt-2">
                Blockchain Verified • EU DPP Inspired • Public Lifecycle Data
              </p>
            </div>

            <div className="mt-10 max-w-xl mx-auto space-y-4">
              <TrustSealRow label="Standard" value="EU Digital Product Passport Concept" />
              <TrustSealRow label="Ledger Status" value="Active • Immutable" />
              <TrustSealRow label="Authority Node" value="LOOPI Verification Hub" />
              <TrustSealRow label="Certified By" value="LOOPI Heritage Foundation" />
              <TrustSealRow label="Block Number" value="#2,847,193" />
              <TrustSealRow label="Transaction Hash" value="0x7f9f...c3a2" />
            </div>

            <p className="text-center text-white/55 text-xs mt-8">
              This verification is a project demonstration and does not claim official EU certification.
            </p>
          </div>
        </ModalShell>
      )}
      
      {showRecycleModal && (
      <RecyclingRequestModal
        initialPassportId={displayPassportId}
        onClose={() => setShowRecycleModal(false)}
      />
    )}

      {/* LOGIN REQUIRED MODAL */}
      {showLoginRequired && (
        <ModalShell onClose={() => setShowLoginRequired(false)}>
          <div className="bg-white rounded-[28px] p-7 max-w-md mx-auto shadow-2xl relative">
            <button
              onClick={() => setShowLoginRequired(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>

            <div className="h-14 w-14 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-sm">
              <ShieldOutlinedIcon />
            </div>

            <h3 className="text-2xl font-black mt-5">Login Required</h3>

            <p className="text-[#6B7280] mt-3 leading-relaxed">
              Please login or create a Consumer account to continue this action.
              Repair requests, recycling registration, resale listing, and ownership
              tracking require authentication.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
              <button
                onClick={() => navigate("/")}
                className="h-12 rounded-xl border border-[#1B5E20] text-[#1B5E20] font-black flex items-center justify-center gap-2"
              >
                <LoginOutlinedIcon fontSize="small" />
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="h-12 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2"
              >
                <PersonAddAltOutlinedIcon fontSize="small" />
                Register
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* TABS */

function OverviewTab({ onBlockchain }: { onBlockchain: () => void }) {
  return (
    <div className="space-y-8">
      <p className="text-[#475569] leading-relaxed font-medium">
        Expertly crafted from sustainable materials, this blazer represents a new
        era of circular fashion. Every thread is traceable back to its origin
        through the LOOPI Digital Product Passport.
      </p>

      <section>
        <SectionLabel title="Circularity Score" />

        <div className="rounded-[28px] border border-[#DDE8DF] bg-[#F8FAFC] p-6">
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-[#1B5E20]">88</h3>
            <span className="text-xl font-black text-[#94A3B8] mb-1">/100</span>
          </div>

          <div className="mt-5 h-3 rounded-full bg-[#E5E7EB] overflow-hidden">
            <div className="h-full w-[88%] rounded-full bg-[#1B5E20]" />
          </div>

          <div className="mt-5 rounded-xl bg-[#E8F5E9] border border-[#CFE8D2] px-4 py-3 text-xs font-bold text-[#1B5E20]">
            Calculated using circularity, recyclability, repairability, and material traceability indicators.
          </div>
        </div>
      </section>

      <section>
        <SectionLabel title="Total Emissions" />

        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-black">
          <EnergySavingsLeafOutlined fontSize="small" />
          4.2 kg CO₂e
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImpactCard
            icon={<FactoryOutlinedIcon />}
            title="Manufacturing"
            value="2.8 kg"
            text="Low-waste cutting • Renewable energy facility"
          />

          <ImpactCard
            icon={<LocalShippingOutlinedIcon />}
            title="Shipment"
            value="1.4 kg"
            text="Electric cargo transport • Carbon offset applied"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-[#1B5E20] text-white p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-black text-white/70">
              Avoided Emissions
            </p>
            <p className="text-2xl font-black mt-1">-8.6 kg CO₂e</p>
          </div>

          <p className="text-xs text-white/60">vs. conventional production</p>
        </div>
      </section>

      <section>
        <SectionLabel title="Water Usage" />

        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] font-black">
          <WaterDropOutlinedIcon fontSize="small" />
          15.0 L Total
        </div>

        <div className="rounded-[24px] border border-[#DDE8DF] bg-white p-5 space-y-4">
          <ProgressRow label="Process" value="7.5 L" width="75%" />
          <ProgressRow label="Dyeing" value="5 L" width="50%" />
          <ProgressRow label="Finishing" value="2.5 L" width="25%" />
        </div>

        <div className="mt-4 rounded-2xl bg-[#2563EB] text-white p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-black text-white/70">
              Water Saved
            </p>
            <p className="text-2xl font-black mt-1">-45 L</p>
          </div>

          <p className="text-xs text-white/60">vs. conventional production</p>
        </div>
      </section>

      <button
        onClick={onBlockchain}
        className="w-full h-14 rounded-2xl border border-[#1B5E20]/20 bg-[#F1F8F4] text-[#1B5E20] font-black flex items-center justify-center gap-2 hover:bg-[#E8F5E9] transition"
      >
        <TokenOutlinedIcon fontSize="small" />
        Open Blockchain Explorer
        <OpenInNewOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
}

function ShareOption({
  icon,
  title,
  text,
  onClick,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        rounded-2xl
        border
        p-4
        text-left
        flex items-center gap-4
        transition
        ${
          highlight
            ? "bg-[#EFF6FF] border-[#BFDBFE] hover:bg-[#DBEAFE]"
            : "bg-[#F8FAFC] border-[#EEF2F0] hover:bg-[#F1F8F4] hover:border-[#CFE8D2]"
        }
      `}
    >
      <div
        className={`
          h-11 w-11
          rounded-2xl
          flex items-center justify-center
          shrink-0
          ${
            highlight
              ? "bg-[#DBEAFE] text-[#2563EB]"
              : "bg-white text-[#1B5E20] border border-[#DDE8DF]"
          }
        `}
      >
        {icon}
      </div>

      <div>
        <p className="font-black text-[#102A1A]">{title}</p>
        <p className="text-xs text-[#94A3B8] font-semibold mt-1">
          {text}
        </p>
      </div>
    </button>
  );
}

function MaterialsTab({ onRecycle }: { onRecycle: () => void }) {
  return (
    <div className="space-y-8">
      <p className="text-[#475569] leading-relaxed font-medium">
        This product uses traceable circular materials. Recyclable components and
        end-of-life instructions are shown for public consumer transparency.
      </p>

      <section>
        <SectionLabel title="Material Breakdown" />

        <div className="space-y-4">
          <MaterialCard
            material="Recycled Wool"
            source="Post-consumer garments"
            percentage="70%"
            recyclable
            width="70%"
          />

          <MaterialCard
            material="PET Polyester"
            source="Ocean-bound plastic"
            percentage="25%"
            recyclable
            width="25%"
          />

          <MaterialCard
            material="Elastane"
            source="Industrial waste"
            percentage="5%"
            recyclable={false}
            width="5%"
          />
        </div>

        <div className="mt-5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3 text-xs font-bold text-[#2563EB]">
          Synthetic components require certified recycling partners for safe material recovery.
        </div>
      </section>

      <section>
        <SectionLabel title="End-of-Life Protocol" />

        <div className="rounded-[28px] border border-[#CFE8D2] bg-[#F1F8F4] p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#1B5E20] text-white flex items-center justify-center">
              <RecyclingOutlinedIcon />
            </div>

            <div>
              <h4 className="font-black">Ready for Fiber-Recycling</h4>
              <p className="text-sm text-[#6B7280] mt-1">
                Programme: LOOPI Circular Loop
              </p>
              <p className="text-sm text-[#6B7280]">
                Partner: Stockholm Textile Recovery
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-sm text-[#6B7280] font-bold">
              Recycling Credits
            </p>
            <h3 className="text-3xl font-black text-[#1B5E20] mt-1">
              250 Credits
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Redeemable for future LOOPI circular products.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-sm font-black flex items-center gap-2">
              <LocationOnOutlinedIcon fontSize="small" className="text-[#2563EB]" />
              Nearest Drop-off Point
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              Stockholm Textile Hub, Götgatan 45
            </p>
            <p className="text-xs text-[#2563EB] font-black mt-2">
              1.2 km away • Open today until 18:00
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-sm font-black">Instructions</p>
            <ul className="text-sm text-[#6B7280] mt-2 space-y-1">
              <li>Remove all personal items and accessories.</li>
              <li>Present this Digital Passport at drop-off.</li>
              <li>Receive instant credits to your LOOPI account.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onRecycle}
            className="h-12 px-7 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
          >
            <RecyclingOutlinedIcon fontSize="small" />
            Register for Recycling
          </button>
        </div>
      </section>

      <section>
        <SectionLabel title="Material Certifications" />

        <div className="rounded-[24px] border border-[#DDE8DF] bg-[#F8FAFC] p-5 space-y-4">
          <CertificationRow title="GRS Certified" text="Global Recycled Standard" />
          <CertificationRow title="OEKO-TEX Standard 100" text="Textile safety certification" />
          <CertificationRow title="EU Ecolabel" text="European environmental excellence concept" />
        </div>
      </section>
    </div>
  );
}

function LifecycleTab({
  onBlockchain,
  onRepair,
}: {
  onBlockchain: () => void;
  onRepair: () => void;
}) {
  return (
    <div className="space-y-8">
      <p className="text-[#475569] leading-relaxed font-medium">
        Lifecycle events show how this product moved through manufacturing,
        quality control, logistics, retail transfer, ownership, repair, and
        end-of-life readiness.
      </p>

      <section>
        <SectionLabel title="Ownership History" />

        <div className="rounded-[28px] border border-[#DDE8DF] bg-[#F8FAFC] p-5">
          <div className="space-y-6">
            <TimelineItem
              label="Manufacturer"
              title="LOOPI Manufacturing → Quality Control"
              date="Mar 16, 2026 • 14:23 UTC"
              hash="0x7f9f...c3a2"
              color="green"
            />

            <TimelineItem
              label="Quality Audit"
              title="Quality Control → Logistics Hub SE"
              date="Mar 18, 2026 • 09:15 UTC"
              hash="0x3a2b...f7e1"
              color="gray"
            />

            <TimelineItem
              label="Logistics"
              title="Logistics Hub SE → Retail Partner"
              date="Mar 20, 2026 • 16:45 UTC"
              hash="0x8c4d...a9b3"
              color="blue"
            />

            <TimelineItem
              label="Retail Transfer"
              title="Retail Partner → Consumer"
              date="Mar 22, 2026 • 11:30 UTC"
              hash="0x1e5f...d2c8"
              color="green"
            />
          </div>

          <button
            onClick={onBlockchain}
            className="mt-6 w-full h-12 rounded-xl bg-white border border-[#DDE8DF] text-[#64748B] font-black flex items-center justify-center gap-2 hover:bg-[#F1F8F4] hover:text-[#1B5E20] transition"
          >
            <TokenOutlinedIcon fontSize="small" />
            Full Blockchain Timeline
          </button>
        </div>
      </section>

      <section>
        <SectionLabel title="Service History" />

        <div className="rounded-[24px] border border-[#DDE8DF] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center">
                <BuildOutlinedIcon />
              </div>

              <div>
                <h4 className="font-black">Lining Repair</h4>
                <p className="text-sm text-[#6B7280] mt-1">
                  Sept 12, 2025 • Berlin Eco-Hub
                </p>
              </div>
            </div>

            <KeyboardArrowRightOutlinedIcon className="text-[#94A3B8]" />
          </div>

          <div className="mt-4 rounded-xl bg-[#E8F5E9] border border-[#CFE8D2] px-4 py-3 text-sm font-black text-[#1B5E20]">
            +15 Eco Credits Earned
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#1B5E20] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-black">Need a Repair?</h4>
            <p className="text-white/70 text-sm mt-1">
              Find certified LOOPI partners near you.
            </p>
          </div>

          <button
            onClick={onRepair}
            className="h-11 px-5 rounded-xl bg-white text-[#1B5E20] font-black"
          >
            Find Partner
          </button>
        </div>
      </section>

      <button
        onClick={onBlockchain}
        className="w-full h-14 rounded-2xl border border-[#1B5E20]/20 bg-[#F1F8F4] text-[#1B5E20] font-black flex items-center justify-center gap-2 hover:bg-[#E8F5E9] transition"
      >
        <HubOutlinedIcon fontSize="small" />
        Blockchain Explorer
        <OpenInNewOutlinedIcon fontSize="small" />
      </button>

      <section>
        <div className="rounded-[28px] border border-[#DDE8DF] bg-[#F8FAFC] p-6 flex items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8] font-black">
              Expected Product Lifespan
            </p>
            <h3 className="text-3xl font-black text-[#1B5E20] mt-2">
              10+ Years
            </h3>
            <p className="text-sm text-[#6B7280] mt-1">
              With proper care and maintenance.
            </p>
          </div>

          <div className="h-14 w-14 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
            <AccessTimeOutlinedIcon />
          </div>
        </div>
      </section>
    </div>
  );
}

/* DATA */

const blockchainRecords = [
  {
    type: "Manufacturing",
    status: "Confirmed",
    timestamp: "Mar 16, 2026 14:23:45 UTC",
    block: "#2,847,193",
    gas: "21,543",
    hash: "0x7f9fade2b8c4e1a3f6d9c2b5e8a1f4d7c0b3e6a9f2c5b8e1a4d7f0c3b6e9a2c5",
  },
  {
    type: "Quality Control",
    status: "Confirmed",
    timestamp: "Mar 18, 2026 09:15:22 UTC",
    block: "#2,849,821",
    gas: "18,942",
    hash: "0x3a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b",
  },
  {
    type: "Logistics",
    status: "Confirmed",
    timestamp: "Mar 20, 2026 16:45:33 UTC",
    block: "#2,852,447",
    gas: "19,876",
    hash: "0x8c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
  },
  {
    type: "Retail Transfer",
    status: "Confirmed",
    timestamp: "Mar 22, 2026 11:30:17 UTC",
    block: "#2,854,901",
    gas: "20,134",
    hash: "0x1e5f2a6b3c7d4e8f5a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
  },
];

/* SMALL COMPONENTS */

function TopMetric({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "green" | "blue";
}) {
  const isGreen = color === "green";

  return (
    <div
      className={`rounded-[24px] border p-6 text-center ${
        isGreen
          ? "bg-[#F1F8F4] border-[#CFE8D2] text-[#1B5E20]"
          : "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
      }`}
    >
      <div className="mx-auto h-10 w-10 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-2xl font-black mt-2">{value}</h3>
      <p className="text-xs uppercase tracking-[0.18em] font-black mt-1">
        {label}
      </p>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 text-sm uppercase tracking-[0.16em] font-black border-b-2 transition whitespace-nowrap ${
        active
          ? "border-[#1B5E20] text-[#102A1A]"
          : "border-transparent text-[#94A3B8] hover:text-[#1B5E20]"
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8] font-black mb-4">
      {title}
    </p>
  );
}

function ImpactCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#DDE8DF] bg-[#F8FAFC] p-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="font-black">{title}</p>
          <h4 className="text-2xl font-black text-[#1B5E20] mt-1">{value}</h4>
          <p className="text-xs text-[#6B7280] mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-black mb-2">
        <span>{label}</span>
        <span className="text-[#2563EB]">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#2563EB]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function MaterialCard({
  material,
  source,
  percentage,
  recyclable,
  width,
}: {
  material: string;
  source: string;
  percentage: string;
  recyclable: boolean;
  width: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#DDE8DF] bg-[#F8FAFC] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-black">{material}</h4>

          <span
            className={`inline-flex mt-2 px-2 py-1 rounded-full text-[10px] font-black ${
              recyclable
                ? "bg-[#E8F5E9] text-[#1B5E20]"
                : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {recyclable ? "RECYCLABLE" : "NON-RECYCLABLE"}
          </span>
        </div>

        <p className="text-2xl font-black text-[#1B5E20]">{percentage}</p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
        <div
          className={`h-full rounded-full ${
            recyclable ? "bg-[#1B5E20]" : "bg-[#64748B]"
          }`}
          style={{ width }}
        />
      </div>

      <p className="text-xs text-[#6B7280] mt-3">Source: {source}</p>
    </div>
  );
}

function CertificationRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircleOutlineOutlinedIcon
        fontSize="small"
        className="text-[#1B5E20] mt-0.5"
      />

      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm text-[#6B7280]">{text}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  title,
  date,
  hash,
  color,
}: {
  label: string;
  title: string;
  date: string;
  hash: string;
  color: "green" | "blue" | "gray";
}) {
  const colorClass =
    color === "green"
      ? "bg-[#1B5E20]"
      : color === "blue"
      ? "bg-[#2563EB]"
      : "bg-[#94A3B8]";

  return (
    <div className="relative pl-8">
      <span
        className={`absolute left-0 top-1.5 h-4 w-4 rounded-full ${colorClass}`}
      />

      <div className="absolute left-[7px] top-7 bottom-[-28px] w-px bg-[#CBD5E1]" />

      <div>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black text-white ${colorClass}`}
        >
          {label}
        </span>

        <p className="font-black mt-2">{title}</p>
        <p className="text-xs text-[#6B7280] mt-1">{date}</p>
        <p className="text-xs text-[#94A3B8] mt-1">{hash}</p>
      </div>
    </div>
  );
}

function BlockchainRecord({
  type,
  status,
  timestamp,
  block,
  gas,
  hash,
}: {
  type: string;
  status: string;
  timestamp: string;
  block: string;
  gas: string;
  hash: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#DDE8DF] bg-[#F8FAFC] p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-[#1B5E20] text-white text-xs font-black uppercase">
          {type}
        </span>

        <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-black uppercase">
          {status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <InfoLine label="Timestamp" value={timestamp} />
        <InfoLine label="Block" value={block} />
        <InfoLine label="Gas Used" value={gas} />
        <InfoLine label="Tx Hash" value={hash} />
      </div>

      <button className="mt-4 text-sm text-[#1B5E20] font-black flex items-center gap-2">
        <OpenInNewOutlinedIcon fontSize="small" />
        View on LOOPI Explorer
      </button>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3">
      <span className="text-[#94A3B8] font-bold">{label}:</span>
      <span className="font-semibold break-all">{value}</span>
    </div>
  );
}

function TrustSealRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/20 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-black">
        {label}
      </p>
      <p className="font-black mt-2">{value}</p>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="min-h-full flex items-center justify-center"
        onClick={onClose}
      >
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}