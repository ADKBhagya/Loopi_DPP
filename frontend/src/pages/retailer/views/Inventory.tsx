import { useState } from "react";
import useQRScanner from "../../../hooks/useQRScanner";
import QRScannerModal from "../../../components/qr/QRScannerModal";
import QRResultCard from "../../../components/qr/QRResultCard";

/* ICONS */
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

export default function Inventory() {

    const {
  scannerOpen,
  scannerLoading,
  scanSuccess,
  startScanner,
  closeScanner,
  simulateScan,
} = useQRScanner();

  const [filter, setFilter] =
    useState("all");

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  const [transferModal, setTransferModal] =
    useState<any>(null);

  const inventory = [
    {
      id: "GP-9821",
      name: "Recycled Wool Blazer",
      brand: "EcoWeave",
      material: "Wool 60%, PET 40%",
      grade: "A+",
      price: "€129.00",
      status: "IN STORE",
      owner: "FashForward GmbH",
      received: "2026-03-15",
    },

    {
      id: "GP-9811",
      name: "Eco Denim Jacket",
      brand: "DenimKind",
      material: "Organic Cotton 100%",
      grade: "A",
      price: "€89.00",
      status: "SOLD",
      owner: "Consumer #882",
      received: "2026-03-10",
    },

    {
      id: "GP-9855",
      name: "Linen Shirt",
      brand: "Naturalia",
      material: "Linen 100%",
      grade: "A+",
      price: "€54.00",
      status: "IN TRANSIT",
      owner: "Logistics FL-STK-01",
      received: "Pending",
    },

    {
      id: "GP-9877",
      name: "Organic Cotton Tee",
      brand: "TerraThread",
      material: "Cotton 95%, EA 5%",
      grade: "A",
      price: "€39.00",
      status: "IN STORE",
      owner: "FashForward GmbH",
      received: "2026-03-18",
    },

    {
      id: "GP-9890",
      name: "Recycled Polyester Jacket",
      brand: "EcoWeave",
      material: "rPET 80%, Cotton 20%",
      grade: "B+",
      price: "€159.00",
      status: "IN STORE",
      owner: "FashForward GmbH",
      received: "2026-03-20",
    },
  ];

  return (
    <div className="space-y-6">

      {/* TOP SECTION */}
      <div
        className="
          flex flex-col
          2xl:flex-row
          2xl:items-center
          2xl:justify-between
          gap-5
        "
      >

        {/* LEFT */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">

          {/* SCAN BTN */}
            <button
            onClick={startScanner}
            className="
              h-[70px]
              px-6
              rounded-2xl
              bg-[#166B2D]
              text-white
              shadow-[0_10px_30px_rgba(22,107,45,0.25)]
              flex items-center gap-4
              hover:scale-[1.01]
              active:scale-[0.99]
              transition-all
            "
          >

            <div
              className="
                w-10 h-10 rounded-xl
                bg-white/10
                flex items-center justify-center
              "
            >
              <QrCodeScannerRoundedIcon />
            </div>

            <div className="text-left">
              <p className="text-[17px] font-bold leading-none">
                SCAN PASSPORT
              </p>

              <p className="text-[11px] opacity-80 mt-1 tracking-wide">
                VERIFY & RECEIVE
              </p>
            </div>

          </button>

          {/* SMALL STATS */}
          <div className="flex items-center gap-8">

            <MiniStat
              label="INVENTORY"
              value="24"
            />

            <MiniStat
              label="SALES"
              value="182"
            />

          </div>

        </div>

        {/* SEARCH */}
        <div className="relative w-full 2xl:w-[280px]">

          <SearchRoundedIcon
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            placeholder="Search Store Inventory..."
            className="
              w-full h-[52px]
              rounded-2xl
              border border-gray-200
              bg-white
              pl-12 pr-4
              text-sm
              outline-none
              focus:border-[#166B2D]
              transition-all
            "
          />

        </div>

      </div>

      {/* DASHBOARD STATS */}
      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-4
          gap-5
        "
      >

        <Card
          title="IN STORE"
          value="3"
          icon={<Inventory2OutlinedIcon />}
          iconBg="#DDEADF"
          iconColor="#166B2D"
        />

        <Card
          title="IN TRANSIT"
          value="1"
          icon={<LocalShippingOutlinedIcon />}
          iconBg="#E2EAFE"
          iconColor="#2563EB"
        />

        <Card
          title="SOLD TOTAL"
          value="1"
          icon={<ShoppingCartOutlinedIcon />}
          iconBg="#F3E4FF"
          iconColor="#9333EA"
        />

        <Card
          title="ALL TRACKED"
          value="5"
          icon={<CategoryOutlinedIcon />}
          iconBg="#FEEDD1"
          iconColor="#EA8A00"
        />

      </div>

      {/* MAIN TABLE */}
      <div
        className="
          bg-white
          border border-[#ECECEC]
          rounded-[28px]
          overflow-hidden
          shadow-[0_10px_40px_rgba(0,0,0,0.03)]
        "
      >

        {/* TABLE HEADER */}
        <div
          className="
            px-6 py-5
            flex flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-5
            border-b border-[#F2F2F2]
          "
        >

          <div>

            <h2 className="text-[28px] font-bold text-[#1B1F28]">
              Active Inventory
            </h2>

            <p className="text-sm text-[#9CA3AF] mt-1">
              Manage product passports and ownership transfers
            </p>

          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto">

            <FilterBtn
              active={filter === "all"}
              label="All"
              onClick={() => setFilter("all")}
            />

            <FilterBtn
              active={filter === "store"}
              label="In Store"
              onClick={() => setFilter("store")}
            />

            <FilterBtn
              active={filter === "transit"}
              label="In Transit"
              onClick={() => setFilter("transit")}
            />

            <FilterBtn
              active={filter === "sold"}
              label="Sold"
              onClick={() => setFilter("sold")}
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto overflow-y-hidden">

          <div className="min-w-max">

            {/* TABLE HEADERS */}
            <div
              className="
                grid
                grid-cols-[1fr_1.7fr_1.4fr_0.7fr_0.9fr_1fr_1.4fr_1fr_1fr]
                px-6 py-4
                border-b border-[#F4F4F4]
                text-[11px]
                uppercase
                tracking-[0.14em]
                text-[#B4BAC4]
                font-bold
              "
            >

              <div>Product ID</div>
              <div>Name & Brand</div>
              <div>Material</div>
              <div>Grade</div>
              <div>Price</div>
              <div>Status</div>
              <div>Owner</div>
              <div>Received</div>
              <div>Actions</div>

            </div>

            {/* ROWS */}
            {inventory.map((item, index) => (

              <div
                key={index}
                className="
                  grid
                  grid-cols-[1fr_1.7fr_1.4fr_0.7fr_0.9fr_1fr_1.4fr_1fr_1fr]
                  px-6 py-5
                  border-b border-[#F8F8F8]
                  items-center
                  hover:bg-[#FAFAFA]
                  transition-all
                "
              >

                {/* ID */}
                <div>

                  <p className="font-bold text-[#1B1F28]">
                    {item.id}
                  </p>

                </div>

                {/* NAME */}
                <div>

                  <p className="font-bold text-[#1B1F28]">
                    {item.name}
                  </p>

                  <p className="text-sm text-[#A0A6B2] mt-1">
                    {item.brand}
                  </p>

                </div>

                {/* MATERIAL */}
                <div className="text-sm text-[#6B7280]">
                  {item.material}
                </div>

                {/* GRADE */}
                <div>

                  <Grade grade={item.grade} />

                </div>

                {/* PRICE */}
                <div className="font-bold text-[#1B1F28]">
                  {item.price}
                </div>

                {/* STATUS */}
                <div>

                  <Status status={item.status} />

                </div>

                {/* OWNER */}
                <div
                  className="
                    flex items-center gap-2
                    text-sm text-[#6B7280]
                  "
                >

                  <PersonOutlineOutlinedIcon
                    style={{ fontSize: 16 }}
                  />

                  {item.owner}

                </div>

                {/* RECEIVED */}
                <div className="text-sm text-[#9CA3AF]">
                  {item.received}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  {/* VIEW */}
                  <button
                    onClick={() =>
                      setSelectedProduct(item)
                    }
                    className="
                      w-9 h-9 rounded-xl
                      border border-[#ECECEC]
                      flex items-center justify-center
                      hover:bg-[#F8F8F8]
                      transition-all
                    "
                  >
                    <RemoveRedEyeOutlinedIcon
                      style={{ fontSize: 18 }}
                    />
                  </button>

                  {/* TRANSFER */}
                  {item.status !== "SOLD" && (

                    <button
                      onClick={() =>
                        setTransferModal(item)
                      }
                      className="
                        h-9 px-4 rounded-xl
                        bg-[#EEF5EF]
                        border border-[#DDEADF]
                        text-[#166B2D]
                        text-[12px]
                        font-bold
                        tracking-[0.12em]
                        hover:bg-[#E3F0E5]
                        transition-all
                      "
                    >
                      TRANSFER
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* FOOTER */}
        <div
          className="
            px-6 py-5
            flex flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          <p className="text-sm text-[#A0A6B2]">
            5 items · All passports blockchain-tracked
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

      {/* PASSPORT DRAWER */}
      {selectedProduct && (

        <PassportDrawer
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        onTransfer={() => {
        setSelectedProduct(null);
        setTransferModal(selectedProduct);
        }}
        />

      )}

      {/* TRANSFER MODAL */}
      {transferModal && (

        <TransferOwnershipModal
          product={transferModal}
          onClose={() =>
            setTransferModal(null)
          }
        />

      )}

      <QRScannerModal
            open={scannerOpen}
            loading={scannerLoading}
            onClose={closeScanner}
            onScan={simulateScan}
            />

            <QRResultCard
            show={scanSuccess}
            />

    </div>
  );
}

/* ======================================================== */

function MiniStat({
  label,
  value,
}: any) {

  return (
    <div>

      <p
        className="
          text-[15px]
          tracking-[0.14em]
          text-[#A4AAB5]
          font-bold
        "
      >
        {label}
      </p>

      <p
        className="
          text-[24px]
          leading-none
          font-bold
          text-[#1B1F28]
          mt-1
        "
      >
        {value}
      </p>

    </div>
  );
}

/* ======================================================== */

function Card({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: any) {

  return (
    <div
      className="
        h-[110px]
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
            text-[15px]
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
            text-[#1B1F28]
            mt-2
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

function Grade({
  grade,
}: any) {

  const styles: any = {
    "A+": "bg-[#E8F7EC] text-[#16A34A]",
    A: "bg-[#E8EEFF] text-[#2563EB]",
    "B+": "bg-[#FFF2DF] text-[#EA8A00]",
  };

  return (
    <div
      className={`
        inline-flex px-2.5 py-1
        rounded-lg text-[11px]
        font-bold
        ${styles[grade]}
      `}
    >
      {grade}
    </div>
  );
}

/* ======================================================== */

function Status({
  status,
}: any) {

  const styles: any = {
    "IN STORE":
      "bg-[#E8F7EC] text-[#16A34A]",

    SOLD:
      "bg-[#F3F4F6] text-[#6B7280]",

    "IN TRANSIT":
      "bg-[#E8EEFF] text-[#2563EB]",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full
        text-[11px] font-bold
        tracking-[0.08em]
        ${styles[status]}
      `}
    >

      <div className="w-1.5 h-1.5 rounded-full bg-current" />

      {status}

    </div>
  );
}

/* ======================================================== */

function PassportDrawer({
  product,
  onClose,
  onTransfer,
}: any) {

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/45
          backdrop-blur-[2px]
          z-[9998]
        "
      />

      {/* DRAWER */}
      <div
        className="
          fixed right-0 top-0
          h-screen
          w-full sm:w-[420px]
          bg-white
          z-[9999]
          shadow-[0_0_60px_rgba(0,0,0,0.25)]
          overflow-y-auto
        "
      >

        {/* HEADER */}
        <div
          className="
            h-[70px]
            border-b border-[#F0F0F0]
            px-5
            flex items-center justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10 h-10 rounded-xl
                bg-[#166B2D]
                text-white
                flex items-center justify-center
              "
            >
              <CategoryOutlinedIcon />
            </div>

            <div>
              <p className="font-bold text-[#1B1F28]">
                Digital Product Passport
              </p>

              <p className="text-xs text-[#9CA3AF]">
                {product.id}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="
              w-9 h-9 rounded-xl
              hover:bg-[#F5F5F5]
              flex items-center justify-center
            "
          >
            <CloseRoundedIcon />
          </button>

        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">

          {/* HERO CARD */}
          <div
            className="
              rounded-[28px]
              border border-[#E7ECE8]
              bg-[#F2F7F3]
              p-6
              text-center
            "
          >

            <div
              className="
                w-16 h-16 mx-auto
                rounded-2xl
                bg-white
                flex items-center justify-center
                shadow-sm
              "
            >
              <CategoryOutlinedIcon
                style={{
                  color: "#166B2D",
                  fontSize: 28,
                }}
              />
            </div>

            <h2
              className="
                text-[24px]
                leading-tight
                font-bold
                text-[#1B1F28]
                mt-5
              "
            >
              {product.name}
            </h2>

            <p className="text-[#9CA3AF] mt-2">
              {product.brand}
            </p>

            <div className="flex justify-center gap-2 mt-5">

              <div
                className="
                  h-8 px-3 rounded-lg
                  bg-[#E7F7EC]
                  text-[#16A34A]
                  text-xs font-bold
                  flex items-center
                "
              >
                Grade {product.grade}
              </div>

              <div
                className="
                  h-8 px-3 rounded-lg
                  bg-[#EAF5EC]
                  text-[#166B2D]
                  text-xs font-bold
                  flex items-center
                "
              >
                LOOPI Verified
              </div>

            </div>

          </div>

          {/* PRODUCT DETAILS */}
          <div
            className="
              rounded-[24px]
              border border-[#ECECEC]
              p-4
            "
          >

            <p
              className="
                text-[11px]
                tracking-[0.14em]
                text-[#A4AAB5]
                font-bold
                mb-4
              "
            >
              PRODUCT DETAILS
            </p>

            <div className="grid grid-cols-2 gap-3">

              <DetailCard
                icon={<BadgeOutlinedIcon />}
                label="PASSPORT ID"
                value={product.id}
              />

              <DetailCard
                icon={<PaidOutlinedIcon />}
                label="PRICE"
                value={product.price}
              />

              <DetailCard
                icon={<InventoryOutlinedIcon />}
                label="MATERIAL"
                value={product.material}
              />

              <DetailCard
                icon={<VerifiedRoundedIcon />}
                label="STATUS"
                value={product.status}
              />

              <DetailCard
                icon={<CalendarMonthOutlinedIcon />}
                label="RECEIVED"
                value={product.received}
              />

              <DetailCard
                icon={<PersonOutlineOutlinedIcon />}
                label="OWNER"
                value={product.owner}
              />

            </div>

          </div>

          {/* SUSTAINABILITY */}
          <div
            className="
              rounded-[24px]
              border border-[#ECECEC]
              p-4
            "
          >

            <p
              className="
                text-[11px]
                tracking-[0.14em]
                text-[#A4AAB5]
                font-bold
                mb-4
              "
            >
              SUSTAINABILITY DATA
            </p>

            <div className="space-y-3">

              <div
                className="
                  h-[54px]
                  rounded-2xl
                  bg-[#EEF7F1]
                  border border-[#DDEADF]
                  px-4
                  flex items-center justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-9 h-9 rounded-xl
                      bg-white
                      flex items-center justify-center
                    "
                  >
                    <SpaOutlinedIcon
                    style={{
                        color: "#16A34A",
                        fontSize: 20,
                    }}
                    />
                  </div>

                  <p className="font-semibold text-[#1B1F28]">
                    Carbon Footprint
                  </p>

                </div>

                <p className="font-bold text-[#16A34A]">
                  4.2 kg CO₂e
                </p>

              </div>

              <div
                className="
                  h-[54px]
                  rounded-2xl
                  bg-[#EEF4FF]
                  border border-[#DCE7FF]
                  px-4
                  flex items-center justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-9 h-9 rounded-xl
                      bg-white
                      flex items-center justify-center
                    "
                  >
                    <WaterDropOutlinedIcon
                      style={{
                        color: "#2563EB",
                        fontSize: 20,
                      }}
                    />
                  </div>

                  <p className="font-semibold text-[#1B1F28]">
                    Water Usage
                  </p>

                </div>

                <p className="font-bold text-[#2563EB]">
                  12.5 L
                </p>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-1">

            <button
              onClick={onTransfer}
              className="
                flex-1 h-[50px]
                rounded-2xl
                bg-[#166B2D]
                text-white
                font-bold
                tracking-[0.14em]
                text-sm
                hover:opacity-90
                transition-all
              "
            >
              TRANSFER OWNERSHIP
            </button>

            <button
              className="
                w-[50px] h-[50px]
                rounded-2xl
                border border-[#ECECEC]
                flex items-center justify-center
                hover:bg-[#F8F8F8]
              "
            >
              <OpenInNewRoundedIcon />
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

/* ======================================================== */

function DetailCard({
  icon,
  label,
  value,
}: any) {

  return (
    <div
      className="
        rounded-2xl
        bg-[#F7F7F7]
        border border-[#EFEFEF]
        p-4
      "
    >

      <div className="flex items-center gap-2">

        <div className="text-[#9CA3AF]">
          {icon}
        </div>

        <p
          className="
            text-[10px]
            tracking-[0.12em]
            text-[#A4AAB5]
            font-bold
          "
        >
          {label}
        </p>

      </div>

      <p
        className="
          text-[12px]
          font-bold
          text-[#1B1F28]
          mt-3
          leading-snug
        "
      >
        {value}
      </p>

    </div>
  );
}

/* ======================================================== */

function TransferOwnershipModal({
  product,
  onClose,
}: any) {

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/45
          backdrop-blur-[2px]
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
            bg-white
            rounded-[28px]
            overflow-hidden
            shadow-[0_20px_80px_rgba(0,0,0,0.28)]
          "
        >

          {/* HEADER */}
          <div
            className="
              h-[70px]
              border-b border-[#F0F0F0]
              px-6
              flex items-center justify-between
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-11 h-11 rounded-2xl
                  bg-[#2563EB]
                  text-white
                  flex items-center justify-center
                "
              >
                <SwapHorizRoundedIcon />
              </div>

              <div>

                <p className="text-[20px] font-bold text-[#1B1F28]">
                  Transfer Ownership
                </p>

                <p
                  className="
                    text-[11px]
                    tracking-[0.12em]
                    text-[#2563EB]
                    font-bold
                    mt-1
                  "
                >
                  {product.id} · {product.name.toUpperCase()}
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
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
          <div className="p-6">

            {/* PRODUCT */}
            <div
              className="
                h-[76px]
                rounded-2xl
                border border-[#ECECEC]
                bg-[#FAFAFA]
                px-5
                flex items-center justify-between
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-12 h-12 rounded-2xl
                    border border-[#E5E7EB]
                    bg-white
                    flex items-center justify-center
                  "
                >
                  <CategoryOutlinedIcon
                    style={{
                      color: "#9CA3AF",
                    }}
                  />
                </div>

                <div>

                  <p
                    className="
                      text-[11px]
                      tracking-[0.12em]
                      text-[#A4AAB5]
                      font-bold
                    "
                  >
                    PRODUCT
                  </p>

                  <p className="font-bold text-[#1B1F28] mt-1">
                    {product.id} — {product.name}
                  </p>

                </div>

              </div>

              <p className="font-bold text-[#166B2D]">
                {product.price}
              </p>

            </div>

            {/* FORM */}
            <div className="space-y-5 mt-6">

              <Input
                label="BUYER DIGITAL IDENTITY (DID)"
                placeholder="0x8821...F92A"
              />

              <div className="grid grid-cols-2 gap-4">

                <Input
                  label="SALE PRICE"
                  placeholder="129.00"
                />

                <Input
                  label="SALE DATE"
                  placeholder=""
                />

              </div>

              <Input
                label="BUYER NAME (optional)"
                placeholder="Consumer full name"
              />

            </div>

            {/* INFO */}
            <div
              className="
                mt-5
                rounded-2xl
                bg-[#EEF4FF]
                border border-[#DCE7FF]
                p-4
                flex gap-4
              "
            >

              <div className="text-[#2563EB]">
                <VerifiedRoundedIcon />
              </div>

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-[#2563EB]
                "
              >
                This will mint an
                <span className="font-bold">
                  {" "}Ownership NFT Transfer{" "}
                </span>

                on-chain. The consumer will
                receive an instant notification
                to claim their Digital Passport.
              </p>

            </div>

          </div>

          {/* FOOTER */}
          <div
            className="
              h-[84px]
              bg-[#FAFAFA]
              border-t border-[#F0F0F0]
              px-6
              flex items-center justify-end
              gap-4
            "
          >

            <button
              onClick={onClose}
              className="
                text-[#6B7280]
                font-medium
              "
            >
              Cancel
            </button>

            <button
              className="
                h-[48px]
                px-7 rounded-2xl
                bg-[#2563EB]
                text-white
                font-bold
                tracking-[0.12em]
                text-sm
                shadow-[0_10px_30px_rgba(37,99,235,0.3)]
                hover:opacity-90
                transition-all
              "
            >
              FINALISE TRANSFER
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

/* ======================================================== */

function Input({
  label,
  placeholder,
}: any) {

  return (
    <div>

      <p
        className="
          text-[11px]
          tracking-[0.12em]
          text-[#6B7280]
          font-bold
          mb-3
        "
      >
        {label}
      </p>

      <input
        placeholder={placeholder}
        className="
          w-full h-[56px]
          rounded-2xl
          border border-[#E5E7EB]
          bg-[#FAFAFA]
          px-4
          text-sm
          outline-none
          focus:border-[#2563EB]
        "
      />

    </div>
  );
}

