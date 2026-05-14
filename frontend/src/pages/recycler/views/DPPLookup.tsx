import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";

/* =========================================
ICONS
========================================= */

import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

type DPPLookupProps = {
  onDataChanged?: () => void;
};

export default function DPPLookup({ onDataChanged }: DPPLookupProps) {
  const navigate = useNavigate();

  /* =========================================
  STATE
  ========================================= */

  const [search, setSearch] =
    useState("");

  const [selectedId, setSelectedId] =
    useState("");
  const [apiError, setApiError] = useState("");
  const [queueing, setQueueing] = useState(false);

  /* =========================================
  DATA
  ========================================= */

  /* =========================================
  FILTER
  ========================================= */

  const [passports, setPassports] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any>("/recycler/materials")
      .then((data) => {
        setApiError("");
        if (data.passports?.length) {
          setPassports(data.passports);
          setSelectedId(data.passports[0].id);
        }
      })
      .catch((error) => {
        console.error("Failed to load recycler passports", error);
        setApiError(error instanceof Error ? error.message : "Failed to load recycler passports");
      });
  }, []);

const filteredPassports = passports;

  /* =========================================
  SELECTED
  ========================================= */

  const selectedPassport =
    passports.find(
      (item) =>
        item.id === selectedId
    );

  /* =========================================
  SEARCH
  ========================================= */
const handleSearch = async () => {

  if (!search.trim()) return;

  const foundPassport =
    passports.find((item) => {

      return (

        item.id.toLowerCase() ===
          search.toLowerCase() ||

        item.garment
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    });

  if (foundPassport) {
    setSelectedId(foundPassport.id);
    return;
  }

  try {
    const data = await apiFetch<any>(`/recycler/passport/${encodeURIComponent(search.trim())}`);
    setApiError("");
    setPassports((prev) =>
      prev.some((item) => item.id === data.id) ? prev : [data, ...prev]
    );
    setSelectedId(data.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Digital passport not found";
    setApiError(message);
  }

};

const downloadReport = () => {
  if (!selectedPassport) return;

  const blob = new Blob([JSON.stringify(selectedPassport, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recycler-dpp-${selectedPassport.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const queueForRecycling = async () => {
  if (!selectedPassport) return;

  try {
    setQueueing(true);
    const material = selectedPassport.materials
      ?.map((item: any) => item.name || item)
      .join(", ");

    await apiFetch("/recycler/processing", {
      method: "POST",
      body: JSON.stringify({
        passport: selectedPassport.id,
        garment: selectedPassport.garment,
        material,
        weight: selectedPassport.weight,
        stage: "SORTING",
      }),
    });
    setApiError("");
    onDataChanged?.();
    navigate("/recycler/processing");
  } catch (error) {
    setApiError(error instanceof Error ? error.message : "Failed to queue passport");
  } finally {
    setQueueing(false);
  }
};

  return (

    <div className="space-y-5">
      {apiError && (
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-bold text-[#B91C1C]">
          {apiError}
        </div>
      )}



      {/* =========================================
      HERO
      ========================================= */}

      <div
        className="
          bg-white

          border border-[#ECECEC]

          rounded-[24px]

          px-6
          py-10

          shadow-[0_8px_25px_rgba(0,0,0,0.03)]
        "
      >

        <div
          className="
            max-w-[620px]
            mx-auto

            flex flex-col
            items-center

            text-center
          "
        >

          {/* ICON */}
          <div
            className="
              w-12 h-12

              rounded-[16px]

              bg-[#EEF7F0]

              border border-[#DCEEDD]

              flex items-center
              justify-center
            "
          >

            <Inventory2RoundedIcon
              style={{
                fontSize: 22,
                color: "#166B2D",
              }}
            />

          </div>

          {/* TITLE */}
          <h1
            className="
              mt-5

              text-[28px]

              font-black

              text-[#111827]
            "
          >
            DPP Lookup
          </h1>

          <p
            className="
              mt-3

              max-w-[520px]

              text-[13px]

              leading-relaxed

              text-[#9CA3AF]
            "
          >
            Enter a Passport ID to retrieve
            its Digital Product Passport
            data for recycling assessment.
          </p>

          {/* SEARCH */}
          <div
            className="
              mt-7

              flex items-center

              w-full
              max-w-[520px]
            "
          >

            {/* INPUT */}
            <div
              className="
                relative
                flex-1
              "
            >

              <div
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-[#A0A6B2]
                "
              >
                #
              </div>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    handleSearch();
                  }

                }}
                placeholder="Passport ID, SKU, or product name"
                className="
                  w-full

                  h-[46px]

                  rounded-l-[16px]

                  border border-[#E5E7EB]

                  bg-[#FAFAFA]

                  pl-9
                  pr-4

                  text-[13px]

                  font-semibold

                  text-[#111827]

                  outline-none

                  focus:border-[#166B2D]
                "
              />

            </div>

            {/* BTN */}
            <button
              onClick={handleSearch}
              className="
                h-[46px]

                px-7

                rounded-r-[16px]

                bg-[#166B2D]

                text-white

                text-[11px]

                tracking-[0.12em]

                font-black

                flex items-center gap-2

                shadow-[0_10px_25px_rgba(22,107,45,0.18)]
              "
            >

              <SearchRoundedIcon
                style={{ fontSize: 16 }}
              />

              SEARCH

            </button>

          </div>

        </div>

      </div>

      {/* =========================================
      RESULT CARD
      ========================================= */}

      {selectedPassport && (

        <div
          className="
            bg-white

            border border-[#DDEDDD]

            rounded-[24px]

            overflow-hidden

            shadow-[0_8px_25px_rgba(0,0,0,0.03)]
          "
        >

          {/* TOP BAR */}
          <div
            className="
              h-[58px]

              px-6

              bg-[#F7FBF8]

              border-b border-[#EEF2EF]

              flex items-center
              justify-between
            "
          >

            {/* LEFT */}
            <div
              className="
                flex items-center gap-3
              "
            >

              <div
                className="
                  w-2 h-2
                  rounded-full
                  bg-[#22C55E]
                "
              />

              <h2
                className="
                  text-[18px]

                  font-black

                  text-[#111827]
                "
              >
                {selectedPassport.id}
                {" — "}
                {selectedPassport.garment}
              </h2>

            </div>

            {/* RIGHT */}
            <div
              className="
                flex items-center gap-2
              "
            >

              {selectedPassport.hazardous && (

                <div
                  className="
                    h-7

                    px-3

                    rounded-full

                    border border-[#FECACA]

                    bg-[#FFF1F1]

                    text-[#DC2626]

                    text-[9px]

                    font-black

                    tracking-[0.12em]

                    flex items-center gap-1
                  "
                >

                  <ErrorOutlineRoundedIcon
                    style={{ fontSize: 13 }}
                  />

                  HAZARDOUS

                </div>

              )}

              <div
                className="
                  h-7

                  px-3

                  rounded-full

                  bg-[#EAF7EE]

                  text-[#16A34A]

                  text-[9px]

                  font-black

                  tracking-[0.12em]

                  flex items-center
                "
              >
                VERIFIED
              </div>

            </div>

          </div>

          {/* BODY */}
          <div className="p-5">

            {/* METRICS */}
            <div
              className="
                grid

                grid-cols-2
                xl:grid-cols-4

                gap-4
              "
            >

              <LookupMetric
                title="BRAND"
                value={
                  selectedPassport.company
                }
              />

              <LookupMetric
                title="WEIGHT"
                value={
                  selectedPassport.weight
                }
              />

              <LookupMetric
                title="RECYCLABILITY"
                value={
                  selectedPassport.metrics
                    .recyclability
                }
              />

              <LookupMetric
                title="CO₂ IMPACT"
                value={
                  selectedPassport.metrics
                    .carbon
                }
              />

            </div>

            {/* MATERIALS */}
            <div className="mt-7">

              <div
                className="
                  flex flex-col
                  xl:flex-row

                  xl:justify-between

                  gap-7
                "
              >

                {/* LEFT */}
                <div className="space-y-4">

                  {selectedPassport.materials.map(
                    (
                      material: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          flex items-center gap-3
                        "
                      >

                        <div
                          className="
                            w-2 h-2
                            rounded-full
                          "
                          style={{
                            background:
                              material.color,
                          }}
                        />

                        <h3
                          className="
                            text-[13px]

                            font-black

                            text-[#111827]
                          "
                        >
                          {material.name}
                        </h3>

                      </div>

                    )
                  )}

                </div>

                {/* RIGHT */}
                <div className="space-y-4">

                  {selectedPassport.materials.map(
                    (
                      material: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          flex items-center
                          justify-end

                          gap-4
                        "
                      >

                        <p
                          className="
                            text-[11px]

                            text-[#A0A6B2]
                          "
                        >
                          {material.type}
                        </p>

                        <div
                          className="
                            px-2 py-[4px]

                            rounded-[6px]

                            text-[8px]

                            font-black
                          "
                          style={{
                            background:
                              material.badgeBg,

                            color:
                              material.badgeColor,
                          }}
                        >
                          {material.badge}
                        </div>

                        <p
                          className="
                            text-[12px]

                            font-black
                          "
                          style={{
                            color:
                              material.color,
                          }}
                        >
                          {String(material.value).endsWith("%")
                            ? material.value
                            : `${material.value}%`}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div
              className="
                mt-7

                flex items-center gap-3

                flex-wrap
              "
            >

              <button
                onClick={queueForRecycling}
                disabled={queueing}
                className="
                  h-[38px]

                  px-5

                  rounded-[12px]

                  bg-[#166B2D]

                  text-white

                  text-[10px]

                  tracking-[0.12em]

                  font-black

                  flex items-center gap-2

                  shadow-[0_10px_25px_rgba(22,107,45,0.18)]
                "
              >

                <CheckCircleRoundedIcon
                  style={{ fontSize: 15 }}
                />

                {queueing ? "QUEUEING..." : "QUEUE FOR RECYCLING"}

              </button>

              <button
                onClick={downloadReport}
                className="
                  h-[38px]

                  px-5

                  rounded-[12px]

                  border border-[#E5E7EB]

                  bg-[#FAFAFA]

                  text-[#4B5563]

                  text-[10px]

                  tracking-[0.10em]

                  font-black

                  flex items-center gap-2
                "
              >

                <DownloadRoundedIcon
                  style={{ fontSize: 15 }}
                />

                Download Report

              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedPassport?.id) {
                    window.open(
                      `/consumer/passport/${encodeURIComponent(selectedPassport.id)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
                disabled={!selectedPassport?.id}
                title="Open public passport"
                className="
                  w-[38px]
                  h-[38px]

                  rounded-[12px]

                  border border-[#E5E7EB]

                  bg-[#FAFAFA]

                  flex items-center justify-center

                  text-[#9CA3AF]

                  disabled:opacity-40
                "
              >

                <OpenInNewRoundedIcon
                  style={{ fontSize: 15 }}
                />

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================================
      DIRECTORY
      ========================================= */}

      <div
        className="
          bg-white

          border border-[#ECECEC]

          rounded-[24px]

          overflow-hidden

          shadow-[0_8px_25px_rgba(0,0,0,0.03)]
        "
      >

        {/* HEADER */}
        <div
          className="
            h-[54px]

            px-5

            border-b border-[#F3F4F6]

            flex items-center
            justify-between
          "
        >

          <h2
            className="
              text-[16px]

              font-black

              text-[#111827]
            "
          >
            Known Passports Directory
          </h2>

          <p
            className="
              text-[10px]

              tracking-[0.14em]

              font-black

              text-[#A0A6B2]
            "
          >
            {filteredPassports.length}
            {" "}
            RECORDS
          </p>

        </div>

        {/* LIST */}
        <div>
          {filteredPassports.length === 0 && (
            <div className="px-5 py-10 text-center text-sm font-semibold text-[#9CA3AF]">
              No recycler passports found
            </div>
          )}

          {filteredPassports.map((item) => (

            <button
              key={item.id}
              onClick={() => {

                setSelectedId(item.id);
                setSearch(item.id);

              }}
              className={`
                w-full

                h-[78px]

                px-5

                border-b border-[#F3F4F6]

                flex items-center
                justify-between

                transition-all

                ${
                  selectedId === item.id
                    ? "bg-[#F7FBF8]"
                    : "hover:bg-[#FAFAFA]"
                }
              `}
            >

              {/* LEFT */}
              <div
                className="
                  flex items-center gap-3
                "
              >

                <div
                  className={`
                    w-10 h-10

                    rounded-[14px]

                    flex items-center justify-center

                    ${
                      selectedId === item.id
                        ? "bg-[#166B2D] text-white"
                        : "bg-[#EEF2EF] text-[#166B2D]"
                    }
                  `}
                >

                  <Inventory2RoundedIcon
                    style={{ fontSize: 18 }}
                  />

                </div>

                <div className="text-left">

                  <div
                    className="
                      flex items-center gap-1
                    "
                  >

                    <h3
                      className="
                        text-[12px]

                        font-black

                        text-[#111827]
                      "
                    >
                      {item.id}
                    </h3>

                    {item.hazardous && (

                      <ErrorOutlineRoundedIcon
                        style={{
                          fontSize: 13,
                          color: "#EF4444",
                        }}
                      />

                    )}

                  </div>

                  <p
                    className="
                      mt-1

                      text-[11px]

                      text-[#A0A6B2]
                    "
                  >
                    {item.garment}
                    {" · "}
                    {item.company}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p
                  className="
                    text-[13px]

                    font-black

                    text-[#166B2D]
                  "
                >
                  {
                    item.metrics
                      .recyclability
                  }
                </p>

                <p
                  className="
                    text-[10px]

                    text-[#D1D5DB]

                    mt-1
                  "
                >
                  recyclability
                </p>

              </div>

            </button>

          ))}

        </div>

      </div>

    </div>

  );
}

/* =========================================
METRIC CARD
========================================= */

function LookupMetric({
  title,
  value,
}: any) {

  return (

    <div
      className="
        h-[62px]

        rounded-[14px]

        border border-[#ECECEC]

        bg-[#FAFAFA]

        px-4

        flex flex-col
        justify-center
      "
    >

      <p
        className="
          text-[8px]

          tracking-[0.14em]

          font-black

          text-[#A0A6B2]
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-2

          text-[12px]

          font-black

          text-[#111827]
        "
      >
        {value}
      </h3>

    </div>

  );
}
