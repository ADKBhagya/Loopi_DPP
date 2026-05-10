import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import SellClothesModal from "./components/SellClothesModal";
import RepairRequestModal from "./components/RepairRequestModal";
import RecyclingRequestModal from "./components/RecyclingRequestModal";
import ReportIssueModal from "./components/ReportIssueModal";
import ConsumerMyClothesModal from "./components/ConsumerMyClothesModal";

/* ICONS */
/* OUTLINED ICONS - LOOPI DASHBOARD STYLE */
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TokenOutlinedIcon from "@mui/icons-material/TokenOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { EnergySavingsLeafOutlined } from "@mui/icons-material";

export default function ConsumerHome() {
  const navigate = useNavigate();

  // Pending actions that require login before proceeding
  type PendingConsumerAction = "sell" | "repair" | "recycle" | "report" | "my-clothes";

  const [passportId, setPassportId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [passedHero, setPassedHero] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const [showRecycleModal, setShowRecycleModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMyClothesModal, setShowMyClothesModal] = useState(false);

    const isConsumerLoggedIn =
    Boolean(token) && userRole?.toLowerCase().replace(/\s+/g, "") === "consumer";

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

const handleSearch = () => {
  if (!passportId.trim()) {
    alert("Please enter a valid Passport ID");
    return;
  }

  navigate(`/consumer/passport/${passportId.trim()}`);
};

const requireLogin = (action: PendingConsumerAction) => {
  sessionStorage.setItem("pendingConsumerAction", action);
  sessionStorage.setItem("consumerReturnPath", "/consumer");
  setShowLoginRequired(true);
};

  useEffect(() => {
  const handleScroll = () => {
    const heroHeight = 380; 
    setPassedHero(window.scrollY > heroHeight);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

const handleSellClothes = () => {
  if (!isConsumerLoggedIn) {
    requireLogin("sell");
    return;
  }

  setShowSellModal(true);
};

const handleRepairRequest = () => {
  if (!isConsumerLoggedIn) {
    requireLogin("repair");
    return;
  }

  setShowRepairModal(true);
};

useEffect(() => {
  if (!isConsumerLoggedIn) return;

  const pendingAction = sessionStorage.getItem(
    "pendingConsumerAction"
  ) as PendingConsumerAction | null;

  if (!pendingAction) return;

  sessionStorage.removeItem("pendingConsumerAction");

  if (pendingAction === "repair") {
    setShowRepairModal(true);
  }

  if (pendingAction === "sell") {
    setShowSellModal(true);
  }

if (pendingAction === "recycle") {
  setShowLoginRequired(false);
  setShowRecycleModal(true);
}

if (pendingAction === "report") {
  setShowLoginRequired(false);
  setShowReportModal(true);
}

if (pendingAction === "my-clothes") {
  setShowLoginRequired(false);
  setShowMyClothesModal(true);
}

}, [isConsumerLoggedIn]);

const handleReportIssue = () => {
  if (!isConsumerLoggedIn) {
    requireLogin("report");
    return;
  }

  setShowReportModal(true);
};

const handleViewMyClothes = () => {
  if (!isConsumerLoggedIn) {
    requireLogin("my-clothes");
    return;
  }

  setShowMyClothesModal(true);
};

  return (
     <div className="min-h-screen bg-[#F7FAF8] text-[#102A1A] pt-16">

{/* NAVBAR */}
<header
  className={`
    fixed top-0 left-0 right-0 z-[9999]
    backdrop-blur-xl border-b
    transition-all duration-300
    ${
      passedHero
        ? "bg-[#062414]/95 border-[#1B5E20]/40 shadow-[0_10px_35px_rgba(0,0,0,0.25)]"
        : "bg-white/95 border-[#DDE8DF] shadow-[0_8px_30px_rgba(15,61,30,0.08)]"
    }
  `}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
    
    {/* LEFT: LOGO */}
    <div className="flex items-center gap-3">
      <Link to="/consumer" className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-[#062414] flex items-center justify-center p-1 shadow-sm border border-[#1B5E20]/20">
          <img
            src={logo}
            alt="LOOPI"
            className="h-full w-full object-contain block"
          />
        </div>

        <div className="leading-tight hidden sm:block">
<h1
  className={`
    text-sm font-black tracking-wide transition
    ${passedHero ? "text-white" : "text-[#000000]"}
  `}
>
  LOOPI
</h1>

<p
  className={`
    text-[10px] uppercase tracking-[0.18em] font-bold transition
    ${passedHero ? "text-[#A7F3D0]" : "text-[#1B5E20]"}
  `}
>
  BLOCKCHAIN DPP
</p>
        </div>
      </Link>
    </div>

    {/* DESKTOP NAV */}
<nav
  className={`
    hidden lg:flex items-center gap-7 text-sm font-bold transition
    ${passedHero ? "text-white/85" : "text-[#334155]"}
  `}
>
  <a
    href="#verify"
    className={`
      transition
      ${passedHero ? "hover:text-[#A7F3D0]" : "hover:text-[#1B5E20]"}
    `}
  >
    Verify Passport
  </a>

  <a
    href="#repair"
    className={`
      transition
      ${passedHero ? "hover:text-[#A7F3D0]" : "hover:text-[#1B5E20]"}
    `}
  >
    Repair Centers
  </a>

  <a
    href="#resale"
    className={`
      transition
      ${passedHero ? "hover:text-[#A7F3D0]" : "hover:text-[#1B5E20]"}
    `}
  >
    Resale Market
  </a>

  <a
    href="#recycle"
    className={`
      transition
      ${passedHero ? "hover:text-[#A7F3D0]" : "hover:text-[#1B5E20]"}
    `}
  >
    Recycle Guide
  </a>

  <a
    href="#care"
    className={`
      transition
      ${passedHero ? "hover:text-[#A7F3D0]" : "hover:text-[#1B5E20]"}
    `}
  >
    Care Guide
  </a>
</nav>

    {/* DESKTOP ACTIONS */}
    <div className="hidden lg:flex items-center gap-3">
<button
  onClick={() => navigate("/")}
  className={`
    h-10 px-4 rounded-full text-sm font-black
    transition flex items-center gap-2 border
    ${
      passedHero
        ? "bg-white/10 text-white border-white/30 hover:bg-white/20"
        : "bg-white text-[#1B5E20] border-[#1B5E20] hover:bg-[#E8F5E9]"
    }
  `}
>
  <LoginOutlinedIcon fontSize="small" />
  Login
</button>

<button
  onClick={() => navigate("/register")}
  className={`
    h-10 px-4 rounded-full text-sm font-black
    transition flex items-center gap-2 border
    ${
      passedHero
        ? "bg-white text-[#1B5E20] border-white hover:bg-[#E8F5E9]"
        : "bg-white text-[#1B5E20] border-[#1B5E20] hover:bg-[#E8F5E9]"
    }
  `}
>
  <PersonAddAltOutlinedIcon fontSize="small" />
  Register
</button>

<button
  onClick={() => setShowScanner(true)}
  className={`
    h-10 px-5 rounded-full text-sm font-black
    shadow-md transition flex items-center gap-2
    ${
      passedHero
        ? "bg-white text-[#1B5E20] hover:bg-[#E8F5E9]"
        : "bg-[#1B5E20] text-white hover:bg-[#0F3D1E]"
    }
  `}
>
  <QrCodeScannerOutlinedIcon fontSize="small" />
  Scan QR
</button>
    </div>

    {/* MOBILE MENU BUTTON */}
<button
  onClick={() => setMobileMenu(!mobileMenu)}
  className={`
    lg:hidden h-10 w-10 rounded-xl
    flex items-center justify-center transition
    ${
      passedHero
        ? "bg-white/10 text-white hover:bg-white/20"
        : "bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#D7EEDB]"
    }
  `}
>
  {mobileMenu ? <CloseOutlinedIcon /> : <MenuOutlinedIcon />}
</button>
  </div>

  {/* MOBILE MENU */}
  {mobileMenu && (
    <div className="lg:hidden px-4 pb-4 bg-white border-t border-[#DDE8DF] shadow-[0_20px_40px_rgba(15,61,30,0.12)]">
      <div className="flex flex-col gap-3 pt-4 text-sm font-bold">
        <a
          href="#verify"
          onClick={() => setMobileMenu(false)}
          className="h-10 px-3 rounded-xl flex items-center hover:bg-[#F1F8F4]"
        >
          Verify Passport
        </a>

        <a
          href="#repair"
          onClick={() => setMobileMenu(false)}
          className="h-10 px-3 rounded-xl flex items-center hover:bg-[#F1F8F4]"
        >
          Repair Centers
        </a>

        <a
          href="#resale"
          onClick={() => setMobileMenu(false)}
          className="h-10 px-3 rounded-xl flex items-center hover:bg-[#F1F8F4]"
        >
          Resale Market
        </a>

        <a
          href="#recycle"
          onClick={() => setMobileMenu(false)}
          className="h-10 px-3 rounded-xl flex items-center hover:bg-[#F1F8F4]"
        >
          Recycle Guide
        </a>

        <a
          href="#care"
          onClick={() => setMobileMenu(false)}
          className="h-10 px-3 rounded-xl flex items-center hover:bg-[#F1F8F4]"
        >
          Care Guide
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={goBack}
            className="h-11 rounded-xl bg-[#F1F8F4] text-[#1B5E20] font-black flex items-center justify-center gap-2"
          >
            <ArrowBackOutlinedIcon fontSize="small" />
            Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="h-11 rounded-xl border border-[#1B5E20] text-[#1B5E20] font-black flex items-center justify-center gap-2"
          >
            <LoginOutlinedIcon fontSize="small" />
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="h-11 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2"
          >
            <PersonAddAltOutlinedIcon fontSize="small" />
            Register
          </button>
        </div>

        <button
          onClick={() => {
            setMobileMenu(false);
            setShowScanner(true);
          }}
          className="h-11 rounded-xl bg-[#062414] text-white font-black flex items-center justify-center gap-2"
        >
          <QrCodeScannerOutlinedIcon fontSize="small" />
          Scan QR
        </button>
      </div>
    </div>
  )}
</header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062414] via-[#0B2E17] to-[#1B5E20] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#A7F3D0,transparent_30%),radial-gradient(circle_at_bottom_left,#34D399,transparent_25%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.18em] mb-5">
              <ShieldOutlinedIcon fontSize="small" />
              EU DPP Inspired Consumer Portal
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Verify Your Product with LOOPI Digital Product Passport
            </h2>

            <p className="mt-5 text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">
              Scan or search a product passport to check authenticity,
              sustainability data, lifecycle history, repair options, resale
              eligibility, and recycling guidance.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowScanner(true)}
                className="h-12 px-6 rounded-xl bg-white text-[#1B5E20] font-black shadow-lg flex items-center justify-center gap-2 hover:bg-[#F1F8F4] transition"
              >
                <QrCodeScannerOutlinedIcon />
                Scan QR Code
              </button>

              <a
                href="#verify"
                className="h-12 px-6 rounded-xl bg-[#031B0D] text-white font-black flex items-center justify-center gap-2 hover:bg-black transition"
              >
                <SearchOutlinedIcon />
                Search Passport ID
              </a>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="bg-white text-[#102A1A] rounded-[28px] shadow-2xl p-6 border border-white/40 max-w-md lg:ml-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
                  <VerifiedOutlinedIcon />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#6B7280]">
                    Passport ID: GP-9822
                  </p>
                  <h3 className="font-black">Organic Cotton Hoodie</h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-black">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-[#F1F8F4] p-4">
                <p className="text-xs text-[#6B7280] font-bold">Eco Score</p>
                <p className="text-2xl font-black text-[#1B5E20]">87%</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs text-[#6B7280] font-bold">Lifecycle</p>
                <p className="text-lg font-black">In Use</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <InfoRow label="Material" value="Organic Cotton" />
              <InfoRow label="Carbon" value="4.2 kg CO₂e" />
              <InfoRow label="Repairability" value="A" />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section id="verify" className="scroll-mt-24 px-4 sm:px-6 lg:px-10 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-xl border border-[#DDE8DF] p-5 sm:p-7">
          <div className="text-center mb-5">
            <h3 className="text-xl font-black">Search Product Passport</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Enter a Passport ID to verify product authenticity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={passportId}
                onChange={(e) => setPassportId(e.target.value)}
                placeholder="Enter Passport ID, e.g. GP-9822"
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#DDE8DF] outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <button
              onClick={handleSearch}
              className="h-12 px-6 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
            >
              <VerifiedOutlinedIcon fontSize="small" />
              Verify
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="mt-4 mx-auto flex items-center justify-center gap-2 text-sm font-black text-[#1B5E20] hover:underline"
          >
            <QrCodeScannerOutlinedIcon fontSize="small" />
            Open QR Scanner
          </button>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <SectionTitle
          title="Consumer Circular Services"
          text="LOOPI helps consumers verify, repair, resell, recycle, and care for products responsibly."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ActionCard
            icon={<QrCodeScannerOutlinedIcon />}
            title="Verify Product"
            text="Check whether the product passport is authentic and trusted."
            />

            <ActionCard
            icon={<BuildOutlinedIcon />}
            title="Find Repair Centers"
            text="Discover verified repair partners for clothing restoration."
            />

            <ActionCard
            icon={<StorefrontOutlinedIcon />}
            title="Resell My Clothes"
            text="Use verified passport data to support trusted resale."
            />

            <ActionCard
            icon={<RecyclingOutlinedIcon />}
            title="Recycle Responsibly"
            text="Find recycling instructions and end-of-life guidance."
            />
        </div>
      </section>

      {/* PASSPORT PREVIEW */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="Public Product Passport Preview"
            text="Public-safe product details visible to consumers."
          />

          <div className="bg-white rounded-[28px] border border-[#DDE8DF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#CFE8D2] min-h-[280px] flex items-center justify-center">
              <div className="text-center">
                <FavoriteBorderOutlinedIcon
                  className="text-[#1B5E20]"
                  sx={{ fontSize: 72 }}
                />
                <p className="font-black mt-3">Product Image Placeholder</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge text="Verified Passport" />
                <Badge text="EU DPP Inspired" />
                <Badge text="Circular Ready" />
              </div>

              <h4 className="text-2xl font-black">
                Premium Organic Cotton Hoodie
              </h4>
              <p className="text-sm text-[#6B7280] mt-1">
                Passport ID: GP-9822
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <InfoRow label="Brand" value="LOOPI Apparel" />
                <InfoRow label="Manufacturer" value="GreenTex Manufacturing" />
                <InfoRow label="Origin" value="Sri Lanka" />
                <InfoRow
                  label="Material"
                  value="80% Organic Cotton, 20% Recycled Polyester"
                />
                <InfoRow label="Carbon Footprint" value="4.2 kg CO₂e" />
                <InfoRow label="Repairability" value="A" />
                <InfoRow label="Lifecycle Status" value="In Use" />
              </div>

              <button
                onClick={() => navigate("/consumer/passport/GP-9822")}
                className="mt-7 w-full h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
              >
                View Full Passport
                <OpenInNewOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MY CLOTHES */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-[#FFF8DC] via-[#F1F8F4] to-[#DDE8DF]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="My Clothes"
            text="Optional Consumer account feature for ownership, repair history, resale, and recycling."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <MiniCard title="Saved Clothes" value="0 Items" />
            <MiniCard title="Repair History" value="Track Services" />
            <MiniCard title="Resale Ready" value="Verify First" />
          </div>

          <div className="rounded-[28px] bg-[#1B5E20] text-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-2xl font-black">Ready to Sell Your Clothes?</h4>
              <p className="text-white/80 mt-3">
                Verify product ownership using its Digital Product Passport and
                create a trusted resale listing.
              </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleSellClothes}
                    className="h-12 px-6 rounded-xl bg-white text-[#1B5E20] font-black flex items-center justify-center gap-2 hover:bg-[#F1F8F4] transition"
                >
                    <StorefrontOutlinedIcon fontSize="small" />
                    Sell My Clothes
                </button>

                <button
                    onClick={handleViewMyClothes}
                    className="h-12 px-6 rounded-xl border border-white/30 text-white font-black hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                    View My Clothes
                </button>
                </div>

            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
              <p className="font-black">Ownership verification required</p>
              <p className="text-white/75 text-sm mt-2">
                Login is required to publish resale listings, request repairs,
                and register items for recycling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            title="Product Lifecycle Journey"
            text="Simple public view of the product journey."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <LifecycleCard
            icon={<Inventory2OutlinedIcon />}
            title="Manufactured"
            status="Completed"
            />

            <LifecycleCard
            icon={<AssignmentTurnedInOutlinedIcon />}
            title="Quality Checked"
            status="Completed"
            />

            <LifecycleCard
            icon={<LocalShippingOutlinedIcon />}
            title="Shipped"
            status="Completed"
            />

            <LifecycleCard
            icon={<RecyclingOutlinedIcon />}
            title="Recycle Ready"
            status="Available"
            />
          </div>
        </div>
      </section>

      {/* REPAIR CENTERS */}
      <section id="repair" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-10 bg-[#F1F8F4]">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            title="Find Verified Repair Centers"
            text="Discover LOOPI repair partners for clothing care."
          />

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Nearest", "Highest Rated", "Low Cost", "Verified Only"].map(
              (chip) => (
                <span
                  key={chip}
                  className="px-4 py-2 rounded-full bg-white border border-[#DDE8DF] text-sm font-bold"
                >
                  {chip}
                </span>
              )
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RepairCard
              name="Green Stitch Repair Hub"
              service="Stitching, zip repair, fabric patching"
              distance="2.4 km"
              rating="4.8"
              onBook={handleRepairRequest}
            />
            <RepairCard
              name="Circular Textile Care"
              service="Hoodie repair, color restoration"
              distance="4.1 km"
              rating="4.6"
              onBook={handleRepairRequest}
            />
            <RepairCard
              name="EcoWear Repair Point"
              service="General clothing repair"
              distance="5.8 km"
              rating="4.7"
              onBook={handleRepairRequest}
            />
          </div>
        </div>
      </section>

      {/* RESALE */}
      <section id="resale" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            title="Resale Marketplace"
            text="Verified second-hand items powered by passport transparency."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MarketCard
              title="Organic Cotton Hoodie"
              id="GP-9822"
              condition="Excellent"
              price="€42"
            />
            <MarketCard
              title="Recycled Denim Jacket"
              id="DJ-2041"
              condition="Good"
              price="€55"
            />
            <MarketCard
              title="Linen Summer Shirt"
              id="LS-7710"
              condition="Very Good"
              price="€28"
            />
          </div>
        </div>
      </section>

      {/* RECYCLE + SUSTAINABILITY */}
      <section id="recycle" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-10 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="Sustainability Snapshot"
            text="Clear sustainability indicators for public consumer understanding."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MetricCard icon={<SpaOutlinedIcon />} label="Eco Score" value="87/100" />
            <MetricCard icon={<BuildOutlinedIcon />} label="Repairability" value="A" />
            <MetricCard icon={<RecyclingOutlinedIcon />} label="Recycled Content" value="35%" />
            <MetricCard icon={<EnergySavingsLeafOutlined />} label="Carbon Footprint" value="4.2 kg CO₂e" />
            <MetricCard icon={<WaterDropOutlinedIcon />} label="Water Usage" value="Medium" />
            <MetricCard icon={<HubOutlinedIcon />} label="Circularity Level" value="High" />
          </div>
        </div>
      </section>

      {/* CARE + REPORT */}
      <section id="care" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-10 bg-[#F1F8F4]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="Care Guide"
            text="Extend product lifetime with responsible care."
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
            {["Wash Cold", "No Bleach", "Air Dry", "Repair Early", "Store Dry"].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-[#DDE8DF] p-5 text-center shadow-sm"
                >
                  <LocalLaundryServiceOutlinedIcon className="text-[#1B5E20]" />
                  <p className="text-sm font-black mt-2">{item}</p>
                </div>
              )
            )}
          </div>

          <div className="max-w-xl mx-auto rounded-[28px] bg-[#FFF8DC] border border-[#F59E0B]/40 p-7 text-center">
            <ReportProblemOutlinedIcon
              className="text-[#F59E0B]"
              sx={{ fontSize: 42 }}
            />
            <h4 className="font-black text-xl mt-2">Report Product Issue</h4>
            <p className="text-sm text-[#6B7280] mt-2">
              Report fake product suspicion, incorrect material data, or broken QR codes.
            </p>
            <button
            onClick={handleReportIssue}
            className="mt-5 h-11 px-6 rounded-xl bg-[#F59E0B] text-white font-black hover:bg-[#D97706] transition"
            >
            Report Issue
            </button>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-14 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-black">Trusted Circular Fashion Data</h3>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge text="EU DPP Inspired" />
            <Badge text="ESPR-Aligned Concept" />
            <Badge text="Public Transparency" />
            <Badge text="Circular Economy Focused" />
            <Badge text="Verified Lifecycle Data" />
          </div>

          <p className="text-sm text-[#6B7280] mt-6 leading-relaxed">
            LOOPI is designed as a Digital Product Passport concept to support
            product transparency, sustainability, repair, resale, and recycling
            across the fashion lifecycle.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#062414] text-white px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            
            <div className="h-12 w-12 rounded-xl bg-[#1B5E20] flex items-center justify-center p-1 shadow-sm">
            <img
                src={logo}
                alt="LOOPI"
                className="h-full w-full object-contain"
            />
            </div>
            <p className="text-white/60 text-sm mt-4">
              Digital Product Passport platform for circular fashion.
            </p>
          </div>

          <FooterCol
            title="Platform"
            items={["Verify Passport", "Repair Centers", "Resale Market"]}
          />
          <FooterCol
            title="Circularity"
            items={["Recycle Guide", "Care Guide", "Sustainability"]}
          />
          <FooterCol title="Support" items={["Help", "Privacy", "Report Issue"]} />
        </div>

        <p className="text-center text-white/40 text-xs mt-10">
          © 2026 LOOPI Digital Product Passport Platform
        </p>
      </footer>

      {/* QR SCANNER MODAL */}
      {showScanner && (
        <ModalShell onClose={() => setShowScanner(false)}>
          <div className="bg-black text-white min-h-[70vh] rounded-[28px] overflow-hidden relative">
            <button
              onClick={() => setShowScanner(false)}
              className="absolute top-4 left-4 h-10 px-4 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-2 text-sm font-black"
            >
              <ArrowBackOutlinedIcon fontSize="small" />
              Back
            </button>

            <button
              onClick={() => setShowScanner(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <CloseOutlinedIcon />
            </button>

            <div className="p-6 pt-20 sm:pt-6">
              <h3 className="text-2xl font-black">Scan QR Code</h3>
              <p className="text-white/60 mt-1">
                Position the QR code within the frame.
              </p>
            </div>

            <div className="h-[420px] bg-gradient-to-br from-[#001807] to-[#062414] flex flex-col items-center justify-center">
              <QrCodeScannerOutlinedIcon
                sx={{ fontSize: 90 }}
                className="text-white/40"
              />
              <p className="mt-5 font-bold text-white/70">Camera access required</p>

              <button className="mt-6 h-12 px-8 rounded-xl bg-[#1B5E20] text-white font-black">
                Enable Camera
              </button>
            </div>

            <div className="p-5 text-center">
              <p className="inline-block rounded-xl bg-white/10 px-4 py-3 text-sm text-white/70">
                Tip: Hold your device steady and ensure good lighting for best results.
              </p>
            </div>
          </div>
        </ModalShell>
      )}

      {/* LOGIN REQUIRED MODAL */}
{showLoginRequired && (
  <ModalShell onClose={() => setShowLoginRequired(false)}>
    <div className="bg-white rounded-[28px] p-7 max-w-md mx-auto shadow-[0_28px_80px_rgba(0,0,0,0.28)] relative border border-white">
      <button
        onClick={() => setShowLoginRequired(false)}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center hover:bg-[#E8F5E9] transition"
      >
        <CloseOutlinedIcon fontSize="small" />
      </button>

      <button
        onClick={() => setShowLoginRequired(false)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-black text-[#1B5E20]"
      >
        <ArrowBackOutlinedIcon fontSize="small" />
        Back to Consumer Portal
      </button>

      <div className="h-14 w-14 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-sm">
        <ShieldOutlinedIcon />
      </div>

      <h3 className="text-2xl font-black mt-5 text-[#102A1A]">
        Login Required
      </h3>

      <p className="text-[#6B7280] mt-3 leading-relaxed">
        Please login or create a Consumer account to continue this action.
        Resale, repair requests, recycling registration, and ownership tracking
        require authentication.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
        <button
        onClick={() => {
            setShowLoginRequired(false);
            sessionStorage.setItem("consumerReturnPath", "/consumer");
            navigate("/");
        }}
        className="h-12 rounded-xl border border-[#1B5E20] text-[#1B5E20] font-black flex items-center justify-center gap-2 hover:bg-[#E8F5E9] transition"
        >
        <LoginOutlinedIcon fontSize="small" />
        Login
        </button>

        <button
        onClick={() => {
            setShowLoginRequired(false);
            sessionStorage.setItem("consumerReturnPath", "/consumer");
            navigate("/register");
        }}
        className="h-12 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2 hover:bg-[#0F3D1E] transition"
        >
        <PersonAddAltOutlinedIcon fontSize="small" />
        Register
        </button>
      </div>
    </div>
  </ModalShell>
)}

      {showSellModal && (
  <SellClothesModal onClose={() => setShowSellModal(false)} />
)}

{showRepairModal && (
  <RepairRequestModal onClose={() => setShowRepairModal(false)} />
)}

{showRecycleModal && (
  <RecyclingRequestModal onClose={() => setShowRecycleModal(false)} />
)}

{showReportModal && (
  <ReportIssueModal onClose={() => setShowReportModal(false)} />
)}

{showMyClothesModal && (
  <ModalShell onClose={() => setShowMyClothesModal(false)}>
    <div className="relative w-full max-w-7xl mx-auto bg-white rounded-[28px] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto">
      <button
        onClick={() => setShowMyClothesModal(false)}
        className="absolute top-4 right-4 z-[100] h-10 w-10 rounded-full bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center hover:bg-[#E8F5E9] transition shadow-sm"
      >
        <CloseOutlinedIcon />
      </button>

      <ConsumerMyClothesModal />
    </div>
  </ModalShell>
)}

    </div>
  );
}

/* COMPONENTS */

function SectionTitle({ title, text }: any) {
  return (
    <div className="text-center mb-8">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-[#6B7280] mt-2 max-w-2xl mx-auto">{text}</p>
    </div>
  );
}

function ActionCard({ icon, title, text }: any) {
  return (
    <div className="group bg-white rounded-[24px] border border-[#DDE8DF] p-6 shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-[0_8px_20px_rgba(27,94,32,0.08)] group-hover:bg-[#F1F8F4] transition">
        {icon}
      </div>

      <h4 className="font-black mt-5">{title}</h4>

      <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
        {text}
      </p>

      <p className="text-xs font-black text-[#1B5E20] mt-4 flex items-center gap-1">
        Learn more
        <KeyboardArrowRightOutlinedIcon fontSize="small" />
      </p>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#EEF2F0] pb-2 last:border-b-0">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}

function Badge({ text }: any) {
  return (
    <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-black border border-[#CFE8D2]">
      {text}
    </span>
  );
}

function MiniCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-5 shadow-sm">
      <p className="text-sm text-[#6B7280] font-bold">{title}</p>
      <p className="text-lg font-black mt-1">{value}</p>
    </div>
  );
}

function LifecycleCard({ icon, title, status }: any) {
  return (
    <div className="group bg-white rounded-[24px] border border-[#DDE8DF] p-6 text-center shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="mx-auto h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-[0_8px_20px_rgba(27,94,32,0.08)] group-hover:bg-[#F1F8F4] transition">
        {icon}
      </div>

      <h4 className="font-black mt-4">{title}</h4>

      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white border border-[#1B5E20]/20 text-[#1B5E20] text-xs font-black">
        {status}
      </span>
    </div>
  );
}

function RepairCard({ name, service, distance, rating, onBook }: any) {
  return (
    <div className="bg-white rounded-[24px] border border-[#DDE8DF] p-6 shadow-sm">
      <div className="flex justify-between items-start gap-3">
        <h4 className="font-black">{name}</h4>
        <Badge text="Verified" />
      </div>

      <p className="text-sm text-[#6B7280] mt-3">{service}</p>

      <div className="flex justify-between mt-5 text-sm font-bold">
        <span className="flex items-center gap-1">
          <TravelExploreOutlinedIcon fontSize="small" className="text-[#1B5E20]" />
          {distance}
        </span>
        <span className="flex items-center gap-1">
          <StarBorderOutlinedIcon fontSize="small" className="text-[#F59E0B]" />
          {rating}
        </span>
      </div>

      <button
        onClick={onBook}
        className="mt-5 w-full h-11 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition"
      >
        Book Repair
      </button>
    </div>
  );
}

function MarketCard({ title, id, condition, price }: any) {
  return (
    <div className="bg-white rounded-[24px] border border-[#DDE8DF] overflow-hidden shadow-sm">
      <div className="h-48 bg-[#E8F5E9] flex items-center justify-center">
        <StorefrontOutlinedIcon sx={{ fontSize: 60 }} className="text-[#1B5E20]" />
      </div>

      <div className="p-5">
        <div className="flex justify-between gap-3">
          <h4 className="font-black">{title}</h4>
          <Badge text="Verified" />
        </div>

        <p className="text-sm text-[#6B7280] mt-1">Passport ID: {id}</p>
        <p className="text-sm font-bold mt-3">Condition: {condition}</p>

        <div className="flex justify-between items-center mt-5">
          <p className="text-xl font-black text-[#1B5E20]">{price}</p>
          <button className="px-4 py-2 rounded-xl bg-[#1B5E20] text-white text-sm font-black flex items-center gap-1">
            View <OpenInNewOutlinedIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: any) {
  return (
    <div className="group bg-white rounded-[24px] border border-[#DDE8DF] p-6 text-center shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="mx-auto h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-[0_8px_20px_rgba(27,94,32,0.08)] group-hover:bg-[#F1F8F4] transition">
        {icon}
      </div>

      <p className="text-sm text-[#6B7280] font-bold mt-4">
        {label}
      </p>

      <p className="text-xl font-black text-[#1B5E20] mt-1">
        {value}
      </p>
    </div>
  );
}

function FooterCol({ title, items }: any) {
  return (
    <div>
      <h4 className="font-black mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item: string) => (
          <p key={item} className="text-white/60 text-sm">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ModalShell({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[99999] bg-black/45 p-4 overflow-y-auto">
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