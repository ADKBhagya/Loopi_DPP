import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

/* =========================================
ICONS
========================================= */

import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import TokenRoundedIcon from "@mui/icons-material/TokenRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

export default function LifecycleClose() {

  /* =========================================
  STATE
  ========================================= */

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [selectedItem, setSelectedItem] =
    useState<any>(null);
  const [apiError, setApiError] = useState("");

  /* =========================================
  DATA
  ========================================= */

  /* =========================================
  FILTERED
  ========================================= */

  const [passports, setPassports] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const downloadJson = (fileName: string, payload: any) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadCloseQueue = () => {
    apiFetch<any>("/recycler/lifecycle-close")
      .then((data) => {
        setApiError("");
        setPassports(data.passports || []);
        setLogs(data.logs || []);
      })
      .catch((error) => {
        console.error("Failed to load lifecycle close queue", error);
        setApiError(error instanceof Error ? error.message : "Failed to load lifecycle close queue");
      });
  };

  useEffect(() => {
    loadCloseQueue();
  }, []);

  const closeLifecycle = async () => {
    if (!selectedItem?.processId) return;

    try {
      await apiFetch(`/recycler/processing/${selectedItem.processId}/close`, {
        method: "POST",
      });
      setSelectedItem(null);
      loadCloseQueue();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to close lifecycle";
      setApiError(message);
    }
  };

  const readyCount = passports.filter((item) => item.status === "READY").length;
  const reviewCount = passports.filter((item) => item.status === "RECOVER" || item.status === "WAIT").length;
  const closedCount = passports.filter((item) => item.status === "CLOSED").length;
  const creditTotal = passports.reduce(
    (sum, item) => sum + (Number.parseFloat(String(item.credits || "0")) || 0),
    0
  );

  const filteredPassports =
    useMemo(() => {

      return passports.filter((item) => {

        const matchesSearch =

          item.id
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          item.garment
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =

          filter === "all"
            ? true
            : item.status
                .toLowerCase() ===
              filter;

        return (
          matchesSearch &&
          matchesFilter
        );

      });

    }, [passports, search, filter]);

  /* =========================================
  UI
  ========================================= */

  return (

    <div className="space-y-5">
      {apiError && (
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-bold text-[#B91C1C]">
          {apiError}
        </div>
      )}

      {/* =========================================
      STATS
      ========================================= */}

      <div
        className="
          grid

          grid-cols-2
          xl:grid-cols-4

          gap-4
        "
      >

        <StatCard
          title="READY TO CLOSE"
          value={String(readyCount)}
          icon={<CheckCircleRoundedIcon />}
          iconBg="#EAF7EE"
          iconColor="#16A34A"
        />

        <StatCard
          title="IN REVIEW"
          value={String(reviewCount)}
          icon={<AutoAwesomeRoundedIcon />}
          iconBg="#FFF4E6"
          iconColor="#F59E0B"
        />

        <StatCard
          title="CLOSED"
          value={String(closedCount)}
          icon={<HubRoundedIcon />}
          iconBg="#EEF4FF"
          iconColor="#2563EB"
        />

        <StatCard
          title="RECYCLED CREDIT"
          value={`${creditTotal}+`}
          icon={<TokenRoundedIcon />}
          iconBg="#F5EFFF"
          iconColor="#9333EA"
        />

      </div>

      {/* =========================================
      QUEUE
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
    px-5
    py-4

    border-b border-[#F3F4F6]

    flex flex-col
    xl:flex-row

    xl:items-center
    xl:justify-between

    gap-4
  "
>

  {/* LEFT */}
  <div>

    <h2
      className="
        text-[16px]

        font-black

        text-[#111827]
      "
    >
      End-of-Life Passport Queue
    </h2>

    <p
      className="
        mt-1

        text-[10px]

        text-[#A0A6B2]
      "
    >
      Lifecycle termination & recovery validation
    </p>

  </div>

  {/* RIGHT */}
  <div
    className="
      flex flex-col
      xl:flex-row

      xl:items-center

      gap-3
    "
  >

    {/* FILTERS */}
    <div
      className="
        flex items-center gap-2

        flex-wrap
      "
    >

      {[
        "all",
        "ready",
        "recover",
        "closed",
      ].map((item) => (

        <button
          key={item}
          onClick={() =>
            setFilter(item)
          }
          className={`
            h-[28px]

            px-3

            rounded-full

            border

            text-[9px]

            font-black

            transition-all

            ${
              filter === item
                ? "bg-[#111827] text-white border-[#111827]"
                : "bg-white text-[#6B7280] border-[#E5E7EB]"
            }
          `}
        >
          {item.toUpperCase()}
        </button>

      ))}

    </div>

    {/* SEARCH */}
    <div
      className="
        relative

        w-full
        xl:w-[210px]
      "
    >

      <SearchRoundedIcon
        className="
          absolute

          left-3
          top-1/2

          -translate-y-1/2

          text-[#A0A6B2]
        "
        style={{ fontSize: 17 }}
      />

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search passports..."
        className="
          w-full

          h-[36px]

          rounded-[14px]

          border border-[#E8E8E8]

          bg-white

          pl-9
          pr-3

          text-[11px]

          outline-none

          focus:border-[#166B2D]
        "
      />

    </div>

  </div>

</div>

{/* LIST */}
<div>

  {filteredPassports.map(
    (item, index) => (

      <div
        key={index}
        className="
          min-h-[86px]

          px-5

          border-b border-[#F3F4F6]

          flex items-center
          justify-between

          hover:bg-[#FAFAFA]

          transition-all
        "
      >

        {/* LEFT */}
        <div
          className="
            flex items-center gap-4
          "
        >

          {/* ICON */}
          <div
            className="
              w-11 h-11

              rounded-[16px]

              bg-[#EEF7F0]

              flex items-center justify-center

              text-[#166B2D]
            "
          >

            <RecyclingRoundedIcon
              style={{ fontSize: 17 }}
            />

          </div>

          {/* DETAILS */}
          <div>

            {/* TOP */}
            <div
              className="
                flex items-center gap-2
              "
            >

              <h3
                className="
                  text-[13px]

                  font-black

                  text-[#111827]
                "
              >
                {item.id}
              </h3>

              {/* GRADE */}
              <div
                className="
                  h-[18px]

                  px-2

                  rounded-[6px]

                  bg-[#EEF4FF]

                  text-[#2563EB]

                  text-[8px]

                  font-black

                  flex items-center
                "
              >
                A
              </div>

            </div>

            {/* DESCRIPTION */}
            <p
              className="
                mt-1

                text-[11px]

                text-[#9CA3AF]
              "
            >
              {item.garment}
              {" · "}
              {item.company}
              {" · "}
              Consumer #882
            </p>

            {/* REF */}
            <p
              className="
                mt-[2px]

                text-[9px]

                text-[#D1D5DB]
              "
            >
              {item.processId}
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div
          className="
            flex items-center gap-6
          "
        >

          {/* SCORE */}
          <div className="text-right">

            <p
              className="
                text-[13px]

                font-black

                text-[#166B2D]
              "
            >
              {item.score}
            </p>

            <p
              className="
                mt-[2px]

                text-[9px]

                text-[#D1D5DB]
              "
            >
              recyclability
            </p>

          </div>

          {/* STATUS */}
          <div
            className="
              h-[28px]

              px-3

              rounded-full

              text-[9px]

              font-black

              tracking-[0.08em]

              flex items-center
              justify-center
            "
            style={{
              color: item.color,
              background: item.badgeBg,
            }}
          >
            {item.status}
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              setSelectedItem(item)
            }
            disabled={
              item.status === "CLOSED"
            }
            className={`
              h-[36px]

              px-5

              rounded-full

              text-[10px]

              tracking-[0.12em]

              font-black

              flex items-center gap-2

              transition-all

              ${
                item.status === "CLOSED"
                  ? `
                    bg-[#F5F5F5]
                    text-[#D1D5DB]
                    cursor-not-allowed
                  `
                  : `
                    bg-[#EEF7F0]
                    text-[#166B2D]
                    border border-[#D7E9DA]

                    hover:bg-[#166B2D]
                    hover:text-white
                  `
              }
            `}
          >

            <BoltRoundedIcon
              style={{ fontSize: 13 }}
            />

            {item.status === "CLOSED"
              ? "CLOSED"
              : "CLOSE LIFECYCLE"}

          </button>

        </div>

      </div>

    )
  )}

</div>

      </div>

      {/* =========================================
      BLOCKCHAIN LOG
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

          <div
            className="
              flex items-center gap-2
            "
          >

            <HubRoundedIcon
              style={{
                fontSize: 15,
                color: "#166B2D",
              }}
            />

            <h2
              className="
                text-[14px]

                font-black

                text-[#111827]
              "
            >
              Lifecycle Blockchain Log
            </h2>

          </div>

          <button
            onClick={() =>
              downloadJson("recycler-lifecycle-log.json", {
                exportedAt: new Date().toISOString(),
                passports: filteredPassports,
                logs,
              })
            }
            className="
              text-[9px]

              font-black

              tracking-[0.12em]

              text-[#166B2D]

              flex items-center gap-2
            "
          >

            <DownloadRoundedIcon
              style={{ fontSize: 13 }}
            />

            EXPORT

          </button>

        </div>

        {/* LOGS */}
        <div>

          {logs.map((log, index) => (

            <div
              key={index}
              className="
                h-[62px]

                px-5

                border-b border-[#F5F5F5]

                flex items-center
                justify-between

                hover:bg-[#FAFAFA]

                transition-all
              "
            >

              {/* LEFT */}
              <div
                className="
                  flex items-center gap-4
                "
              >

                <div
                  className="
                    w-2 h-2
                    rounded-full
                  "
                  style={{
                    background: log.color,
                  }}
                />

                <div>

                  <h3
                    className="
                      text-[11px]

                      font-black

                      text-[#111827]
                    "
                  >
                    {log.hash}
                  </h3>

                  <p
                    className="
                      mt-1

                      text-[10px]

                      text-[#A0A6B2]
                    "
                  >
                    {log.title}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div
                className="
                  flex items-center gap-4
                "
              >

                <div
                  className="
                    px-2 py-[4px]

                    rounded-[6px]

                    text-[8px]

                    font-black
                  "
                  style={{
                    color: log.color,
                    background: log.bg,
                  }}
                >
                  {log.type}
                </div>

                <p
                  className="
                    text-[10px]

                    text-[#9CA3AF]
                  "
                >
                  {log.time}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (log.explorerUrl) window.open(log.explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                  disabled={!log.explorerUrl}
                  className="disabled:opacity-30"
                >
                <OpenInNewRoundedIcon
                  style={{
                    fontSize: 13,
                    color: "#D1D5DB",
                  }}
                />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* =========================================
      MODAL
      ========================================= */}

      {selectedItem && (

        <>
          {/* OVERLAY */}
          <div
            onClick={() =>
              setSelectedItem(null)
            }
            className="
              fixed inset-0

              bg-black/45

              backdrop-blur-sm

              z-[9998]
            "
          />

          {/* MODAL */}
          <div
            className="
              fixed inset-0

              flex items-center
              justify-center

              p-4

              z-[9999]
            "
          >

            <div
              className="
                w-full
                max-w-[360px]

                rounded-[24px]

                bg-white

                overflow-hidden

                shadow-[0_40px_100px_rgba(0,0,0,0.30)]
              "
            >

              {/* BODY */}
              <div
                className="
                  p-6

                  text-center
                "
              >

                {/* ICON */}
                <div
                  className="
                    w-12 h-12

                    rounded-[16px]

                    bg-[#EEF7F0]

                    mx-auto

                    flex items-center justify-center

                    text-[#166B2D]
                  "
                >

                  <RecyclingRoundedIcon />

                </div>

                {/* TITLE */}
                <h2
                  className="
                    mt-5

                    text-[20px]

                    font-black

                    text-[#111827]
                  "
                >
                  Close Lifecycle
                </h2>

                {/* DESC */}
                <p
                  className="
                    mt-3

                    text-[12px]

                    leading-relaxed

                    text-[#9CA3AF]
                  "
                >
                  This will permanently
                  terminate the passport
                  lifecycle and transfer
                  recyclable material into
                  the LOOPI recovery chain.
                </p>

                {/* ALERT */}
                <div
                  className="
                    mt-5

                    rounded-[14px]

                    border border-[#FDE7C7]

                    bg-[#FFF7ED]

                    p-4

                    text-left
                  "
                >

                  <div
                    className="
                      flex items-start gap-3
                    "
                  >

                    <BoltRoundedIcon
                      style={{
                        color: "#F59E0B",
                        fontSize: 18,
                      }}
                    />

                    <p
                      className="
                        text-[11px]

                        leading-relaxed

                        text-[#B45309]
                      "
                    >
                      Final closure will
                      mint recyclable
                      recovery credits and
                      freeze lifecycle edits.
                    </p>

                  </div>

                </div>

                {/* BUTTONS */}
                <div
                  className="
                    mt-6

                    flex items-center gap-3
                  "
                >

                  <button
                    onClick={() =>
                      setSelectedItem(null)
                    }
                    className="
                      flex-1

                      h-[40px]

                      rounded-[12px]

                      border border-[#E5E7EB]

                      bg-[#FAFAFA]

                      text-[#6B7280]

                      text-[10px]

                      font-black
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={closeLifecycle}
                    className="
                      flex-1

                      h-[40px]

                      rounded-[12px]

                      bg-[#166B2D]

                      text-white

                      text-[10px]

                      tracking-[0.12em]

                      font-black

                      shadow-[0_10px_25px_rgba(22,107,45,0.20)]
                    "
                  >
                    CONFIRM & CLOSE
                  </button>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>

  );

}

/* =========================================
STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: any) {

  return (

    <div
      className="
        h-[86px]

        rounded-[18px]

        border border-[#ECECEC]

        bg-white

        px-4

        flex items-center
        justify-between

        shadow-[0_8px_25px_rgba(0,0,0,0.03)]
      "
    >

      <div>

        <p
          className="
            text-[11px]

            tracking-[0.14em]

            font-black

            text-[#A0A6B2]
          "
        >
          {title}
        </p>

        <h2
          className="
            mt-3

            text-[22px]

            font-black

            text-[#111827]
          "
        >
          {value}
        </h2>

      </div>

      <div
        className="
          w-10 h-10

          rounded-[12px]

          flex items-center justify-center
        "
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>

    </div>

  );

}
