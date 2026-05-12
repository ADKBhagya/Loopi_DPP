import { useMemo, useState } from "react";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function AuditTrail() {

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [selectedLog, setSelectedLog] =
    useState<any>(null);

  const [copiedHash, setCopiedHash] =
    useState("");

  const logs = [

    {
      hash: "0x7fa1...C302",
      fullHash:
        "0x7fa1e45a91828C302af9282bd22",
      type: "SALE",
      passport: "GP-9811",
      title:
        "Ownership transferred to Consumer #882",
      desc:
        "Retail sale transaction committed to LOOPI blockchain",
      time: "15:20",
      date: "Mar 10, 2026",
      color: "#16A34A",
      badgeBg: "#EAF7EE",
    },

    {
      hash: "0x3b2c...11A9",
      fullHash:
        "0x3b2ce71911A9adf71ab8210",
      type: "ARRIVAL",
      passport: "GP-9877",
      title:
        "Garment GP-9877 arrived from Logistics FL-AMS-02",
      desc:
        "Retail node inventory arrival verified",
      time: "09:44",
      date: "Mar 18, 2026",
      color: "#2563EB",
      badgeBg: "#EEF4FF",
    },

    {
      hash: "0x9c4d...E7F1",
      fullHash:
        "0x9c4d98281E7F1129d81281",
      type: "ARRIVAL",
      passport: "GP-9821",
      title:
        "Garment GP-9821 received at FashForward GmbH",
      desc:
        "Inventory ownership updated successfully",
      time: "11:05",
      date: "Mar 15, 2026",
      color: "#2563EB",
      badgeBg: "#EEF4FF",
    },

    {
      hash: "0xA9b3...2288",
      fullHash:
        "0xA9b3228828172f8812dd",
      type: "SCAN",
      passport: "GP-9821",
      title:
        "Passport GP-9821 scanned & verified",
      desc:
        "Retail QR verification successful",
      time: "08:50",
      date: "Mar 15, 2026",
      color: "#9333EA",
      badgeBg: "#F5EFFF",
    },

    {
      hash: "0x5d8a...BC00",
      fullHash:
        "0x5d8aBC00981812dd9911",
      type: "SALE",
      passport: "GP-9799",
      title:
        "Ownership transferred to Consumer #799",
      desc:
        "Blockchain ownership transfer complete",
      time: "14:55",
      date: "Mar 08, 2026",
      color: "#16A34A",
      badgeBg: "#EAF7EE",
    },

    {
      hash: "0xF3a1...9902",
      fullHash:
        "0xF3a19902ab9181ff882",
      type: "RECEIPT",
      passport: "GP-9781",
      title:
        "Sales receipt RCP-0437 generated",
      desc:
        "Digital receipt minted to blockchain",
      time: "16:10",
      date: "Mar 06, 2026",
      color: "#EA8A00",
      badgeBg: "#FFF4E6",
    },

    {
      hash: "0xD44e...0C11",
      fullHash:
        "0xD44e0C11a91811bb821",
      type: "SCAN",
      passport: "GP-9855",
      title:
        "Passport GP-9855 scan in transit",
      desc:
        "Verification still pending confirmation",
      time: "13:30",
      date: "Mar 20, 2026",
      color: "#9333EA",
      badgeBg: "#F5EFFF",
    },

    {
      hash: "0x22A1...7713",
      fullHash:
        "0x22A17713aa9811ff882",
      type: "PENDING",
      passport: "GP-9890",
      title:
        "Transfer modal opened for GP-9890",
      desc:
        "Ownership confirmation awaiting action",
      time: "10:05",
      date: "Mar 22, 2026",
      color: "#F97316",
      badgeBg: "#FFF4E6",
    },

  ];

  const filteredLogs = useMemo(() => {

    return logs.filter((log) => {

      const matchFilter =
        filter === "all"
          ? true
          : log.type.toLowerCase() ===
            filter;

      const matchSearch =
        log.hash
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        log.passport
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        log.title
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchFilter && matchSearch;

    });

  }, [filter, search]);

  const copyHash = (hash: string) => {

    navigator.clipboard.writeText(hash);

    setCopiedHash(hash);

    setTimeout(() => {
      setCopiedHash("");
    }, 2000);

  };

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          2xl:grid-cols-4
          gap-5
        "
      >

        <StatCard
          title="TOTAL ENTRIES"
          value="8"
          icon={<ShieldOutlinedIcon />}
          iconBg="#EEF4FF"
          iconColor="#2563EB"
        />

        <StatCard
          title="SALES EVENTS"
          value="2"
          icon={<ShoppingCartOutlinedIcon />}
          iconBg="#EAF7EE"
          iconColor="#16A34A"
        />

        <StatCard
          title="SCAN EVENTS"
          value="2"
          icon={<QrCodeScannerRoundedIcon />}
          iconBg="#F5EFFF"
          iconColor="#9333EA"
        />

        <StatCard
          title="PENDING"
          value="1"
          icon={<PendingOutlinedIcon />}
          iconBg="#FFF4E6"
          iconColor="#EA8A00"
        />

      </div>

      {/* MAIN CARD */}
      <div
        className="
          bg-white
          border border-[#ECECEC]
          rounded-[30px]
          overflow-hidden
          shadow-[0_10px_40px_rgba(0,0,0,0.03)]
        "
      >

        {/* HEADER */}
        <div
          className="
            px-6 py-5
            border-b border-[#F2F2F2]
            flex flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-5
          "
        >

          {/* LEFT */}
          <div className="flex items-start gap-4">

            <div
              className="
                w-11 h-11 rounded-2xl
                bg-[#EEF7F1]
                text-[#166B2D]
                flex items-center justify-center
              "
            >
              <ShieldOutlinedIcon />
            </div>

            <div>

              <h2
                className="
                  text-[21px]
                  font-bold
                  text-[#111827]
                "
              >
                Immutable Retail Audit Log
              </h2>

              <p
                className="
                  text-sm text-[#9CA3AF]
                  mt-1
                "
              >
                {filteredLogs.length} entries ·
                LOOPI blockchain
              </p>

            </div>

          </div>

          {/* EXPORT */}
          <button
            className="
              flex items-center gap-2
              text-[#166B2D]
              text-sm font-bold
              tracking-[0.12em]
              uppercase
            "
          >

            <FileDownloadOutlinedIcon
              style={{ fontSize: 18 }}
            />

            Download JSON

          </button>

        </div>

        {/* FILTER BAR */}
        <div
          className="
            px-6 py-4
            border-b border-[#F5F5F5]
            flex flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-4
          "
        >

          {/* SEARCH */}
          <div
            className="
              relative
              w-full
              xl:w-[320px]
            "
          >

            <SearchRoundedIcon
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#9CA3AF]
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Hash, tx, garment..."
              className="
                w-full h-[44px]
                rounded-2xl
                border border-[#ECECEC]
                bg-[#FAFAFA]
                pl-11 pr-4
                text-sm
                outline-none
                focus:border-[#166B2D]
              "
            />

          </div>

          {/* FILTERS */}
          <div
            className="
              flex items-center gap-2
              overflow-x-auto
            "
          >

            <FilterBtn
              active={filter === "all"}
              label="All"
              onClick={() =>
                setFilter("all")
              }
            />

            <FilterBtn
              active={filter === "sale"}
              label="Sale"
              onClick={() =>
                setFilter("sale")
              }
            />

            <FilterBtn
              active={filter === "arrival"}
              label="Arrival"
              onClick={() =>
                setFilter("arrival")
              }
            />

            <FilterBtn
              active={filter === "scan"}
              label="Scan"
              onClick={() =>
                setFilter("scan")
              }
            />

            <FilterBtn
              active={filter === "receipt"}
              label="Receipt"
              onClick={() =>
                setFilter("receipt")
              }
            />

            <FilterBtn
              active={filter === "pending"}
              label="Pending"
              onClick={() =>
                setFilter("pending")
              }
            />

          </div>

        </div>

        {/* LOG LIST */}
        <div>

          {filteredLogs.map((log, index) => (

            <div
              key={index}
              className="
                px-6 py-5
                border-b border-[#F5F5F5]
                hover:bg-[#FAFAFA]
                transition-all
              "
            >

              <div
                className="
                  flex flex-col
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                  gap-5
                "
              >

                {/* LEFT */}
                <div className="flex gap-5">

                  {/* DOT */}
                  <div
                    className="
                      w-3 h-3 rounded-full
                      mt-3
                      flex-shrink-0
                    "
                    style={{
                      background: log.color,
                    }}
                  />

                  {/* CONTENT */}
                  <div>

                    {/* HASH */}
                    <div className="flex items-center gap-3 flex-wrap">

                      <button
                        onClick={() =>
                          copyHash(log.fullHash)
                        }
                        className="
                          font-bold
                          text-[#111827]
                          hover:text-[#166B2D]
                          transition-all
                        "
                      >
                        {log.hash}
                      </button>

                      {copiedHash ===
                        log.fullHash && (

                        <div
                          className="
                            flex items-center gap-1
                            text-[#16A34A]
                            text-xs font-bold
                          "
                        >

                          <CheckCircleRoundedIcon
                            style={{ fontSize: 14 }}
                          />

                          Copied

                        </div>

                      )}

                    </div>

                    {/* TITLE */}
                    <p
                      className="
                        text-[#4B5563]
                        mt-2
                        font-medium
                      "
                    >
                      Tx: {log.title}
                    </p>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-sm
                        text-[#9CA3AF]
                        mt-1
                      "
                    >
                      {log.desc}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div
                  className="
                    flex items-center gap-5
                    xl:gap-6
                    flex-wrap
                  "
                >

                  {/* TYPE */}
                  <div
                    className="
                      h-7 px-3 rounded-xl
                      text-[11px]
                      font-bold
                      tracking-[0.10em]
                      flex items-center
                    "
                    style={{
                      background: log.badgeBg,
                      color: log.color,
                    }}
                  >
                    {log.type}
                  </div>

                  {/* PASSPORT */}
                  <div
                    className="
                      h-7 px-3 rounded-xl
                      bg-[#EEF7F1]
                      text-[#166B2D]
                      text-[11px]
                      font-bold
                      flex items-center
                    "
                  >
                    {log.passport}
                  </div>

                  {/* DATE */}
                  <div className="text-right">

                    <p
                      className="
                        text-[13px]
                        font-bold
                        text-[#6B7280]
                      "
                    >
                      {log.time}
                    </p>

                    <p
                      className="
                        text-[11px]
                        text-[#A0A6B2]
                        mt-1
                      "
                    >
                      {log.date}
                    </p>

                  </div>

                  {/* VIEW */}
                  <button
                    onClick={() =>
                      setSelectedLog(log)
                    }
                    className="
                      w-9 h-9 rounded-xl
                      border border-[#ECECEC]
                      flex items-center justify-center
                      hover:bg-[#F5F5F5]
                    "
                  >

                    <OpenInNewRoundedIcon
                      style={{
                        fontSize: 18,
                        color: "#9CA3AF",
                      }}
                    />

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FOOTER */}
        <div
          className="
            h-[72px]
            px-6
            bg-[#FAFAFA]
            flex items-center justify-between
          "
        >

          <p
            className="
              text-sm
              text-[#9CA3AF]
            "
          >
            {filteredLogs.length} of 8 entries
          </p>

          <button
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
            className="
              text-[#9CA3AF]
              text-sm font-bold
              tracking-[0.12em]
              uppercase
            "
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* DETAILS MODAL */}
      {selectedLog && (

        <>
          {/* OVERLAY */}
          <div
            onClick={() =>
              setSelectedLog(null)
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
              flex items-center justify-center
              z-[9999]
              p-4
            "
          >

            <div
              className="
                w-full max-w-[560px]
                rounded-[30px]
                bg-white
                overflow-hidden
                shadow-[0_30px_90px_rgba(0,0,0,0.28)]
              "
            >

              {/* HEADER */}
              <div
                className="
                  px-6 py-5
                  border-b border-[#F2F2F2]
                  flex items-center justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-[22px]
                      font-bold
                      text-[#111827]
                    "
                  >
                    Blockchain Entry
                  </h2>

                  <p
                    className="
                      text-sm text-[#9CA3AF]
                      mt-1
                    "
                  >
                    LOOPI immutable audit data
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedLog(null)
                  }
                  className="
                    w-10 h-10 rounded-xl
                    hover:bg-[#F5F5F5]
                    flex items-center justify-center
                  "
                >
                  <CloseRoundedIcon />
                </button>

              </div>

              {/* BODY */}
              <div className="p-6 space-y-5">

                <DetailRow
                  label="Transaction Hash"
                  value={selectedLog.fullHash}
                />

                <DetailRow
                  label="Passport ID"
                  value={selectedLog.passport}
                />

                <DetailRow
                  label="Event Type"
                  value={selectedLog.type}
                />

                <DetailRow
                  label="Transaction"
                  value={selectedLog.title}
                />

                <DetailRow
                  label="Blockchain Note"
                  value={selectedLog.desc}
                />

                <DetailRow
                  label="Timestamp"
                  value={`${selectedLog.date} · ${selectedLog.time} UTC`}
                />

              </div>

              {/* FOOTER */}
              <div
                className="
                  h-[82px]
                  bg-[#FAFAFA]
                  border-t border-[#F2F2F2]
                  px-6
                  flex items-center justify-between
                "
              >

                <button
                  onClick={() =>
                    copyHash(
                      selectedLog.fullHash
                    )
                  }
                  className="
                    h-[46px]
                    px-5 rounded-2xl
                    border border-[#ECECEC]
                    bg-white
                    flex items-center gap-3
                    text-sm font-bold
                    text-[#4B5563]
                  "
                >

                  <ContentCopyRoundedIcon
                    style={{ fontSize: 18 }}
                  />

                  Copy Hash

                </button>

                <button
                  className="
                    h-[46px]
                    px-6 rounded-2xl
                    bg-[#166B2D]
                    text-white
                    text-sm font-bold
                    tracking-[0.12em]
                    shadow-[0_10px_30px_rgba(22,107,45,0.25)]
                  "
                >
                  VIEW ON BLOCKCHAIN
                </button>

              </div>

            </div>

          </div>
        </>

      )}

    </div>
  );
}

/* ======================================================== */

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
        h-[100px]
        rounded-[26px]
        border border-[#ECECEC]
        bg-white
        px-5
        flex items-center justify-between
      "
    >

      <div>

        <p
          className="
            text-[11px]
            tracking-[0.14em]
            text-[#A4AAB5]
            font-bold
          "
        >
          {title}
        </p>

        <h2
          className="
            text-[24px]
            font-black
            text-[#111827]
            mt-3
          "
        >
          {value}
        </h2>

      </div>

      <div
        className="
          w-14 h-14 rounded-2xl
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

/* ======================================================== */

function FilterBtn({
  active,
  label,
  onClick,
}: any) {

  return (
    <button
      onClick={onClick}
      className={`
        h-10 px-4 rounded-xl
        text-sm font-semibold
        border transition-all

        ${
          active
            ? "bg-[#166B2D] text-white border-[#166B2D]"
            : "bg-white text-[#6B7280] border-[#ECECEC]"
        }
      `}
    >
      {label}
    </button>
  );
}

/* ======================================================== */

function DetailRow({
  label,
  value,
}: any) {

  return (
    <div
      className="
        rounded-2xl
        border border-[#ECECEC]
        bg-[#FAFAFA]
        p-4
      "
    >

      <p
        className="
          text-[11px]
          tracking-[0.12em]
          text-[#9CA3AF]
          font-bold
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-[#111827]
          font-semibold
          break-all
        "
      >
        {value}
      </p>

    </div>
  );
}
