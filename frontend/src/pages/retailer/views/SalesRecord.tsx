import { useState } from "react";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function SalesRecord() {

  const [exportModal, setExportModal] =
    useState(false);

  const sales = [

    {
      saleId: "SALE-0441",
      passport: "GP-9811",
      product: "Eco Denim Jacket",
      buyer: "Consumer #882",
      price: "€89.00",
      net: "€74.79",
      tax: "19%",
      date: "Mar 10, 2026",
      receipt: "RCP-0441",
    },

    {
      saleId: "SALE-0440",
      passport: "GP-9799",
      product: "Silk Blend Blouse",
      buyer: "Consumer #799",
      price: "€74.00",
      net: "€62.18",
      tax: "19%",
      date: "Mar 08, 2026",
      receipt: "RCP-0440",
    },

    {
      saleId: "SALE-0437",
      passport: "GP-9781",
      product: "Hemp Cargo Pants",
      buyer: "Consumer #650",
      price: "€112.00",
      net: "€94.12",
      tax: "19%",
      date: "Mar 06, 2026",
      receipt: "RCP-0437",
    },

    {
      saleId: "SALE-0434",
      passport: "GP-9770",
      product: "Recycled Down Vest",
      buyer: "Consumer #487",
      price: "€145.00",
      net: "€121.85",
      tax: "19%",
      date: "Mar 04, 2026",
      receipt: "RCP-0434",
    },

    {
      saleId: "SALE-0430",
      passport: "GP-9755",
      product: "Bamboo Sweatshirt",
      buyer: "Consumer #321",
      price: "€58.00",
      net: "€48.74",
      tax: "19%",
      date: "Mar 01, 2026",
      receipt: "RCP-0430",
    },

    {
      saleId: "SALE-0428",
      passport: "GP-9741",
      product: "Organic Linen Dress",
      buyer: "Consumer #203",
      price: "€99.00",
      net: "€83.19",
      tax: "19%",
      date: "Feb 28, 2026",
      receipt: "RCP-0428",
    },

  ];

  const revenueData = [
    { month: "Sep", value: 420 },
    { month: "Oct", value: 610 },
    { month: "Nov", value: 820 },
    { month: "Dec", value: 1120 },
    { month: "Jan", value: 580 },
    { month: "Feb", value: 780 },
    { month: "Mar", value: 577 },
  ];

  const maxValue =
    Math.max(
      ...revenueData.map((d) => d.value)
    );

  return (
    <div className="space-y-6">

      {/* TOP */}
      <div
        className="
          flex flex-col
          2xl:flex-row
          2xl:items-center
          2xl:justify-between
          gap-5
        "
      >
</div>

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
          title="TOTAL REVENUE (MO)"
          value="€577"
          icon={<TrendingUpRoundedIcon />}
          iconBg="#EAF7EE"
          iconColor="#166B2D"
        />

        <StatCard
          title="TRANSACTIONS"
          value="6"
          icon={<PaymentsOutlinedIcon />}
          iconBg="#EEF4FF"
          iconColor="#2563EB"
        />

        <StatCard
          title="VAT COLLECTED"
          value="€109.63"
          icon={<ReceiptLongOutlinedIcon />}
          iconBg="#FFF4E6"
          iconColor="#EA8A00"
        />

        <StatCard
          title="AVG ORDER VALUE"
          value="€96"
          icon={<SellOutlinedIcon />}
          iconBg="#F5EFFF"
          iconColor="#9333EA"
        />

      </div>

      {/* CHART + TAX */}
      <div
        className="
          grid grid-cols-1
          xl:grid-cols-[1.8fr_0.9fr]
          gap-5
        "
      >

        {/* CHART */}
        <div
          className="
            bg-white
            border border-[#ECECEC]
            rounded-[30px]
            p-6
            shadow-[0_10px_40px_rgba(0,0,0,0.03)]
          "
        >

          {/* HEADER */}
          <div className="flex items-center justify-between">

            <div>

              <h2
                className="
                  text-[20px]
                  font-bold
                  text-[#111827]
                "
              >
                Monthly Revenue
              </h2>

              <p
                className="
                  text-sm
                  text-[#9CA3AF]
                  mt-1
                "
              >
                € · last 7 months
              </p>

            </div>

            <button
              onClick={() =>
                setExportModal(true)
              }
              className="
                h-10 px-4 rounded-xl
                border border-[#ECECEC]
                bg-[#FAFAFA]
                flex items-center gap-2
                text-sm font-semibold
                text-[#6B7280]
              "
            >

              <FileDownloadOutlinedIcon
                style={{ fontSize: 18 }}
              />

              Export

            </button>

          </div>

          {/* CHART */}
          <div
            className="
              h-[230px]
              flex items-end gap-3
              mt-10
            "
          >

            {revenueData.map((bar, index) => (

              <div
                key={index}
                className="
                  flex-1
                  flex flex-col
                  items-center
                "
              >

                <p
                  className="
                    text-[11px]
                    text-[#9CA3AF]
                    mb-3
                    font-semibold
                  "
                >
                  €{bar.value}
                </p>

                <div
                  className="
                    w-full rounded-t-2xl
                    transition-all
                  "
                  style={{
                    height:
                      `${(bar.value / maxValue) * 140}px`,
                    background:
                      index === 6
                        ? "#166B2D"
                        : "#A8E6B8",
                  }}
                />

                <p
                  className="
                    mt-4
                    text-[12px]
                    font-semibold
                    text-[#9CA3AF]
                  "
                >
                  {bar.month}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* TAX CARD */}
        <div
          className="
            bg-[#166B2D]
            rounded-[30px]
            p-6
            text-white
            shadow-[0_20px_50px_rgba(22,107,45,0.25)]
          "
        >

          <p
            className="
              text-[11px]
              tracking-[0.14em]
              font-bold
              text-[#B7D8BF]
            "
          >
            TAX SUMMARY · MARCH 2026
          </p>

          <h1
            className="
              text-[30px]
              leading-none
              font-black
              mt-4
            "
          >
            €109.63
          </h1>

          <p
            className="
              text-[#B7D8BF]
              mt-3
              text-lg
            "
          >
            VAT 19% collected
          </p>

          <div
            className="
              mt-8
              border-t border-white/10
              pt-6
              space-y-5
            "
          >

            <TaxRow
              label="Gross Revenue"
              value="€577"
            />

            <TaxRow
              label="Net Revenue"
              value="€467"
            />

            <TaxRow
              label="Transactions"
              value="6"
            />

          </div>

          <button
            className="
              mt-8
              w-full h-[50px]
              rounded-2xl
              border border-white/20
              bg-white/10
              backdrop-blur-sm
              text-white
              text-sm font-bold
              tracking-[0.12em]
              flex items-center justify-center gap-3
            "
          >

            <FileDownloadOutlinedIcon
              style={{ fontSize: 18 }}
            />

            DOWNLOAD TAX REPORT

          </button>

        </div>

      </div>

      {/* SALES LEDGER */}
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

          <div>

            <h2
              className="
                text-[20px]
                font-bold
                text-[#111827]
              "
            >
              Sales Ledger
            </h2>

            <p
              className="
                text-sm
                text-[#9CA3AF]
                mt-1
              "
            >
              Blockchain-backed receipts ·
              Digital verification
            </p>

          </div>

          {/* ACTIONS */}
          <div
            className="
              flex flex-wrap
              items-center gap-3
            "
          >

            {/* SEARCH */}
            <div
              className="
                relative
                w-full
                sm:w-[250px]
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
                placeholder="Sale ID, garment..."
                className="
                  w-full h-[44px]
                  rounded-2xl
                  border border-[#ECECEC]
                  bg-[#FAFAFA]
                  pl-11 pr-4
                  text-sm
                  outline-none
                "
              />

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <div className="min-w-[1200px]">

            {/* HEADERS */}
            <div
              className="
                grid
                grid-cols-[1fr_0.9fr_1.3fr_1fr_0.8fr_0.7fr_0.6fr_0.8fr_0.9fr]
                px-6 py-4
                border-b border-[#F5F5F5]
                text-[11px]
                uppercase
                tracking-[0.14em]
                text-[#B4BAC4]
                font-bold
              "
            >

              <div>Sale ID</div>
              <div>Garment</div>
              <div>Product</div>
              <div>Buyer</div>
              <div>Price</div>
              <div>Net</div>
              <div>Tax</div>
              <div>Date</div>
              <div>Receipt</div>

            </div>

            {/* ROWS */}
            {sales.map((sale, index) => (

              <div
                key={index}
                className="
                  grid
                  grid-cols-[1fr_0.9fr_1.3fr_1fr_0.8fr_0.7fr_0.6fr_0.8fr_0.9fr]
                  px-6 py-5
                  border-b border-[#F7F7F7]
                  items-center
                  hover:bg-[#FAFAFA]
                  transition-all
                "
              >

                <div
                  className="
                    font-bold
                    text-[#111827]
                  "
                >
                  {sale.saleId}
                </div>

                <div
                  className="
                    text-[#2563EB]
                    text-sm
                    font-bold
                  "
                >
                  {sale.passport}
                </div>

                <div
                  className="
                    font-semibold
                    text-[#111827]
                  "
                >
                  {sale.product}
                </div>

                <div
                  className="
                    text-sm
                    text-[#6B7280]
                  "
                >
                  {sale.buyer}
                </div>

                <div
                  className="
                    font-bold
                    text-[#166B2D]
                  "
                >
                  {sale.price}
                </div>

                <div
                  className="
                    text-sm
                    text-[#6B7280]
                  "
                >
                  {sale.net}
                </div>

                <div
                  className="
                    text-sm
                    text-[#6B7280]
                  "
                >
                  {sale.tax}
                </div>

                <div
                  className="
                    text-sm
                    text-[#9CA3AF]
                  "
                >
                  {sale.date}
                </div>

                <button
                  className="
                    h-10 px-4 rounded-xl
                    border border-[#ECECEC]
                    bg-[#FAFAFA]
                    flex items-center gap-2
                    text-sm font-bold
                    text-[#4B5563]
                    w-fit
                  "
                >

                  <ReceiptLongOutlinedIcon
                    style={{ fontSize: 16 }}
                  />

                  {sale.receipt}

                </button>

              </div>

            ))}

          </div>

        </div>

        {/* FOOTER */}
        <div
          className="
            px-6 py-5
            bg-[#FAFAFA]
            flex flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <p
            className="
              text-sm
              text-[#9CA3AF]
            "
          >
            6 transactions ·
            All on-chain
          </p>

          <button
            onClick={() =>
              setExportModal(true)
            }
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

            Export Tax Records

          </button>

        </div>

      </div>

      {/* EXPORT MODAL */}
      {exportModal && (

        <>
          {/* OVERLAY */}
          <div
            onClick={() =>
              setExportModal(false)
            }
            className="
              fixed inset-0
              bg-black/45
              backdrop-blur-sm
              z-[120]
            "
          />

          {/* MODAL */}
          <div
            className="
              fixed inset-0
              flex items-center justify-center
              z-[130]
              p-4
            "
          >

            <div
              className="
                w-full max-w-[420px]
                rounded-[30px]
                bg-white
                shadow-[0_25px_80px_rgba(0,0,0,0.28)]
                overflow-hidden
              "
            >

              {/* HEADER */}
              <div className="p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <h2
                      className="
                        text-[22px]
                        leading-none
                        font-bold
                        text-[#111827]
                      "
                    >
                      Export Tax Records
                    </h2>

                    <p
                      className="
                        text-sm
                        text-[#9CA3AF]
                        mt-4
                      "
                    >
                      FashForward GmbH ·
                      March 2026
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setExportModal(false)
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

                {/* OPTIONS */}
                <div className="space-y-3 mt-6">

                  <ExportCard
                    title="CSV — Spreadsheet"
                    desc="For accounting software"
                  />

                  <ExportCard
                    title="PDF — Tax Report"
                    desc="EU VAT compliant format"
                  />

                  <ExportCard
                    title="JSON — API Format"
                    desc="For system integration"
                  />

                  <ExportCard
                    title="EU DPP Ledger"
                    desc="Official regulatory export"
                  />

                </div>

              </div>

              {/* FOOTER */}
              <div
                className="
                  h-[60px]
                  border-t border-[#F2F2F2]
                  bg-[#FAFAFA]
                  px-6
                  flex items-center justify-end
                "
              >

                <button
                  onClick={() =>
                    setExportModal(false)
                  }
                  className="
                    text-[#9CA3AF]
                    font-semibold
                  "
                >
                  Cancel
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
            text-[20px]
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

function TaxRow({
  label,
  value,
}: any) {

  return (
    <div className="flex items-center justify-between">

      <p className="text-[#B7D8BF]">
        {label}
      </p>

      <p className="font-bold">
        {value}
      </p>

    </div>
  );
}

/* ======================================================== */

function ExportCard({
  title,
  desc,
}: any) {

  return (
    <button
      className="
        w-full p-5 rounded-2xl
        border border-[#ECECEC]
        bg-[#FAFAFA]
        hover:bg-[#F5F5F5]
        transition-all
        flex items-center justify-between
      "
    >

      <div className="text-left">

        <p
          className="
            font-bold
            text-[#111827]
          "
        >
          {title}
        </p>

        <p
          className="
            text-sm
            text-[#9CA3AF]
            mt-1
          "
        >
          {desc}
        </p>

      </div>

      <OpenInNewRoundedIcon
        style={{
          fontSize: 18,
          color: "#9CA3AF",
        }}
      />

    </button>
  );
}