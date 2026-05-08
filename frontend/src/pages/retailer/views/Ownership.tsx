import { useState } from "react";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";

export default function Ownership() {

  const [filter, setFilter] =
    useState("all");

  const transfers = [

    {
      id: "TRX-1001",
      passport: "GP-9821",
      item: "Recycled Wool Blazer",
      from: "FashForward GmbH",
      to: "Consumer · 0x8821...F92A",
      type: "SALE",
      date: "Mar 19, 2026",
      amount: "€129.00",
      icon: "sale",
    },

    {
      id: "TRX-1002",
      passport: "GP-9877",
      item: "Organic Cotton Tee",
      from: "Logistics FL-AMS-02",
      to: "FashForward GmbH",
      type: "ARRIVAL",
      date: "Mar 15, 2026",
      amount: "€39.00",
      icon: "arrival",
    },

    {
      id: "TRX-1003",
      passport: "GP-9821",
      item: "Recycled Wool Blazer",
      from: "Logistics FL-STK-01",
      to: "FashForward GmbH",
      type: "ARRIVAL",
      date: "Mar 15, 2026",
      amount: "€129.00",
      icon: "arrival",
    },

    {
      id: "TRX-1004",
      passport: "GP-9821",
      item: "Recycled Wool Blazer",
      from: "Sthlm-MF-01",
      to: "Logistics FL-STK-01",
      type: "DISPATCH",
      date: "Mar 12, 2026",
      amount: "€129.00",
      icon: "dispatch",
    },

    {
      id: "TRX-1005",
      passport: "GP-9799",
      item: "Eco Denim Jacket",
      from: "FashForward GmbH",
      to: "Consumer · 0x2210...F4A1",
      type: "SALE",
      date: "Mar 08, 2026",
      amount: "€89.00",
      icon: "sale",
    },

    {
      id: "TRX-1006",
      passport: "GP-9799",
      item: "Eco Denim Jacket",
      from: "Porto-MF-04",
      to: "Logistics FL-PRT-03",
      type: "DISPATCH",
      date: "Mar 05, 2026",
      amount: "€89.00",
      icon: "dispatch",
    },

  ];

  const filteredTransfers =
    filter === "all"
      ? transfers
      : transfers.filter(
          (t) =>
            t.type.toLowerCase() === filter
        );

  return (
    <div className="space-y-6">

      {/* TOP BAR */}
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

      {/* DASHBOARD */}
      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-4
          gap-5 
        "
      >

        <StatCard
          title="TOTAL TRANSFERS"
          value="6"
          icon={<HubOutlinedIcon />}
          iconColor="#166B2D"
          iconBg="#EAF7EE"
        />

        <StatCard
          title="SALES RECORDED"
          value="2"
          icon={<ShoppingCartOutlinedIcon />}
          iconColor="#9333EA"
          iconBg="#F3E8FF"
        />

        <StatCard
          title="ARRIVALS"
          value="2"
          icon={<Inventory2OutlinedIcon />}
          iconColor="#2563EB"
          iconBg="#EEF4FF"
        />

        <StatCard
          title="DISPATCHED"
          value="2"
          icon={<ArrowOutwardRoundedIcon />}
          iconColor="#EA8A00"
          iconBg="#FFF4E6"
        />

      </div>

      {/* MAIN TABLE */}
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
              Ownership Transfer History
            </h2>

            <p
              className="
                text-sm
                text-[#9CA3AF]
                mt-1
              "
            >
              Immutable blockchain transfer records
            </p>

          </div>

          {/* FILTERS */}
          <div
            className="
              flex flex-wrap
              items-center
              gap-2
              w-full
              xl:w-auto
            "
          >

            <FilterBtn
              active={filter === "all"}
              label="All"
              onClick={() => setFilter("all")}
            />

            <FilterBtn
              active={filter === "sale"}
              label="Sale"
              onClick={() => setFilter("sale")}
            />

            <FilterBtn
              active={filter === "arrival"}
              label="Arrival"
              onClick={() => setFilter("arrival")}
            />

            <FilterBtn
              active={filter === "dispatch"}
              label="Dispatch"
              onClick={() =>
                setFilter("dispatch")
              }
            />

            <button
              className="
                w-10 h-10 rounded-xl
                border border-[#ECECEC]
                flex items-center justify-center
                hover:bg-[#FAFAFA]
              "
            >

              <AutorenewRoundedIcon
                style={{
                  fontSize: 18,
                  color: "#9CA3AF",
                }}
              />

            </button>

            <div
            className="
              relative
              w-full
              sm:w-[260px]
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
            placeholder="Search ownership..."
            className="
              w-full h-[48px]
              rounded-2xl
              border border-[#ECECEC]
              bg-white
              pl-12 pr-4
              text-sm
              outline-none
              focus:border-[#166B2D]
            "
          />

        </div>

          </div>

        </div>

        {/* LIST */}
        <div>

          {filteredTransfers.map((item, index) => (

            <div
              key={index}
              className="
                relative
                px-6 py-6
                border-b border-[#F5F5F5]
                hover:bg-[#FAFAFA]
                transition-all
              "
            >

              <div
                className="
                  flex flex-col
                  lg:flex-row
                  lg:items-start
                  lg:justify-between
                  gap-5
                "
              >

                {/* LEFT */}
                <div
                  className="
                    flex
                    items-start
                    gap-4
                    min-w-0
                  "
                >

                  {/* ICON */}
                  <div
                    className={`
                      mt-1
                      w-11 h-11 rounded-full
                      flex items-center justify-center
                    `}
                    style={{
                      background:
                        item.type === "SALE"
                          ? "#EAF7EE"
                          : item.type === "ARRIVAL"
                          ? "#EEF4FF"
                          : "#F3F4F6",
                    }}
                  >

                    {item.type === "SALE" && (
                      <ShoppingCartOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#16A34A",
                        }}
                      />
                    )}

                    {item.type === "ARRIVAL" && (
                      <LocalShippingOutlinedIcon
                        style={{
                          fontSize: 20,
                          color: "#2563EB",
                        }}
                      />
                    )}

                    {item.type === "DISPATCH" && (
                      <ArrowOutwardRoundedIcon
                        style={{
                          fontSize: 20,
                          color: "#6B7280",
                        }}
                      />
                    )}

                  </div>

                  {/* CONTENT */}
                  <div>

                    {/* TOP */}
                    <div className="flex items-center gap-3 flex-wrap">

                    <p
                      className="
                        font-bold
                        text-[#271c11]
                        text-[14px]
                        sm:text-[15px]
                        break-words
                      "
                    >
                        {item.from}
                      </p>

                      <ArrowOutwardRoundedIcon
                        style={{
                          fontSize: 16,
                          color: "#9CA3AF",
                        }}
                      />

                      <p
                        className="
                          font-bold
                          text-[#271c11]
                          text-[14px]
                          sm:text-[15px]
                          break-words
                        "
                      >
                        {item.to}
                      </p>

                      <TypeBadge
                        type={item.type}
                      />

                    </div>

                    {/* PASSPORT */}
                    <div
                      className="
                        flex items-center gap-3
                        mt-3
                        flex-wrap
                      "
                    >

                      <p
                        className="
                          text-[11px]
                          font-bold
                          tracking-[0.12em]
                          text-[#16A34A]
                        "
                      >
                        {item.passport}
                      </p>

                      <p
                        className="
                          text-sm
                          text-[#6B7280]
                        "
                      >
                        {item.item}
                      </p>

                    </div>

                    {/* META */}
                    <div
                      className="
                        flex items-center gap-4
                        mt-3
                        text-[11px]
                        text-[#A0A6B2]
                      "
                    >

                      <p>{item.id}</p>

                      <p>{item.amount}</p>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div
                  className="
                    text-left
                    lg:text-right
                    pl-[60px]
                    lg:pl-0
                  "
                >

                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-[#4B5563]
                    "
                  >
                    {item.date}
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-[#A0A6B2]
                      mt-1
                    "
                  >
                    14:22 UTC
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FOOTER */}
        <div
          className="
            px-6 py-4
            flex flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            bg-[#FAFAFA]
          "
        >

          <p
            className="
              text-sm
              text-[#9CA3AF]
            "
          >
            6 transfers · Blockchain verified
          </p>

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

            Export

          </button>

        </div>

      </div>

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
            text-[12px]
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
            leading-none
            font-bold
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
          color: iconColor, }}
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
            ? "bg-[#111827] text-white border-[#111827]"
            : "bg-white text-[#6B7280] border-[#ECECEC]"
        }
      `}
    >
      {label}
    </button>
  );
}

/* ======================================================== */

function TypeBadge({
  type,
}: any) {

  const styles: any = {

    SALE:
      "bg-[#EAF7EE] text-[#16A34A]",

    ARRIVAL:
      "bg-[#EEF4FF] text-[#2563EB]",

    DISPATCH:
      "bg-[#F3F4F6] text-[#6B7280]",

  };

  return (
    <div
      className={`
        h-6 px-2 rounded-lg
        text-[10px]
        font-bold
        tracking-[0.10em]
        flex items-center
        ${styles[type]}
      `}
    >
      {type}
    </div>
  );
}