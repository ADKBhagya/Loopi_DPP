import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";


import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";

function assetUrl(value?: string) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/.test(value)) return value;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "") || window.location.origin;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

function passportIdFor(garment: any) {
  return (
    garment?.sku ||
    garment?.batchNumber ||
    `GP-${String(garment?._id || "").slice(-6).toUpperCase()}`
  );
}

function passportFromGarment(garment: any) {
  const materials = Array.isArray(garment?.materials)
    ? garment.materials.join(", ")
    : garment?.material;

  return {
    id: passportIdFor(garment),
    garmentId: garment?._id,
    garment: garment?.productName || "Unnamed garment",
    brand:
      garment?.createdBy?.organization ||
      garment?.currentOwnerName ||
      garment?.manufacturingCountry ||
      garment?.location ||
      "LOOPI",
    material: materials || "Material pending",
    materials: garment?.materials || [],
    grade: garment?.status === "certified" ? "Grade A" : "Grade B+",
    repairs: "0 services",
    co2: garment?.carbon ? `${garment.carbon} kg` : "N/A",
    water: garment?.water ? `${garment.water}L` : "N/A",
    repairStatus: "No repairs",
    repairCount: 0,
    verified: garment?.status === "certified",
    imageUrl: garment?.imageUrl,
    status: garment?.status,
    location: garment?.location || "N/A",
    productionDate: garment?.productionDate?.slice?.(0, 10),
    batchNumber: garment?.batchNumber,
    sku: garment?.sku,
    hash: "",
    hashShort: "Pending",
  };
}

export default function DPPLookup() {

  const [search, setSearch] = useState("");

  const [showBlockchainModal, setShowBlockchainModal] =
  useState(false);

  const [showRepairJourney, setShowRepairJourney] =
  useState(false);

const [showRecycleJourney, setShowRecycleJourney] =
  useState(false);

const [repairTab, setRepairTab] =
  useState("repair");

const [recycleTab, setRecycleTab] =
  useState("protocol");

const [recycleStarted, setRecycleStarted] =
  useState(false);

  const [showVerifiedModal, setShowVerifiedModal] =
  useState(false);

  const [loading, setLoading] = useState(false);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [lookupError, setLookupError] = useState("");

  const [showPassportModal, setShowPassportModal] =
  useState(false);

    const [passportTab, setPassportTab] =
    useState("overview");

  const [selectedPassport, setSelectedPassport] =
    useState<any>(null);

  const [passports, setPassports] = useState<any[]>([]);

useEffect(() => {
  let active = true;

  const loadPassports = async () => {
    setDirectoryLoading(true);
    setLookupError("");

    try {
      const data = await apiFetch<any>("/repair-center/passports");
      if (!active) return;
      setPassports(data.passports || []);
    } catch (error) {
      try {
        const garments = await apiFetch<any[]>("/garments");
        if (!active) return;
        setPassports((Array.isArray(garments) ? garments : []).map(passportFromGarment));
        setLookupError("");
      } catch (fallbackError) {
        console.error("Failed to load passport directory", error, fallbackError);
        if (!active) return;
        setPassports([]);
        setLookupError("Failed to load passport directory");
      }
    } finally {
      if (active) setDirectoryLoading(false);
    }
  };

  loadPassports();

  return () => {
    active = false;
  };
}, []);

/* DIRECTORY SHOULD ALWAYS SHOW ALL */
const filteredPassports = passports;

const handleSearch = async () => {

  if (!search.trim()) {
    setSelectedPassport(null);
    return;
  }

  setLoading(true);
  setLookupError("");

  try {
    const found = await apiFetch<any>(`/repair-center/passport/${search.trim()}`);
    setPassports((prev) =>
      prev.some((item) => item.id === found.id) ? prev : [found, ...prev]
    );
    setSelectedPassport(found);
  } catch (error) {
    setLookupError(error instanceof Error ? error.message : "Passport lookup failed");
    setSelectedPassport(null);
  } finally {
    setLoading(false);
  }


};

  return (
    <div className="space-y-5 sm:space-y-6 pb-10">

      {/* SEARCH HERO */}
      <section
        className="
          rounded-[28px]

          border border-[#E7E7E7]

          bg-white

          shadow-[0_10px_30px_rgba(0,0,0,0.03)]

          p-6 sm:p-10
        "
      >

        <div className="flex flex-col items-center text-center">

          <div
            className="
              w-16 h-16

              rounded-[20px]

              bg-[#EEF4FF]

              border border-[#DCE7FF]

              text-[#2563EB]

              flex items-center justify-center
            "
          >
            <Inventory2OutlinedIcon
              style={{
                fontSize: 25,
              }}
            />
          </div>

          <h1
            className="
              mt-5

              text-[28px]
              sm:text-[32px]

              font-black

              text-[#111827]
            "
          >
            DPP Lookup
          </h1>

          <p
            className="
              mt-3

              max-w-[620px]

              text-sm sm:text-[15px]

              leading-relaxed

              text-[#7B8190]
            "
          >
            Enter a Passport ID or product name to retrieve its
            Digital Product Passport from the blockchain.
          </p>

          {/* SEARCH */}
          <div
            className="
              mt-7

              w-full
              max-w-[640px]

              flex flex-col sm:flex-row
              items-stretch

              gap-3
            "
          >

            <div className="relative flex-1">

              <SearchRoundedIcon
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#9CA3AF]
                "
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="GP-9821 or product name..."
                className="
                  w-full
                  h-[45px]

                  rounded-2xl

                  border border-[#E5E7EB]

                  bg-[#FAFAFA]

                  pl-12 pr-4

                  text-sm

                  outline-none

                  focus:border-[#166B2D]
                "
              />

            </div>

            <button
              onClick={handleSearch}
              className="
                h-[45px]

                px-7

                rounded-2xl

                bg-[#166B2D]
                text-white

                font-black
                text-sm

                tracking-[0.08em]

                flex items-center justify-center
                gap-2

                hover:bg-[#125625]

                transition-all
              "
            >

              {loading ? (
                <>
                  <div
                    className="
                      w-4 h-4

                      rounded-full

                      border-2 border-white/30
                      border-t-white

                      animate-spin
                    "
                  />
                </>
              ) : (
                <>
                  <SearchRoundedIcon
                    style={{
                      fontSize: 17,
                    }}
                  />

                  SEARCH
                </>
              )}

            </button>

          </div>

          {lookupError && (
            <p className="mt-4 text-sm font-semibold text-[#DC2626]">
              {lookupError}
            </p>
          )}

        </div>

      </section>

      {/* RESULT CARD */}
      {selectedPassport && (
        <section
          className="
            rounded-[28px]

            border border-[#DCEFD9]

            bg-white

            overflow-hidden

            shadow-[0_12px_35px_rgba(0,0,0,0.04)]
          "
        >

          {/* HEADER */}
          <div
            className="
              px-5 sm:px-6
              py-5

              border-b border-[#EAF3E8]

              bg-[#F7FCF8]

              flex flex-col sm:flex-row
              sm:items-center
              sm:justify-between

              gap-4
            "
          >

            <div className="flex items-center gap-3">

              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />

              <h2
                className="
                  text-[16px]
                  sm:text-[20px]

                  font-black

                  text-[#111827]
                "
              >
                {selectedPassport.id} —{" "}
                {selectedPassport.garment}
              </h2>

            </div>

            <div
              className={`
                h-9 px-4 rounded-xl text-[11px] font-black tracking-[0.10em]
                flex items-center justify-center w-fit border
                ${
                  selectedPassport.verified
                    ? "bg-[#EEF9F1] border-[#D5F1DB] text-[#16A34A]"
                    : "bg-[#FFF7ED] border-[#FED7AA] text-[#EA580C]"
                }
              `}
            >
              {selectedPassport.verified ? "VERIFIED" : "PENDING REVIEW"}
            </div>

          </div>

          {/* CONTENT */}
          <div className="p-5 sm:p-6">

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3

                gap-4
              "
            >

              <PassportInfoCard
                label="BRAND"
                value={selectedPassport.brand}
              />

              <PassportInfoCard
                label="MATERIAL"
                value={selectedPassport.material}
              />

              <PassportInfoCard
                label="GRADE"
                value={selectedPassport.grade}
              />

              <PassportInfoCard
                label="REPAIRS"
                value={selectedPassport.repairs}
              />

              <PassportInfoCard
                label="CO₂ IMPACT"
                value={selectedPassport.co2}
              />

              <PassportInfoCard
                label="WATER USAGE"
                value={selectedPassport.water}
              />

            </div>

            {/* ACTIONS */}
            <div
              className="
                mt-5

                flex flex-wrap
                items-center

                gap-3
              "
            >

              <button
                onClick={() => {

                    if (selectedPassport) {

                    setPassportTab("overview");

                    setShowPassportModal(true);

                    }

                }}
                className="
                    h-[45px]
                    px-5

                  rounded-2xl

                  bg-[#166B2D]
                  text-white

                  text-sm
                  font-black

                  tracking-[0.08em]

                  flex items-center gap-2

                  hover:bg-[#125625]

                  transition-all
                "
              >

                <VisibilityOutlinedIcon
                  style={{
                    fontSize: 18,
                  }}
                />

                VIEW FULL PASSPORT

              </button>

              <button
                className="
                  h-[45px]
                  px-4

                  rounded-2xl

                  border border-[#E5E7EB]

                  bg-white

                  text-sm
                  font-bold

                  text-[#4B5563]

                  flex items-center gap-2

                  hover:bg-[#FAFAFA]

                  transition-all
                "
              >

                <BuildOutlinedIcon
                  style={{
                    fontSize: 18,
                  }}
                />

                Log Repair

              </button>

              <button
                className="
                  w-[45px]
                  h-[45px]

                  rounded-2xl

                  border border-[#E5E7EB]

                  bg-white

                  hover:bg-[#FAFAFA]

                  flex items-center justify-center
                "
              >
                <ArrowOutwardRoundedIcon
                  style={{
                    fontSize: 20,
                    color: "#6B7280",
                  }}
                />
              </button>

            </div>

          </div>

        </section>
      )}

      {/* DIRECTORY */}
      <section
        className="
          rounded-[28px]

          border border-[#E7E7E7]

          bg-white

          overflow-hidden

          shadow-[0_10px_30px_rgba(0,0,0,0.03)]
        "
      >

        {/* HEADER */}
        <div
          className="
            h-[64px]

            px-5 sm:px-6

            border-b border-[#F2F2F2]

            flex items-center justify-between
          "
        >

          <h2
            className="
              text-[20px]

              font-black

              text-[#111827]
            "
          >
            Passport Directory
          </h2>

          <p
            className="
              text-[11px]

              tracking-[0.12em]

              font-black

              text-[#9CA3AF]
            "
          >
            {directoryLoading ? "LOADING" : `${filteredPassports.length} LINKED`}
          </p>

        </div>

        {/* LIST */}
        <div>

          {directoryLoading && (
            <div className="px-5 sm:px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
              Loading passport directory...
            </div>
          )}

          {!directoryLoading && filteredPassports.length === 0 && (
            <div className="px-5 sm:px-6 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
              No digital passports found
            </div>
          )}

          {!directoryLoading && filteredPassports.map((item, index) => (

            <button
              key={item.id}
              onClick={() =>
                setSelectedPassport(item)
              }
              className={`
                w-full

                px-5 sm:px-6
                py-5

                flex items-center justify-between

                hover:bg-[#FAFAFA]

                transition-all

                ${
                  index !==
                  filteredPassports.length - 1
                    ? "border-b border-[#F4F4F5]"
                    : ""
                }
              `}
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-11 h-11

                    rounded-2xl

                    bg-[#EEF7F1]

                    text-[#166B2D]

                    flex items-center justify-center
                  "
                >
                  <Inventory2OutlinedIcon
                    style={{
                      fontSize: 20,
                    }}
                  />
                </div>

                <div className="text-left">

                  <div className="flex items-center gap-2 flex-wrap">

                    <h3
                      className="
                        text-sm
                        font-black
                        text-[#111827]
                      "
                    >
                      {item.id}
                    </h3>

                    <span
                      className="
                        h-5
                        px-2

                        rounded-md

                        bg-[#EEF7F1]

                        text-[#16A34A]

                        text-[10px]
                        font-black

                        flex items-center
                      "
                    >
                      {item.grade}
                    </span>

                  </div>

                  <p
                    className="
                      mt-1

                      text-[13px]

                      text-[#9CA3AF]
                    "
                  >
                    {item.garment} · {item.brand}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p
                  className="
                    text-sm
                    font-black
                    text-[#6B7280]
                  "
                >
                  {item.repairCount} repairs
                </p>

                <p
                  className="
                    mt-1

                    text-[12px]

                    text-[#A1A1AA]
                  "
                >
                  {item.repairStatus}
                </p>

              </div>

            </button>

          ))}

        </div>

      </section>

{/* ========================= */
/* FULL PASSPORT MODAL */
/* ========================= */}

{showPassportModal && selectedPassport && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() =>
        setShowPassportModal(false)
      }
      className="
        fixed inset-0
        bg-black/50
        backdrop-blur-[6px]
        z-[9998]
      "
    />

    {/* PHONE */}
    <div
      className="
        fixed inset-0
        z-[9999]

        flex items-center justify-center

        p-4
      "
    >

      <div
        className="
          w-[338px]

          h-[92vh]

          rounded-[42px]

          overflow-hidden

          bg-[#F7F8FA]

          shadow-[0_45px_120px_rgba(0,0,0,0.35)]

          relative

          flex flex-col
        "
      >

        {/* TOP HEADER */}
        <div
          className="
            h-[52px]

            bg-white

            px-4

            flex items-center justify-between

            border-b border-[#F1F1F1]

            shrink-0
          "
        >

          {/* LEFT */}
          <button
            onClick={() =>
              setShowPassportModal(false)
            }
            className="
              w-8 h-8

              rounded-full

              flex items-center justify-center
            "
          >
            <ArrowOutwardRoundedIcon
              style={{
                transform: "rotate(180deg)",
                fontSize: 18,
                color: "#9CA3AF",
              }}
            />
          </button>

          {/* CENTER */}
          <div className="text-center">

            <h2
              className="
                text-[11px]

                font-black

                tracking-[0.08em]

                text-[#111827]
              "
            >
              DIGITAL PRODUCT PASSPORT
            </h2>

            <p
              className="
                text-[8px]

                text-[#9CA3AF]

                mt-[1px]
              "
            >
              ID · {selectedPassport.id}
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            <FavoriteBorderRoundedIcon
              style={{
                fontSize: 17,
                color: "#9CA3AF",
              }}
            />

            <IosShareRoundedIcon
              style={{
                fontSize: 17,
                color: "#9CA3AF",
              }}
            />

          </div>

        </div>

        {/* SCROLL BODY */}
        <div className="flex-1 overflow-y-auto">

          {/* PRODUCT IMAGE */}
          <div className="relative">

            <img
              src={
                assetUrl(selectedPassport.imageUrl) ||
                "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop"
              }
              alt={selectedPassport.garment}
              className="
                w-full
                h-[390px]

                object-cover
              "
            />

            {/* FLOAT ICONS */}
            <div
              className="
                absolute
                top-5 left-4

                flex flex-col gap-3
              "
            >

            {/* VERIFIED */}
            <button
            onClick={() =>
                setShowVerifiedModal(true)
            }
            className="
                w-[46px]
                h-[56px]

                rounded-[16px]

                bg-white

                shadow-[0_10px_25px_rgba(0,0,0,0.12)]

                flex flex-col
                items-center justify-center

                active:scale-[0.96]

                transition-all
            "
            >

            <VerifiedUserRoundedIcon
                style={{
                fontSize: 20,
                color: "#166B2D",
                }}
            />

            <p
                className="
                mt-1

                text-[6px]

                font-black

                text-[#166B2D]
                "
            >
                VERIFIED
            </p>

            </button>

              {/* ECO */}
              <div
                className="
                  w-[46px]
                  h-[56px]

                  rounded-[16px]

                  bg-[#166B2D]

                  shadow-[0_12px_30px_rgba(22,107,45,0.35)]

                  flex flex-col
                  items-center justify-center
                "
              >

                <SpaOutlinedIcon
                  style={{
                    fontSize: 20,
                    color: "white",
                  }}
                />

                <p
                  className="
                    mt-1

                    text-[6px]

                    font-black

                    text-white
                  "
                >
                  GOLD TIER
                </p>

              </div>

            </div>

          </div>

          {/* CONTENT CARD */}
          <div
            className="
              relative

              -mt-8

              bg-[#F7F8FA]

              rounded-t-[34px]

              px-6
              pt-5
              pb-8
            "
          >

            {/* TITLE */}
            <h1
              className="
                text-[18px]

                leading-tight

                font-black

                text-[#111827]
              "
            >
              {selectedPassport.garment}
            </h1>

            {/* META */}
            <div
              className="
                mt-2

                flex items-center
                gap-2
                flex-wrap
              "
            >

              <div
                className="
                  h-5
                  px-2

                  rounded-md

                  bg-[#EAF7EE]

                  text-[#16A34A]

                  text-[8px]

                  font-black

                  tracking-[0.08em]

                  flex items-center
                "
              >
                LOOPI HERITAGE
              </div>

              <div
                className="
                  flex items-center gap-1
                "
              >

                <LocationOnOutlinedIcon
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                  }}
                />

                <p
                  className="
                    text-[9px]

                    text-[#9CA3AF]
                  "
                >
                  Stockholm, Sweden
                </p>

              </div>

            </div>

            {/* METRIC CARDS */}
            <div
              className="
                mt-6

                grid grid-cols-2

                gap-3
              "
            >

              {/* CARBON */}
              <div
                className="
                  rounded-[22px]

                  bg-[#F3FBF5]

                  border border-[#DCEFE1]

                  p-4

                  flex flex-col
                  items-center
                "
              >

                <SpaOutlinedIcon
                  style={{
                    color: "#16A34A",
                    fontSize: 22,
                  }}
                />

                <h2
                  className="
                    mt-4

                    text-[34px]

                    leading-none

                    font-black

                    text-[#166B2D]
                  "
                >
                  {selectedPassport.co2}
                </h2>

                <p
                  className="
                    mt-2

                    text-[8px]

                    tracking-[0.12em]

                    font-black

                    text-[#16A34A]
                  "
                >
                  CARBON FOOTPRINT
                </p>

              </div>

              {/* WATER */}
              <div
                className="
                  rounded-[22px]

                  bg-[#F5F8FF]

                  border border-[#DCE7FF]

                  p-4

                  flex flex-col
                  items-center
                "
              >

                <WaterDropOutlinedIcon
                  style={{
                    color: "#2563EB",
                    fontSize: 22,
                  }}
                />

                <h2
                  className="
                    mt-4

                    text-[34px]

                    leading-none

                    font-black

                    text-[#2563EB]
                  "
                >
                  {selectedPassport.water}
                </h2>

                <p
                  className="
                    mt-2

                    text-[8px]

                    tracking-[0.12em]

                    font-black

                    text-[#2563EB]
                  "
                >
                  WATER USED
                </p>

              </div>

            </div>

            {/* TABS */}
            <div
              className="
                mt-7

                flex items-center gap-6

                border-b border-[#E8E8E8]
              "
            >

              {[
                "overview",
                "materials",
                "lifecycle",
              ].map((tab) => (

                <button
                  key={tab}
                  onClick={() =>
                    setPassportTab(tab)
                  }
                  className={`
                    pb-3

                    text-[10px]

                    tracking-[0.12em]

                    font-black

                    border-b-2

                    transition-all

                    ${
                      passportTab === tab
                        ? "border-[#166B2D] text-[#111827]"
                        : "border-transparent text-[#A1A1AA]"
                    }
                  `}
                >
                  {tab.toUpperCase()}
                </button>

              ))}

            </div>

            {/* ========================= */}
            {/* OVERVIEW TAB */}
            {/* ========================= */}
            {passportTab === "overview" && (

              <div className="mt-6">

                <p
                  className="
                    text-[12px]

                    leading-[2]

                    text-[#4B5563]
                  "
                >
                  Expertly crafted from sustainable
                  materials, this blazer represents
                  a new era of circular fashion.
                  Every thread is traceable back to
                  its origin through the LOOPI
                  blockchain protocol.
                </p>

                {/* SERVICE HISTORY */}
                <div className="mt-7">

                  <p
                    className="
                      text-[9px]

                      tracking-[0.14em]

                      font-black

                      text-[#A1A1AA]

                      mb-3
                    "
                  >
                    SERVICE HISTORY
                  </p>

                    <button
                    onClick={() =>
                        setShowRepairJourney(true)
                    }
                    className="
                        w-full

                        rounded-[22px]

                        bg-white

                        border border-[#ECECEC]

                        p-4

                        flex items-center justify-between

                        hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]

                        transition-all
                    "
                    >

                    <div className="flex gap-3">

                      <div
                        className="
                          w-10 h-10

                          rounded-xl

                          bg-[#EEF7F1]

                          flex items-center justify-center
                        "
                      >

                        <BuildOutlinedIcon
                          style={{
                            fontSize: 17,
                            color: "#166B2D",
                          }}
                        />

                      </div>

                      <div>

                        <h3
                          className="
                            text-[12px]

                            font-black

                            text-[#111827]
                          "
                        >
                          Lining Repair
                        </h3>

                        <p
                          className="
                            mt-1

                            text-[10px]

                            text-[#9CA3AF]
                          "
                        >
                          Sept 12, 2025 · Berlin Eco-Hub
                        </p>

                      </div>

                    </div>

                    <ArrowOutwardRoundedIcon
                        style={{
                        color: "#9CA3AF",
                        fontSize: 16,
                        }}
                    />

                    </button>

                </div>

                {/* END LIFE */}
                                <button
                onClick={() =>
                    setShowRecycleJourney(true)
                }
                className="
                    mt-5

                    w-full

                    rounded-[24px]

                    bg-[#EEF7F1]

                    border border-[#DDEFE2]

                    p-4

                    flex items-center justify-between

                    hover:shadow-[0_12px_35px_rgba(22,107,45,0.12)]

                    transition-all
                "
                >

                <div className="flex gap-3">

                    <div
                    className="
                        w-11 h-11

                        rounded-2xl

                        bg-[#166B2D]

                        text-white

                        flex items-center justify-center
                    "
                    >
                    <RecyclingRoundedIcon
                        style={{
                        fontSize: 18,
                        }}
                    />
                    </div>

                    <div className="text-left">

                    <h3
                        className="
                        text-[11px]
                        font-black
                        text-[#111827]
                        "
                    >
                        END-OF-LIFE PROTOCOL
                    </h3>

                    <p
                        className="
                        mt-1

                        text-[9px]

                        tracking-[0.10em]

                        font-black

                        text-[#16A34A]
                        "
                    >
                        READY FOR FIBER-RECYCLING
                    </p>

                    </div>

                </div>

                <ArrowOutwardRoundedIcon
                    style={{
                    color: "#166B2D",
                    fontSize: 18,
                    }}
                />

                </button>

              </div>

            )}

            {/* ========================= */}
            {/* MATERIALS TAB */}
            {/* ========================= */}
            {passportTab === "materials" && (

              <div className="mt-6">

                <p
                  className="
                    text-[9px]

                    tracking-[0.12em]

                    font-black

                    text-[#A1A1AA]

                    mb-5
                  "
                >
                  MATERIAL BREAKDOWN
                </p>

                <div className="space-y-6">

                  <MaterialProgress
                    title="Wool"
                    percent="70%"
                    width="70%"
                    source="Post-consumer garments"
                  />

                  <MaterialProgress
                    title="PET"
                    percent="25%"
                    width="25%"
                    source="Ocean-bound plastic"
                  />

                  <MaterialProgress
                    title="Elastane"
                    percent="5%"
                    width="5%"
                    source="Industrial waste"
                  />

                </div>

                {/* INFO */}
                <div
                  className="
                    mt-7

                    rounded-[24px]

                    bg-[#EEF4FF]

                    border border-[#DCE7FF]

                    p-4

                    flex gap-3
                  "
                >

                  <InfoOutlinedIcon
                    style={{
                      color: "#2563EB",
                      fontSize: 16,
                      marginTop: 1,
                    }}
                  />

                  <p
                    className="
                      text-[11px]

                      leading-[1.9]

                      text-[#2563EB]
                    "
                  >
                    All synthetic components are
                    100% chemically recyclable.
                    LOOPI guarantees zero-landfill
                    processing at authorized centers.
                  </p>

                </div>

              </div>

            )}

            {/* ========================= */}
            {/* LIFECYCLE TAB */}
            {/* ========================= */}
            {passportTab === "lifecycle" && (

              <div className="mt-6">

                <div className="relative">

                  {/* LINE */}
                  <div
                    className="
                      absolute
                      left-[15px]
                      top-0
                      bottom-0

                      w-[2px]

                      bg-[#E5E7EB]
                    "
                  />

                  <div className="space-y-6">

                    {[
                      {
                        date: "2024-03-15",
                        title: "Manufacturing",
                        location: "Stockholm, SE",
                        icon: (
                          <Inventory2OutlinedIcon
                            style={{
                              fontSize: 16,
                            }}
                          />
                        ),
                        active: true,
                      },

                      {
                        date: "MAR 16, 2024",
                        title: "Quality Audit",
                        location: "Stockholm, SE",
                        icon: (
                          <VerifiedRoundedIcon
                            style={{
                              fontSize: 16,
                            }}
                          />
                        ),
                        active: true,
                      },

                      {
                        date: "MAR 18, 2024",
                        title: "Logistics",
                        location: "Transit (Road)",
                        icon: (
                          <PublicRoundedIcon
                            style={{
                              fontSize: 16,
                            }}
                          />
                        ),
                        active: false,
                      },

                      {
                        date: "MAR 20, 2024",
                        title: "Retail",
                        location: "Berlin Store",
                        icon: (
                          <VisibilityOutlinedIcon
                            style={{
                              fontSize: 16,
                            }}
                          />
                        ),
                        active: false,
                      },
                    ].map((item, index) => (

                      <div
                        key={index}
                        className="
                          relative

                          flex gap-4
                        "
                      >

                        {/* DOT */}
                        <div
                          className={`
                            relative z-10

                            w-8 h-8

                            rounded-full

                            border-4

                            flex items-center justify-center

                            ${
                              item.active
                                ? "bg-[#EAF7EE] border-[#CBEBD4]"
                                : "bg-[#F3F4F6] border-[#E5E7EB]"
                            }
                          `}
                        >

                          <div
                            className={`
                              w-2 h-2 rounded-full

                              ${
                                item.active
                                  ? "bg-[#166B2D]"
                                  : "bg-[#D1D5DB]"
                              }
                            `}
                          />

                        </div>

                        {/* CARD */}
                        <div
                          className="
                            flex-1

                            rounded-[24px]

                            bg-white

                            border border-[#ECECEC]

                            px-4 py-4
                          "
                        >

                          <div className="flex items-start justify-between">

                            <div>

                              <p
                                className="
                                  text-[9px]

                                  font-black

                                  tracking-[0.10em]

                                  text-[#A1A1AA]
                                "
                              >
                                {item.date}
                              </p>

                              <h3
                                className="
                                  mt-3

                                  text-[15px]

                                  font-black

                                  text-[#111827]
                                "
                              >
                                {item.title}
                              </h3>

                              <p
                                className="
                                  mt-1

                                  text-[11px]

                                  text-[#9CA3AF]
                                "
                              >
                                {item.location}
                              </p>

                            </div>

                            <div
                              className={`
                                ${
                                  item.active
                                    ? "text-[#166B2D]"
                                    : "text-[#9CA3AF]"
                                }
                              `}
                            >
                              {item.icon}
                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

                {/* FOOTER */}
                <button
                onClick={() =>
                    setShowBlockchainModal(true)
                }
                className="
                    mt-8

                    w-full

                    flex items-center justify-center
                    gap-2

                    text-[10px]

                    tracking-[0.12em]

                    font-black

                    text-[#A1A1AA]

                    hover:text-[#166B2D]

                    transition-all
                "
                >

                <HistoryRoundedIcon
                    style={{
                    fontSize: 14,
                    }}
                />

                FULL BLOCKCHAIN TIMELINE

                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  </>
)}

{/* ======================================== */}
{/* VERIFIED TRUST SEAL MODAL */}
{/* ======================================== */}

{showVerifiedModal && (
  <>
    {/* OVERLAY */}
    <div
      onClick={() =>
        setShowVerifiedModal(false)
      }
      className="
        fixed inset-0

        bg-black/30

        backdrop-blur-[3px]

        z-[10000]
      "
    />

    {/* MODAL */}
    <div
      className="
        fixed
        top-[52px]
        left-1/2
        -translate-x-1/2

        z-[10001]

        w-[338px]

        bg-[#166B2D]

        rounded-b-[30px]

        px-7
        pt-14
        pb-12

        shadow-[0_35px_100px_rgba(0,0,0,0.35)]

        overflow-hidden
      "
    >

      {/* CLOSE */}
      <button
        onClick={() =>
          setShowVerifiedModal(false)
        }
        className="
          absolute
          top-5
          right-5

          w-8 h-8

          rounded-full

          border border-white/20

          flex items-center justify-center
        "
      >

        <CloseRoundedIcon
          style={{
            color: "#D1FAE5",
            fontSize: 17,
          }}
        />

      </button>

      {/* ICON */}
      <div className="flex justify-center">

        <div
          className="
            w-[96px]
            h-[96px]

            rounded-full

            bg-white

            flex items-center justify-center
          "
        >

          <VerifiedUserRoundedIcon
            style={{
              fontSize: 50,
              color: "#166B2D",
            }}
          />

        </div>

      </div>

      {/* TITLE */}
      <h2
        className="
          mt-7

          text-center

          text-[18px]

          font-black

          text-white
        "
      >
        LOOPI TRUST SEAL
      </h2>

      {/* DESCRIPTION */}
      <p
        className="
          mt-4

          text-center

          text-[13px]

          leading-[2]

          text-[#DCFCE7]
        "
      >
        This product has a verified blockchain
        record. Every lifecycle stage from fiber
        production to retail has been audited by
        certified decentralized third-party nodes.
      </p>

      {/* STATUS CARDS */}
      <div className="mt-8 space-y-3">

        {/* LEDGER */}
        <div
          className="
            h-[50px]

            rounded-[16px]

            bg-white/10

            border border-white/10

            px-4

            flex items-center justify-between
          "
        >

          <p
            className="
              text-[11px]

              tracking-[0.10em]

              font-black

              text-[#BBF7D0]
            "
          >
            LEDGER STATUS
          </p>

          <p
            className="
              text-[11px]

              tracking-[0.10em]

              font-black

              text-[#00FF85]
            "
          >
            IMMU-SECURE
          </p>

        </div>

        {/* NODE */}
        <div
          className="
            h-[50px]

            rounded-[16px]

            bg-white/10

            border border-white/10

            px-4

            flex items-center justify-between
          "
        >

          <p
            className="
              text-[11px]

              tracking-[0.10em]

              font-black

              text-[#BBF7D0]
            "
          >
            AUTHORITY NODE
          </p>

          <p
            className="
              text-[11px]

              tracking-[0.08em]

              font-black

              text-white
            "
          >
            EU-STHLM-91
          </p>

        </div>

      </div>

    </div>
  </>
)}

{/* ======================================== */}
{/* BLOCKCHAIN EXPLORER MODAL */}
{/* ======================================== */}

{showBlockchainModal && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() =>
        setShowBlockchainModal(false)
      }
      className="
        fixed inset-0

        bg-black/45
        backdrop-blur-[4px]

        z-[10050]
      "
    />

    {/* MODAL */}
    <div
      className="
        fixed inset-0

        z-[10060]

        flex items-center justify-center

        p-[14px]
      "
    >

      <div
        className="
          w-full
          max-w-[1600px]

          h-[90vh]

          bg-[#F7F8FA]

          rounded-[34px]

          shadow-[0_40px_120px_rgba(0,0,0,0.25)]

          overflow-hidden

          relative

          flex flex-col
        "
      >

        {/* TOP HANDLE */}
        <div className="pt-5 flex justify-center">

          <div
            className="
              w-[38px]
              h-[4px]

              rounded-full

              bg-[#D9DCE1]
            "
          />

        </div>

        {/* HEADER */}
        <div
          className="
            px-5
            pt-6
            pb-5

            flex items-center justify-between
          "
        >

          <div className="flex items-center gap-3">

            <Inventory2OutlinedIcon
              style={{
                fontSize: 20,
                color: "#2563EB",
              }}
            />

            <h2
              className="
                text-[16px]

                font-black

                text-[#111827]
              "
            >
              Blockchain Explorer
            </h2>

          </div>

          <button
            onClick={() =>
              setShowBlockchainModal(false)
            }
            className="
              w-8 h-8

              rounded-full

              border border-[#E5E7EB]

              flex items-center justify-center

              hover:bg-white
            "
          >

            <CloseRoundedIcon
              style={{
                fontSize: 16,
                color: "#9CA3AF",
              }}
            />

          </button>

        </div>

        {/* BODY */}
        <div
          className="
            flex-1

            overflow-y-auto

            px-5
            pb-5
          "
        >


          {/* TIMELINE RECORDS */}
          <div className="space-y-5">

            {[
              "Product Ownership Transfer (Retailer → Consumer)",
              "Repair Verification Smart Contract",
              "Sustainability Audit Validation",
              "Fiber Recycling Ledger Entry",
            ].map((event, index) => (

              <div
                key={index}
                className="
                  rounded-[22px]

                  bg-white

                  border border-[#ECECEC]

                  px-5 py-5

                  flex items-start justify-between

                  gap-5
                "
              >

                {/* LEFT */}
                <div>

                  <p
                    className="
                      text-[10px]

                      tracking-[0.08em]

                      font-black

                      text-[#B0B6C3]
                    "
                  >
                    HASH: {selectedPassport?.hashShort || selectedPassport?.hash || "Pending"}
                  </p>

                  <h3
                    className="
                      mt-4

                      text-[14px]

                      font-black

                      text-[#111827]
                    "
                  >
                    Event: {event}
                  </h3>

                  <p
                    className="
                      mt-3

                      text-[11px]

                      text-[#9CA3AF]
                    "
                  >
                    Recorded at 2024-03-20 15:42:01 UTC
                  </p>

                  <button
                    className="
                      mt-5

                      flex items-center gap-2

                      text-[11px]

                      tracking-[0.08em]

                      font-black

                      text-[#2563EB]
                    "
                  >

                    <ArrowOutwardRoundedIcon
                      style={{
                        fontSize: 13,
                      }}
                    />

                    VIEW ON LOOPI EXPLORER

                  </button>

                </div>

                {/* VERIFIED */}
                <div
                  className="
                    text-[10px]

                    font-black

                    tracking-[0.10em]

                    text-[#2563EB]
                  "
                >
                  VERIFIED
                </div>

              </div>

            ))}

          </div>

          {/* FOOTER INFO */}
          <div
            className="
              mt-5

              rounded-[18px]

              bg-[#FFF9EC]

              border border-[#F4DE9A]

              px-5 py-5

              flex items-start gap-3
            "
          >

            <InfoOutlinedIcon
              style={{
                color: "#D97706",
                fontSize: 18,
                marginTop: 1,
              }}
            />

            <p
              className="
                text-[11px]

                leading-[1.9]

                text-[#B45309]
              "
            >
              All records are immutable and stored on
              the decentralized LOOPI blockchain
              protocol. Verification ensures zero-trust
              authenticity for all sustainability claims.
            </p>

          </div>

        </div>

      </div>

    </div>
  </>
)}

{/* ========================================= */}
{/* REPAIR JOURNEY MODAL — PREMIUM UI */}
{/* ========================================= */}

{showRepairJourney && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() => setShowRepairJourney(false)}
      className="
        fixed inset-0
        bg-black/50
        backdrop-blur-md
        z-[10100]
      "
    />

    {/* CONTAINER */}
    <div
      className="
        fixed inset-0
        z-[10110]

        flex items-center justify-center

        p-3 sm:p-5
      "
    >

      <div
        className="
          w-full
          max-w-[390px]

          h-[96vh]

          rounded-[34px]

          overflow-hidden

          bg-[#EEF1F5]

          shadow-[0_35px_120px_rgba(0,0,0,0.45)]

          flex flex-col
        "
      >

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div
          className="
            h-[74px]

            bg-white/95

            backdrop-blur-xl

            border-b border-[#E8ECF2]

            px-5

            flex items-center justify-between

            shrink-0
          "
        >

          <button
            onClick={() => setShowRepairJourney(false)}
            className="
              w-10 h-10

              rounded-full

              hover:bg-[#F4F6F8]

              transition-all

              flex items-center justify-center
            "
          >
            <ArrowBackRoundedIcon
              style={{
                fontSize: 24,
                color: "#98A2B3",
              }}
            />
          </button>

          <div className="text-center">

            <h2
              className="
                text-[15px]
                font-black
                text-[#111827]
              "
            >
              Repair Record
            </h2>

            <p
              className="
                mt-[2px]

                text-[11px]

                text-[#A0A8B5]

                font-semibold
              "
            >
              Passport : {selectedPassport?.id || "N/A"}
            </p>

          </div>

          <div
            className="
              h-9
              px-4

              rounded-full

              bg-[#E9F9EE]

              border border-[#B7E8C2]

              text-[#16A34A]

              text-[12px]
              font-black

              flex items-center
            "
          >
            VERIFIED
          </div>

        </div>

        {/* ========================================= */}
        {/* BODY */}
        {/* ========================================= */}

        <div
          className="
            flex-1
            overflow-y-auto

            px-4
            pt-5
            pb-8
          "
        >

          {/* TOP CARD */}
          <div
            className="
              rounded-[30px]

              bg-white

              border border-[#E5E7EB]

              shadow-[0_10px_30px_rgba(15,23,42,0.04)]

              p-5
            "
          >

            {/* TOP */}
            <div className="flex gap-4">

              <div
                className="
                  w-[82px]
                  h-[82px]

                  rounded-[24px]

                  bg-[#EEF7F1]

                  text-[#166B2D]

                  shrink-0

                  flex items-center justify-center
                "
              >
                <BuildOutlinedIcon
                  style={{
                    fontSize: 42,
                  }}
                />
              </div>

              <div className="flex-1">

                <h2
                  className="
                    text-[22px]
                    leading-tight

                    font-black

                    text-[#111827]
                  "
                >
                  Lining Repair
                </h2>

                <div
                  className="
                    mt-3

                    flex items-start gap-2
                  "
                >

                  <LocationOnOutlinedIcon
                    style={{
                      fontSize: 18,
                      color: "#98A2B3",
                      marginTop: 1,
                    }}
                  />

                  <p
                    className="
                      text-[14px]
                      leading-[1.6]

                      font-semibold

                      text-[#6B7280]
                    "
                  >
                    Berlin Eco-Hub · Mitte,
                    Berlin, DE
                  </p>

                </div>

              </div>

            </div>

            {/* STATS */}
            <div
              className="
                mt-6

                grid grid-cols-3

                gap-3
              "
            >

              {[
                {
                  icon: (
                    <CalendarTodayOutlinedIcon
                      style={{
                        fontSize: 24,
                      }}
                    />
                  ),
                  value: "Sept 12,\n2025",
                  label: "DATE",
                },
                {
                  icon: (
                    <AccessTimeRoundedIcon
                      style={{
                        fontSize: 24,
                      }}
                    />
                  ),
                  value: "2\ndays",
                  label: "DURATION",
                },
                {
                  icon: (
                    <VerifiedUserRoundedIcon
                      style={{
                        fontSize: 24,
                      }}
                    />
                  ),
                  value: "12\nmonths",
                  label: "WARRANTY",
                },
              ].map((item) => (

                <div
                  key={item.label}
                  className="
                    rounded-[24px]

                    bg-[#FBFBFC]

                    border border-[#E8EBEF]

                    p-4

                    text-center
                  "
                >

                  <div
                    className="
                      text-[#166B2D]

                      flex justify-center
                    "
                  >
                    {item.icon}
                  </div>

                  <h3
                    className="
                      mt-4

                      whitespace-pre-line

                      text-[15px]
                      leading-[1.5]

                      font-black

                      text-[#111827]
                    "
                  >
                    {item.value}
                  </h3>

                  <p
                    className="
                      mt-2

                      text-[11px]

                      tracking-[0.14em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    {item.label}
                  </p>

                </div>

              ))}

            </div>

            {/* TABS */}
            <div
              className="
                mt-7

                flex gap-8

                border-b border-[#ECEEF2]
              "
            >

              {[
                "repair",
                "blockchain",
              ].map((tab) => (

                <button
                  key={tab}
                  onClick={() =>
                    setRepairTab(tab)
                  }
                  className={`
                    pb-4

                    text-[12px]

                    font-black

                    tracking-[0.10em]

                    border-b-[3px]

                    transition-all

                    ${
                      repairTab === tab
                        ? "border-[#166B2D] text-[#111827]"
                        : "border-transparent text-[#B0B7C3]"
                    }
                  `}
                >
                  {tab === "repair"
                    ? "REPAIR DETAILS"
                    : "BLOCKCHAIN PROOF"}
                </button>

              ))}

            </div>

            {/* ========================================= */}
            {/* REPAIR TAB */}
            {/* ========================================= */}

            {repairTab === "repair" && (
              <div className="mt-6 space-y-5">

                {/* DESCRIPTION */}
                <div
                  className="
                    rounded-[28px]

                    bg-white

                    border border-[#E7EAF0]

                    shadow-[0_4px_18px_rgba(15,23,42,0.05)]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    DESCRIPTION
                  </p>

                  <p
                    className="
                      mt-5

                      text-[15px]
                      leading-[2.1]

                      text-[#4B5563]
                    "
                  >
                    Full inner lining replacement
                    using GOTS-certified organic
                    cotton blend. Seam reinforcement
                    applied to collar, cuffs and
                    lower hem. All materials sourced
                    from EU-certified suppliers.
                  </p>

                </div>

                {/* ISSUE */}
                <div
                  className="
                    rounded-[28px]

                    bg-[#FFF5F5]

                    border border-[#FFCACA]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#EF4444]
                    "
                  >
                    ISSUE
                  </p>

                  <p
                    className="
                      mt-5

                      text-[15px]
                      leading-[2]

                      text-[#4B5563]
                    "
                  >
                    Torn inner lining along left
                    seam — approx. 14 cm tear at
                    shoulder blade area.
                  </p>

                </div>

                {/* OUTCOME */}
                <div
                  className="
                    rounded-[28px]

                    bg-[#F1FBF4]

                    border border-[#B7E8C2]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#16A34A]
                    "
                  >
                    OUTCOME
                  </p>

                  <p
                    className="
                      mt-5

                      text-[15px]
                      leading-[2]

                      text-[#4B5563]
                    "
                  >
                    Full lining replaced. Structural
                    integrity restored. No external
                    damage visible.
                  </p>

                </div>

                {/* MATERIALS */}
                <div
                  className="
                    rounded-[30px]

                    bg-white

                    border border-[#E7EAF0]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    MATERIALS USED
                  </p>

                  <div className="mt-6 space-y-5">

                    {[
                      [
                        "Organic Cotton Lining",
                        "Origin: Portugal",
                        "0.6m²",
                      ],
                      [
                        "Recycled Thread",
                        "Origin: Germany",
                        "12m",
                      ],
                    ].map((item) => (

                      <div
                        key={item[0]}
                        className="
                          flex items-center justify-between
                        "
                      >

                        <div className="flex gap-4">

                          <div
                            className="
                              w-12 h-12

                              rounded-2xl

                              bg-[#EEF7F1]

                              text-[#166B2D]

                              flex items-center justify-center
                            "
                          >
                            <Inventory2OutlinedIcon />
                          </div>

                          <div>

                            <h3
                              className="
                                text-[15px]
                                font-black
                                text-[#111827]
                              "
                            >
                              {item[0]}
                            </h3>

                            <p
                              className="
                                mt-1

                                text-[13px]

                                text-[#98A2B3]
                              "
                            >
                              {item[1]}
                            </p>

                          </div>

                        </div>

                        <p
                          className="
                            text-[16px]
                            font-black

                            text-[#6B7280]
                          "
                        >
                          {item[2]}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* TECHNICIAN */}
                <div
                  className="
                    rounded-[30px]

                    bg-white

                    border border-[#E7EAF0]

                    p-5

                    flex items-center justify-between gap-4
                  "
                >

                  <div className="flex gap-4">

                    <div
                      className="
                        w-14 h-14

                        rounded-2xl

                        bg-[#166B2D]

                        text-white

                        text-[22px]
                        font-black

                        flex items-center justify-center
                      "
                    >
                      JW
                    </div>

                    <div>

                      <h3
                        className="
                          text-[16px]
                          font-black
                          text-[#111827]
                        "
                      >
                        Jonas Weber
                      </h3>

                      <p
                        className="
                          mt-2

                          text-[13px]
                          leading-[1.7]

                          text-[#6B7280]
                        "
                      >
                        Certified Repair Technician ·
                        Berlin Eco-Hub
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-[2px]">

                    {[1,2,3,4,5].map((star) => (
                      <StarRoundedIcon
                        key={star}
                        style={{
                          color: "#F4B400",
                          fontSize: 20,
                        }}
                      />
                    ))}

                  </div>

                </div>

                {/* CERTIFICATIONS */}
                <div
                  className="
                    rounded-[30px]

                    bg-white

                    border border-[#E7EAF0]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    CERTIFICATIONS
                  </p>

                  <div className="mt-5 space-y-5">

                    {[
                      "GOTS Certified Materials",
                      "LOOPI Repair Protocol v2.1",
                      "EU Textile Repair Standard",
                    ].map((item) => (

                      <div
                        key={item}
                        className="
                          flex items-center gap-4
                        "
                      >

                        <CheckCircleRoundedIcon
                          style={{
                            color: "#166B2D",
                            fontSize: 24,
                          }}
                        />

                        <p
                          className="
                            text-[15px]

                            text-[#374151]
                          "
                        >
                          {item}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              </div>
            )}

            {/* ========================================= */}
            {/* BLOCKCHAIN TAB */}
            {/* ========================================= */}

            {repairTab === "blockchain" && (
              <div className="mt-6 space-y-5">

                {/* HASH CARD */}
                <div
                  className="
                    rounded-[34px]

                    bg-[#07163A]

                    overflow-hidden

                    p-6
                  "
                >

                  <div className="flex items-center gap-3">

                    <TagRoundedIcon
                      style={{
                        color: "#00FFA3",
                        fontSize: 26,
                      }}
                    />

                    <p
                      className="
                        text-[12px]

                        tracking-[0.16em]

                        font-black

                        text-[#94A3B8]
                      "
                    >
                      TRANSACTION HASH
                    </p>

                  </div>

                  <h2
                    className="
                      mt-5

                      text-[24px]

                      font-black

                      text-[#00FFA3]
                    "
                  >
                    {selectedPassport?.hashShort || selectedPassport?.hash || "Pending"}
                  </h2>

                  <div
                    className="
                      mt-7

                      grid grid-cols-2

                      gap-4
                    "
                  >

                    <div
                      className="
                        rounded-[20px]

                        bg-white/6

                        p-4
                      "
                    >

                      <p
                        className="
                          text-[11px]

                          tracking-[0.14em]

                          font-black

                          text-[#7C8BA1]
                        "
                      >
                        BLOCK HEIGHT
                      </p>

                      <h3
                        className="
                          mt-3

                          text-[18px]

                          font-black

                          text-white
                        "
                      >
                        4,821,403
                      </h3>

                    </div>

                    <div
                      className="
                        rounded-[20px]

                        bg-white/6

                        p-4
                      "
                    >

                      <p
                        className="
                          text-[11px]

                          tracking-[0.14em]

                          font-black

                          text-[#7C8BA1]
                        "
                      >
                        TIMESTAMP
                      </p>

                      <h3
                        className="
                          mt-3

                          text-[17px]
                          leading-[1.6]

                          font-black

                          text-white
                        "
                      >
                        2025-09-12 ·
                        11:24 UTC
                      </h3>

                    </div>

                  </div>

                </div>

                {/* CHAIN */}
                <div
                  className="
                    rounded-[30px]

                    bg-white

                    border border-[#E7EAF0]

                    p-6
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    VERIFICATION CHAIN
                  </p>

                  <div className="mt-6 space-y-6">

                    {[
                      [
                        "Repair Center Signed",
                        "Sept 12, 11:24 UTC",
                      ],
                      [
                        "LOOPI Node Validated",
                        "Sept 12, 11:24 UTC",
                      ],
                      [
                        "Authority Countersigned",
                        "Sept 12, 11:26 UTC",
                      ],
                      [
                        "Passport Record Updated",
                        "Sept 12, 11:27 UTC",
                      ],
                    ].map((item) => (

                      <div
                        key={item[0]}
                        className="
                          flex gap-4
                        "
                      >

                        <CheckCircleRoundedIcon
                          style={{
                            color: "#22C55E",
                            fontSize: 28,
                            marginTop: 2,
                          }}
                        />

                        <div>

                          <h3
                            className="
                              text-[16px]
                              font-black

                              text-[#111827]
                            "
                          >
                            {item[0]}
                          </h3>

                          <p
                            className="
                              mt-1

                              text-[13px]

                              text-[#98A2B3]
                            "
                          >
                            {item[1]}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

                {/* EXPLORER */}
                <button
                  className="
                    w-full

                    rounded-[28px]

                    bg-[#EEF4FF]

                    border border-[#CFE0FF]

                    px-6
                    py-6

                    flex items-center justify-between

                    hover:bg-[#E6F0FF]

                    transition-all
                  "
                >

                  <div className="flex gap-4">

                    <div
                      className="
                        w-12 h-12

                        rounded-2xl

                        bg-white

                        text-[#2563EB]

                        flex items-center justify-center
                      "
                    >
                      <OpenInNewRoundedIcon />
                    </div>

                    <div className="text-left">

                      <h3
                        className="
                          text-[16px]
                          font-black

                          text-[#2563EB]
                        "
                      >
                        View on LOOPI Explorer
                      </h3>

                      <p
                        className="
                          mt-1

                          text-[13px]

                          text-[#2563EB]
                        "
                      >
                        Full blockchain transaction
                        record
                      </p>

                    </div>

                  </div>

                  <ArrowForwardIosRoundedIcon
                    style={{
                      color: "#2563EB",
                      fontSize: 18,
                    }}
                  />

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  </>
)}

{/* ========================================= */}
{/* RECYCLING / END OF LIFE MODAL — PREMIUM UI */}
{/* ========================================= */}

{showRecycleJourney && (
  <>
    {/* BACKDROP */}
    <div
      onClick={() => setShowRecycleJourney(false)}
      className="
        fixed inset-0
        bg-black/50
        backdrop-blur-md
        z-[10200]
      "
    />

    {/* CONTAINER */}
    <div
      className="
        fixed inset-0
        z-[10210]

        flex items-center justify-center

        p-3 sm:p-5
      "
    >

      <div
        className="
          w-full
          max-w-[390px]

          h-[96vh]

          rounded-[34px]

          overflow-hidden

          bg-[#EEF1F5]

          shadow-[0_35px_120px_rgba(0,0,0,0.45)]

          flex flex-col
        "
      >

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div
          className="
            h-[76px]

            bg-white

            border-b border-[#E8ECF2]

            px-5

            flex items-center justify-between

            shrink-0
          "
        >

          <button
            onClick={() =>
              recycleStarted
                ? setRecycleStarted(false)
                : setShowRecycleJourney(false)
            }
            className="
              w-10 h-10

              rounded-full

              hover:bg-[#F3F4F6]

              transition-all

              flex items-center justify-center
            "
          >
            <ArrowBackRoundedIcon
              style={{
                fontSize: 24,
                color: "#98A2B3",
              }}
            />
          </button>

          <div className="text-center">

            <h2
              className="
                text-[15px]
                font-black

                text-[#111827]
              "
            >
              End-of-Life Protocol
            </h2>

            <p
              className="
                mt-[2px]

                text-[11px]

                text-[#A0A8B5]

                font-semibold
              "
            >
              Passport : {selectedPassport?.id || "N/A"}
            </p>

          </div>

          <div
            className="
              h-9 px-4

              rounded-full

              bg-[#EAF7EE]

              border border-[#B7E8C2]

              text-[#16A34A]

              text-[12px]
              font-black

              flex items-center
            "
          >
            READY
          </div>

        </div>

        {/* ========================================= */}
        {/* BODY */}
        {/* ========================================= */}

        <div className="flex-1 overflow-y-auto">

          {!recycleStarted ? (
            <>
              {/* ========================================= */}
              {/* HERO */}
              {/* ========================================= */}

              <div
                className="
                  relative

                  overflow-hidden

                  bg-[#19752B]

                  px-5
                  pt-8
                  pb-8
                "
              >

                {/* CIRCLES */}
                <div
                  className="
                    absolute
                    top-[-80px]
                    right-[-60px]

                    w-[220px]
                    h-[220px]

                    rounded-full

                    bg-white/6
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[-40px]
                    right-[-30px]

                    w-[120px]
                    h-[120px]

                    rounded-full

                    bg-white/5
                  "
                />

                {/* ICON */}
                <div
                  className="
                    relative

                    w-[82px]
                    h-[82px]

                    rounded-[28px]

                    bg-white/10

                    text-white

                    flex items-center justify-center
                  "
                >
                  <RecyclingRoundedIcon
                    style={{
                      fontSize: 42,
                    }}
                  />
                </div>

                {/* TITLE */}
                <h2
                  className="
                    relative

                    mt-7

                    text-[28px]
                    leading-[1.15]

                    font-black

                    text-white
                  "
                >
                  Fiber-Recycling
                  Ready
                </h2>

                <p
                  className="
                    relative

                    mt-5

                    text-[15px]
                    leading-[2]

                    text-white/80
                  "
                >
                  This garment has completed its
                  wearable lifecycle and is cleared
                  for LOOPI circular end-of-life
                  processing.
                </p>

                {/* SCORE */}
                <div
                  className="
                    relative

                    mt-8

                    rounded-[28px]

                    border border-white/15

                    bg-white/10

                    p-5
                  "
                >

                  <div
                    className="
                      flex items-center justify-between
                    "
                  >

                    <p
                      className="
                        text-[12px]

                        tracking-[0.14em]

                        font-black

                        text-white/75
                      "
                    >
                      RECYCLABILITY SCORE
                    </p>

                    <h3
                      className="
                        text-[20px]
                        font-black

                        text-white
                      "
                    >
                      95%
                    </h3>

                  </div>

                  <div
                    className="
                      mt-5

                      h-[10px]

                      rounded-full

                      bg-white/20

                      overflow-hidden
                    "
                  >

                    <div
                      className="
                        h-full

                        w-[95%]

                        rounded-full

                        bg-white
                      "
                    />

                  </div>

                  <p
                    className="
                      mt-4

                      text-[13px]
                      leading-[1.7]

                      text-white/65
                    "
                  >
                    95% of materials recoverable by
                    certified LOOPI partners
                  </p>

                </div>

              </div>

              {/* ========================================= */}
              {/* CONTENT */}
              {/* ========================================= */}

              <div
                className="
                  relative

                  -mt-6

                  rounded-t-[34px]

                  bg-[#EEF1F5]

                  px-4
                  pt-6
                  pb-8
                "
              >

                {/* TABS */}
                <div
                  className="
                    flex gap-8

                    border-b border-[#DDE3EB]
                  "
                >

                  {[
                    "protocol",
                    "partners",
                  ].map((tab) => (

                    <button
                      key={tab}
                      className={`
                        pb-4

                        text-[12px]

                        font-black

                        tracking-[0.10em]

                        border-b-[3px]

                        ${
                          tab === "protocol"
                            ? "border-[#166B2D] text-[#111827]"
                            : "border-transparent text-[#B0B7C3]"
                        }
                      `}
                    >
                      {tab === "protocol"
                        ? "PROTOCOL"
                        : "RECYCLING PARTNERS"}
                    </button>

                  ))}

                </div>

                {/* ========================================= */}
                {/* MATERIAL RECOVERY */}
                {/* ========================================= */}

                <div
                  className="
                    mt-6

                    rounded-[30px]

                    bg-white

                    border border-[#E5E7EB]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    MATERIAL RECOVERY PLAN
                  </p>

                  <div className="mt-6 space-y-7">

                    {[
                      [
                        "Recycled Wool",
                        "70%",
                        "#22C55E",
                        "Fiber Re-spinning",
                      ],
                      [
                        "PET Polyester",
                        "25%",
                        "#3B82F6",
                        "Chemical Dissolution",
                      ],
                      [
                        "Elastane",
                        "5%",
                        "#F59E0B",
                        "Energy Recovery",
                      ],
                    ].map((item) => (

                      <div key={item[0]}>

                        <div
                          className="
                            flex items-center justify-between
                          "
                        >

                          <div
                            className="
                              flex items-center gap-3
                            "
                          >

                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                background: item[2],
                              }}
                            />

                            <h3
                              className="
                                text-[16px]
                                font-black

                                text-[#111827]
                              "
                            >
                              {item[0]}
                            </h3>

                          </div>

                          <div
                            className="
                              flex items-center gap-2
                            "
                          >

                            <CheckCircleRoundedIcon
                              style={{
                                color: item[2],
                                fontSize: 20,
                              }}
                            />

                            <p
                              className="
                                text-[16px]
                                font-black

                                text-[#6B7280]
                              "
                            >
                              {item[1]}
                            </p>

                          </div>

                        </div>

                        <div
                          className="
                            mt-4

                            h-[10px]

                            rounded-full

                            bg-[#E5E7EB]

                            overflow-hidden
                          "
                        >

                          <div
                            className="
                              h-full

                              rounded-full
                            "
                            style={{
                              width: item[1],
                              background: item[2],
                            }}
                          />

                        </div>

                        <p
                          className="
                            mt-3

                            text-[14px]

                            text-[#7B8594]
                          "
                        >
                          Method: {item[3]}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* ========================================= */}
                {/* STEPS */}
                {/* ========================================= */}

                <div
                  className="
                    mt-6

                    rounded-[30px]

                    bg-white

                    border border-[#E5E7EB]

                    p-5
                  "
                >

                  <p
                    className="
                      text-[12px]

                      tracking-[0.16em]

                      font-black

                      text-[#A0A8B5]
                    "
                  >
                    PROTOCOL STEPS
                  </p>

                  <div className="mt-6 space-y-6">

                    {[
                        {
                            title: "Scan QR code at recycling drop-off",
                            done: true,
                        },
                        {
                            title: "LOOPI registers return on blockchain",
                            done: true,
                        },
                        {
                            title: "Material sorting at partner facility",
                            done: false,
                        },
                        {
                            title: "Fiber extraction & processing",
                            done: false,
                        },
                        {
                            title: "Raw material re-enters supply chain",
                            done: false,
                        },
                        ].map((step, index) => (

                        <div
                            key={step.title}
                            className="
                            flex items-start gap-4
                            "
                        >

                            <div
                            className={`
                                w-11 h-11

                                rounded-full

                                border-2

                                flex items-center justify-center

                                shrink-0

                                ${
                                step.done
                                    ? "bg-[#166B2D] border-[#166B2D] text-white"
                                    : "bg-white border-[#E5E7EB] text-[#9CA3AF]"
                                }
                            `}
                            >

                            {step.done ? (
                                <SpaOutlinedIcon
                                style={{
                                    fontSize: 18,
                                }}
                                />
                            ) : (
                                <span
                                className="
                                    text-[13px]
                                    font-black
                                "
                                >
                                {index + 1}
                                </span>
                            )}

                            </div>

                            <div className="pt-2">

                            <h3
                                className={`
                                text-[14px]
                                font-black

                                ${
                                    step.done
                                    ? "text-[#111827]"
                                    : "text-[#9CA3AF]"
                                }
                                `}
                            >
                                {step.title}
                            </h3>

                            </div>

                        </div>

                        ))}

                  </div>

                </div>

                {/* ========================================= */}
                {/* STATS */}
                {/* ========================================= */}

                <div
                  className="
                    mt-6

                    grid grid-cols-2

                    gap-4
                  "
                >

                  {/* CO2 */}
                  <div
                    className="
                      rounded-[30px]

                      bg-[#F1FBF4]

                      border border-[#B7E8C2]

                      p-6

                      text-center
                    "
                  >

                    <SpaOutlinedIcon
                      style={{
                        color: "#22C55E",
                        fontSize: 38,
                      }}
                    />

                    <h2
                      className="
                        mt-5

                        text-[26px]

                        font-black

                        text-[#16A34A]
                      "
                    >
                      3.8 kg
                    </h2>

                    <p
                      className="
                        mt-4

                        text-[12px]

                        tracking-[0.16em]

                        font-black

                        text-[#6B7280]
                      "
                    >
                      CO₂ SAVED
                    </p>

                  </div>

                  {/* ENERGY */}
                  <div
                    className="
                      rounded-[30px]

                      bg-[#FFF9EE]

                      border border-[#F6D365]

                      p-6

                      text-center
                    "
                  >

                    <BoltRoundedIcon
                      style={{
                        color: "#EA580C",
                        fontSize: 38,
                      }}
                    />

                    <h2
                      className="
                        mt-5

                        text-[26px]

                        font-black

                        text-[#EA580C]
                      "
                    >
                      9.2 kWh
                    </h2>

                    <p
                      className="
                        mt-4

                        text-[12px]

                        tracking-[0.16em]

                        font-black

                        text-[#6B7280]
                      "
                    >
                      ENERGY SAVED
                    </p>

                  </div>

                </div>

                {/* ========================================= */}
                {/* BUTTON */}
                {/* ========================================= */}

                <button
                  onClick={() =>
                    setRecycleStarted(true)
                  }
                  className="
                    mt-7

                    w-full
                    h-[64px]

                    rounded-[26px]

                    bg-[#0E6B25]

                    shadow-[0_20px_45px_rgba(22,107,45,0.35)]

                    text-white

                    text-[17px]
                    font-black

                    tracking-[0.08em]

                    hover:bg-[#09551C]

                    transition-all
                  "
                >
                  INITIATE RECYCLING →
                </button>

              </div>
            </>
          ) : (
            /* ========================================= */
            /* SUCCESS SCREEN */
            /* ========================================= */

            <div
              className="
                min-h-full

                bg-[#0D5E1F]

                px-5
                py-8
              "
            >

              <div
                className="
                  rounded-[38px]

                  bg-[#0A571B]

                  px-6
                  py-8

                  text-center
                "
              >

                <div
                  className="
                    w-[120px]
                    h-[120px]

                    rounded-full

                    bg-white

                    mx-auto

                    flex items-center justify-center
                  "
                >

                  <CheckCircleRoundedIcon
                    style={{
                      color: "#166B2D",
                      fontSize: 64,
                    }}
                  />

                </div>

                <h2
                  className="
                    mt-8

                    text-[26px]
                    leading-[1.3]

                    font-black

                    text-white
                  "
                >
                  Recycling
                  Initiated
                </h2>

                <p
                  className="
                    mt-6

                    text-[16px]
                    leading-[2.1]

                    text-white/80
                  "
                >
                  Your garment’s end-of-life event
                  has been recorded on the LOOPI
                  blockchain. Drop it off at your
                  nearest certified partner.
                </p>

                {/* INFO */}
                <div className="mt-8 space-y-4">

                  <div
                    className="
                      rounded-[22px]

                      bg-white/10

                      border border-white/10

                      px-5
                      py-4

                      flex items-center justify-between
                    "
                  >

                    <p
                      className="
                        text-[12px]

                        tracking-[0.14em]

                        font-black

                        text-white/60
                      "
                    >
                      PROTOCOL ID
                    </p>

                    <p
                      className="
                        text-[13px]
                        font-black

                        text-white
                      "
                    >
                      EOL-{selectedPassport?.id || "N/A"}
                    </p>

                  </div>

                  <div
                    className="
                      rounded-[22px]

                      bg-white/10

                      border border-white/10

                      px-5
                      py-4

                      flex items-center justify-between
                    "
                  >

                    <p
                      className="
                        text-[12px]

                        tracking-[0.14em]

                        font-black

                        text-white/60
                      "
                    >
                      STATUS
                    </p>

                    <p
                      className="
                        text-[13px]
                        font-black

                        text-white
                      "
                    >
                      PENDING DROP-OFF
                    </p>

                  </div>

                </div>

                {/* BTN */}
                <button
                  onClick={() =>
                    setShowRecycleJourney(false)
                  }
                  className="
                    mt-10

                    w-full
                    h-[62px]

                    rounded-[22px]

                    bg-white

                    text-[#166B2D]

                    text-[16px]
                    font-black

                    tracking-[0.10em]
                  "
                >
                  BACK TO PASSPORT
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  </>
)}

    </div>
  );
}

function InfoRow({
  label,
  value,
}: any) {
  return (
    <div
      className="
        rounded-2xl

        bg-white

        border border-[#ECECEC]

        px-4 py-4

        flex items-center justify-between
      "
    >

      <p
        className="
          text-sm
          text-[#6B7280]
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          font-black
          text-[#111827]
        "
      >
        {value}
      </p>

    </div>
  );
}

function MaterialBar({
  label,
  value,
}: any) {

  return (
    <div>

      <div
        className="
          flex items-center justify-between
          mb-2
        "
      >

        <p
          className="
            text-sm
            font-black
            text-[#111827]
          "
        >
          {label}
        </p>

        <p
          className="
            text-sm
            text-[#6B7280]
          "
        >
          {value}
        </p>

      </div>

      <div
        className="
          h-2

          rounded-full

          bg-[#E5E7EB]

          overflow-hidden
        "
      >

        <div
          className="
            h-full

            rounded-full

            bg-[#166B2D]
          "
          style={{
            width: value,
          }}
        />

      </div>

    </div>
  );
}

/* PASSPORT INFO CARD */
function PassportInfoCard({
  label,
  value,
}: any) {
  return (
    <div
      className="
        rounded-[20px]

        border border-[#ECECEC]

        bg-[#FAFAFA]

        p-4
      "
    >

      <p
        className="
          text-[10px]

          tracking-[0.14em]

          font-black

          text-[#9CA3AF]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-3

          text-sm

          font-black

          text-[#111827]
        "
      >
        {value}
      </p>

    </div>
  );
}

/* MATERIAL PROGRESS */
function MaterialProgress({
  title,
  percent,
  width,
  source,
}: any) {
  return (
    <div>
      <div
        className="
          flex items-center justify-between
          mb-2
        "
      >
        <p
          className="
            text-sm
            font-black
            text-[#111827]
          "
        >
          {title}
        </p>
        <p
          className="
            text-sm
            text-[#6B7280]
          "
        >
          {percent}
        </p>
      </div>
      <div
        className="
          h-2
          rounded-full
          bg-[#E5E7EB]
          overflow-hidden
          mb-2
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[#166B2D]
          "
          style={{
            width: width,
          }}
        />
      </div>
      <p
        className="
          text-xs
          text-[#9CA3AF]
        "
      >
        {source}
      </p>
    </div>
  );
}
