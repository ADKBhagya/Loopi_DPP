import { useEffect, useMemo, useRef, useState } from "react";
import QRScannerModal from "../../../components/qr/QRScannerModal";

/* ICONS */
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

export default function Processing() {

  const [search, setSearch] =
    useState("");

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showMenu, setShowMenu] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState<any>(null);

  const menuRef = useRef<any>(null);

  const [items, setItems] = useState([
    {
      id: "RCY-8801",
      passport: "GP-9811",
      garment: "Eco Denim Jacket",
      material: "Cotton (100%)",
      stage: "SORTING",
      credits: "+24",
      weight: "0.82 kg",
      date: "2026-03-20",
    },

    {
      id: "RCY-8802",
      passport: "GP-9855",
      garment: "Linen Shirt",
      material: "Linen / Poly Blend",
      stage: "FIBER RECOVERY",
      credits: "+18",
      weight: "0.45 kg",
      date: "2026-03-22",
    },

    {
      id: "RCY-8803",
      passport: "GP-9777",
      garment: "Wool Blend Coat",
      material: "Wool 60%, PET 40%",
      stage: "CHEMICAL SORT",
      credits: "+40",
      weight: "1.20 kg",
      date: "2026-03-24",
    },

    {
      id: "RCY-8804",
      passport: "GP-9762",
      garment: "Bamboo Sweatshirt",
      material: "Bamboo 80%, Cotton 20%",
      stage: "COMPLETED",
      credits: "+21",
      weight: "0.60 kg",
      date: "2026-03-15",
    },

    {
      id: "RCY-8805",
      passport: "GP-9801",
      garment: "Recycled Down Vest",
      material: "rPET, Down Feathers",
      stage: "HARDWARE STRIP",
      credits: "+27",
      weight: "0.70 kg",
      date: "2026-03-26",
    },
  ]);

  useEffect(() => {

    const closeMenu = (e: any) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu("");
      }

    };

    document.addEventListener(
      "mousedown",
      closeMenu
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        closeMenu
      );

    };

  }, []);

  const filteredItems = useMemo(() => {

    return items.filter((item) => {

      const value =
        search.toLowerCase();

      return (
        item.id.toLowerCase().includes(value) ||
        item.passport
          .toLowerCase()
          .includes(value) ||
        item.garment
          .toLowerCase()
          .includes(value) ||
        item.material
          .toLowerCase()
          .includes(value)
      );

    });

  }, [items, search]);

  return (
    <div className="space-y-5 pb-10">

      {/* TOP STATS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.1fr_0.55fr_0.55fr]
          gap-4
        "
      >

        {/* SCAN */}
        <button
          onClick={() =>
            setScannerOpen(true)
          }
          className="
            relative overflow-hidden

            h-[128px]

            rounded-[28px]

            bg-gradient-to-br
            from-[#166B2D]
            to-[#0C4B1B]

            px-6

            flex items-center justify-between

            shadow-[0_20px_40px_rgba(22,107,45,0.18)]

            transition-all
          "
        >

          {/* GLOW */}
          <div
            className="
              absolute
              -right-16
              -top-16
              w-[180px]
              h-[180px]
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div className="flex items-center gap-5 relative z-10">

            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-white/10
                border border-white/10
                flex items-center justify-center
              "
            >

              <QrCodeScannerRoundedIcon
                style={{
                  fontSize: 28,
                  color: "white",
                }}
              />

            </div>

            <div className="text-left">

              <h1
                className="
                  text-white
                  text-[24px]
                  font-black
                  leading-none
                "
              >
                SCAN FOR RECYCLING
              </h1>

              <p
                className="
                  mt-3
                  text-[10px]
                  tracking-[0.18em]
                  font-black
                  text-[#C7E6CF]
                "
              >
                AUTOMATED MATERIAL EXTRACTION
              </p>

            </div>

          </div>

          <div
            className="
              relative z-10

              h-[38px]

              px-4

              rounded-2xl

              bg-white/10

              border border-white/10

              text-white

              text-[10px]

              tracking-[0.14em]

              font-black

              flex items-center gap-2
            "
          >

            NODE STATUS READY

            <span
              className="
                w-2 h-2
                rounded-full
                bg-[#22C55E]
              "
            />

          </div>

        </button>

        {/* RECOVERY */}
        <StatCard
          icon={
            <RecyclingRoundedIcon
              style={{ fontSize: 24 }}
            />
          }
          title="MATERIAL RECOVERY"
          value="420 Tons"
          valueColor="#2563EB"
          iconBg="#EEF4FF"
          iconColor="#2563EB"
        />

        {/* CREDITS */}
        <StatCard
          icon={
            <BoltRoundedIcon
              style={{ fontSize: 24 }}
            />
          }
          title="ECO CREDITS EARNED"
          value="12,480"
          valueColor="#EA8A00"
          iconBg="#FFF5E8"
          iconColor="#EA8A00"
        />

      </div>

      {/* TABLE CARD */}
      <div
        className="
          bg-white
          border border-[#ECECEC]
          rounded-[28px]
          overflow-hidden
          shadow-[0_10px_40px_rgba(0,0,0,0.03)]
        "
      >

        {/* HEADER */}
        <div
          className="
            px-5 py-4
            border-b border-[#F3F4F6]

            flex items-start
            justify-between
            gap-4
          "
        >

          {/* LEFT */}
          <div>

            <h2
              className="
                text-[20px]
                font-black
                text-[#111827]
              "
            >
              Recycling Node Queue
            </h2>

            <p
              className="
                mt-1
                text-[12px]
                text-[#9CA3AF]
              "
            >
              Final lifecycle terminal for end-of-use products
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* REFRESH */}
            <button
              className="
                w-10 h-10 rounded-2xl
                border border-[#ECECEC]
                bg-white
                flex items-center justify-center
                hover:bg-[#FAFAFA]
                transition-all
              "
            >

              <RefreshRoundedIcon
                style={{
                  fontSize: 18,
                  color: "#9CA3AF",
                }}
              />

            </button>

            {/* SEARCH */}
            <div className="relative">

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
                placeholder="Search recycling queue..."
                className="
                  w-[220px]
                  h-[42px]

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

          </div>

        </div>

        {/* TABLE HEADER */}
        <div
          className="
            grid
            grid-cols-[1fr_1.3fr_1.4fr_1fr_0.9fr_0.8fr_0.8fr_0.6fr]

            px-5
            py-3

            border-b border-[#F5F5F5]

            text-[10px]

            tracking-[0.12em]

            text-[#A4AAB5]

            font-black
          "
        >

          <div>RCY ID</div>
          <div>PRODUCT REFERENCE</div>
          <div>PRIMARY MATERIAL</div>
          <div>RECOVERY STAGE</div>
          <div>ENTRY DATE</div>
          <div>WEIGHT</div>
          <div>CREDITS</div>
          <div className="text-center">
            REVIEW
          </div>

        </div>

        {/* ROWS */}
        <div>

          {filteredItems.map((item, index) => (

            <div
              key={index}
              className="
                grid
                grid-cols-[1fr_1.3fr_1.4fr_1fr_0.9fr_0.8fr_0.8fr_0.6fr]

                items-center

                px-5

                h-[78px]

                border-b border-[#F8F8F8]

                hover:bg-[#FAFAFA]

                transition-all
              "
            >

              {/* RCY ID */}
              <div>

                <p
                  className="
                    text-[13px]
                    font-black
                    text-[#111827]
                  "
                >
                  {item.id}
                </p>

              </div>

              {/* PRODUCT */}
              <div className="flex items-center gap-3">

                <div
                  className="
                    w-9 h-9 rounded-xl
                    bg-[#FFF1F1]
                    flex items-center justify-center
                  "
                >

                  <Inventory2OutlinedIcon
                    style={{
                      fontSize: 16,
                      color: "#FF6B6B",
                    }}
                  />

                </div>

                <div>

                  <p
                    className="
                      text-[13px]
                      font-black
                      text-[#111827]
                    "
                  >
                    {item.passport}
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-[#A0A6B2]
                      mt-1
                    "
                  >
                    {item.garment}
                  </p>

                </div>

              </div>

              {/* MATERIAL */}
              <div>

                <p
                  className="
                    text-[13px]
                    text-[#6B7280]
                  "
                >
                  {item.material}
                </p>

              </div>

              {/* STAGE */}
              <div>
                <StageChip
                  stage={item.stage}
                />
              </div>

              {/* DATE */}
              <div>

                <p
                  className="
                    text-[13px]
                    text-[#9CA3AF]
                    font-semibold
                  "
                >
                  {item.date}
                </p>

              </div>

              {/* WEIGHT */}
              <div>

                <p
                  className="
                    text-[13px]
                    font-black
                    text-[#111827]
                  "
                >
                  {item.weight}
                </p>

              </div>

              {/* CREDIT */}
              <div>

                <p
                  className="
                    text-[13px]
                    font-black
                    text-[#F97316]
                  "
                >
                  {item.credits}
                </p>

              </div>

              {/* ACTION */}
              <div className="flex items-center justify-center gap-3">

                <button
                  onClick={() =>
                    setSelectedItem(item)
                  }
                  className="
                    text-[#9CA3AF]
                    hover:text-[#166B2D]
                    transition-all
                  "
                >

                  <VisibilityOutlinedIcon
                    style={{ fontSize: 18 }}
                  />

                </button>

                <div className="relative">

                  <button
                    onClick={() =>
                      setShowMenu(
                        showMenu === item.id
                          ? ""
                          : item.id
                      )
                    }
                    className="
                      text-[#9CA3AF]
                      hover:text-[#111827]
                      transition-all
                    "
                  >

                    <MoreVertRoundedIcon
                      style={{ fontSize: 18 }}
                    />

                  </button>

                  {showMenu === item.id && (

                    <div
                      ref={menuRef}
                      className="
                        absolute
                        right-0
                        top-7

                        w-[220px]

                        bg-white

                        rounded-[22px]

                        border border-[#ECECEC]

                        shadow-[0_25px_80px_rgba(0,0,0,0.16)]

                        overflow-hidden

                        z-[9999]
                      "
                    >

                      <MenuBtn
                        icon={
                          <VisibilityOutlinedIcon />
                        }
                        label="View Breakdown"
                        onClick={() => {

                          setSelectedItem(item);
                          setShowMenu("");

                        }}
                      />

                      <MenuBtn
                        icon={
                          <AutorenewRoundedIcon />
                        }
                        label="Move To Recovery"
                        onClick={() => {

                          setItems((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? {
                                    ...row,
                                    stage:
                                      "FIBER RECOVERY",
                                  }
                                : row
                            )
                          );

                          setShowMenu("");

                        }}
                      />

                      <MenuBtn
                        icon={
                          <CheckCircleRoundedIcon />
                        }
                        label="Mark Completed"
                        onClick={() => {

                          setItems((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? {
                                    ...row,
                                    stage:
                                      "COMPLETED",
                                  }
                                : row
                            )
                          );

                          setShowMenu("");

                        }}
                      />

                      <MenuBtn
                        icon={
                          <DeleteSweepRoundedIcon />
                        }
                        label="Terminate Lifecycle"
                        onClick={() => {

                          setItems((prev) =>
                            prev.filter(
                              (row) =>
                                row.id !== item.id
                            )
                          );

                          setShowMenu("");

                        }}
                      />

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FOOTER */}
        <div
          className="
            h-[56px]

            px-5

            bg-[#FAFAFA]

            flex items-center justify-between
          "
        >

          <p
            className="
              text-[12px]
              text-[#A0A6B2]
            "
          >
            {filteredItems.length} items in queue
          </p>

          <button
            className="
              flex items-center gap-2

              text-[#166B2D]

              text-[11px]

              font-black

              tracking-[0.12em]
            "
          >

            <DownloadRoundedIcon
              style={{ fontSize: 16 }}
            />

            EXPORT

          </button>

        </div>

      </div>

      {/* MOBILE PREVIEW */}
      <div className="fixed bottom-5 right-5 z-40">

        <button
          className="
            h-[44px]

            px-5

            rounded-2xl

            bg-white

            border border-[#ECECEC]

            shadow-[0_10px_30px_rgba(0,0,0,0.08)]

            flex items-center gap-2

            text-[11px]

            font-black

            tracking-[0.12em]

            text-[#6B7280]
          "
        >

          <SmartphoneRoundedIcon
            style={{ fontSize: 16 }}
          />

          MOBILE PREVIEW

        </button>

      </div>

   {/* ========================================= */}
    {/* MATERIAL BREAKDOWN SIDE PANEL */}
    {/* ========================================= */}

    {selectedItem && (

    <>

        {/* DARK OVERLAY */}
        <div
        onClick={() =>
            setSelectedItem(null)
        }
        className="
            fixed inset-0
            bg-black/45
            backdrop-blur-[3px]
            z-[9998]
        "
        />

        {/* RIGHT PANEL */}
        <div
        className="
            fixed top-0 right-0

            w-full
            sm:w-[430px]

            h-screen

            bg-[#F8F9FB]

            border-l border-[#ECECEC]

            z-[9999]

            shadow-[-30px_0_80px_rgba(0,0,0,0.18)]

            overflow-y-auto
        "
        >

        {/* HEADER */}
        <div
            className="
            h-[72px]

            px-4

            border-b border-[#ECECEC]

            bg-white

            flex items-center justify-between
            "
        >

            <div className="flex items-center gap-3">

            <div
                className="
                w-10 h-10

                rounded-2xl

                bg-[#166B2D]

                text-white

                flex items-center justify-center
                "
            >

                <RecyclingRoundedIcon
                style={{ fontSize: 20 }}
                />

            </div>

            <div>

                <h2
                className="
                    text-[15px]

                    font-black

                    text-[#111827]
                "
                >
                Material Breakdown
                </h2>

                <p
                className="
                    text-[10px]

                    tracking-[0.14em]

                    font-black

                    text-[#16A34A]

                    uppercase
                "
                >
                {selectedItem.passport} · {selectedItem.garment}
                </p>

            </div>

            </div>

            <div className="flex items-center gap-3">

            <div
                className="
                h-7 px-3

                rounded-xl

                bg-[#EEF4FF]

                text-[#2563EB]

                text-[10px]

                font-black

                tracking-[0.10em]

                flex items-center
                "
            >
                DATA SYNCED
            </div>

            <button
                onClick={() =>
                setSelectedItem(null)
                }
                className="
                text-[#9CA3AF]

                hover:text-[#111827]

                transition-all
                "
            >

                <CloseRoundedIcon
                style={{ fontSize: 18 }}
                />

            </button>

            </div>

        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-4">

            {/* SHREDDING STRATEGY */}
            <div
            className="
                bg-white

                border border-[#ECECEC]

                rounded-[22px]

                p-4
            "
            >

            <div className="flex items-center gap-2">

                <AccessTimeRoundedIcon
                style={{
                    fontSize: 16,
                    color: "#9CA3AF",
                }}
                />

                <h3
                className="
                    text-[11px]

                    tracking-[0.14em]

                    font-black

                    text-[#A0A6B2]
                "
                >
                SHREDDING STRATEGY GUIDE
                </h3>

            </div>

            {/* ITEM */}
            <div className="mt-5">

                <div className="flex items-center justify-between">

                <div>

                    <p
                    className="
                        text-[13px]

                        font-black

                        text-[#111827]
                    "
                    >
                    Organic Cotton
                    </p>

                    <p
                    className="
                        text-[10px]

                        text-[#A0A6B2]

                        mt-1

                        tracking-[0.12em]

                        font-bold
                    "
                    >
                    NATURAL
                    </p>

                </div>

                <div
                    className="
                    flex items-center gap-3
                    "
                >

                    <span
                    className="
                        px-2 py-1

                        rounded-lg

                        bg-[#EAF7EE]

                        text-[#16A34A]

                        text-[9px]

                        font-black
                    "
                    >
                    Extractable
                    </span>

                    <span
                    className="
                        text-[12px]

                        font-black

                        text-[#16A34A]
                    "
                    >
                    78%
                    </span>

                </div>

                </div>

                <div
                className="
                    mt-3

                    h-2

                    rounded-full

                    bg-[#F1F1F1]

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
                    width: "78%",
                    }}
                />

                </div>

            </div>

            {/* ELASTANE */}
            <div className="mt-6">

                <div className="flex items-center justify-between">

                <div>

                    <p
                    className="
                        text-[13px]

                        font-black

                        text-[#111827]
                    "
                    >
                    Elastane
                    </p>

                    <p
                    className="
                        text-[10px]

                        text-[#A0A6B2]

                        mt-1

                        tracking-[0.12em]

                        font-bold
                    "
                    >
                    SYNTHETIC
                    </p>

                </div>

                <div
                    className="
                    flex items-center gap-3
                    "
                >

                    <span
                    className="
                        px-2 py-1

                        rounded-lg

                        bg-[#FFF1F1]

                        text-[#EF4444]

                        text-[9px]

                        font-black
                    "
                    >
                    Non-Extract
                    </span>

                    <span
                    className="
                        text-[12px]

                        font-black

                        text-[#2563EB]
                    "
                    >
                    14%
                    </span>

                </div>

                </div>

                <div
                className="
                    mt-3

                    h-2

                    rounded-full

                    bg-[#F1F1F1]

                    overflow-hidden
                "
                >

                <div
                    className="
                    h-full

                    rounded-full

                    bg-[#2563EB]
                    "
                    style={{
                    width: "14%",
                    }}
                />

                </div>

            </div>

            {/* HARDWARE */}
            <div className="mt-6">

                <div className="flex items-center justify-between">

                <div>

                    <p
                    className="
                        text-[13px]

                        font-black

                        text-[#111827]
                    "
                    >
                    Metal Hardware
                    </p>

                    <p
                    className="
                        text-[10px]

                        text-[#A0A6B2]

                        mt-1

                        tracking-[0.12em]

                        font-bold
                    "
                    >
                    METAL
                    </p>

                </div>

                <div
                    className="
                    flex items-center gap-3
                    "
                >

                    <span
                    className="
                        px-2 py-1

                        rounded-lg

                        bg-[#EAF7EE]

                        text-[#16A34A]

                        text-[9px]

                        font-black
                    "
                    >
                    Extractable
                    </span>

                    <span
                    className="
                        text-[12px]

                        font-black

                        text-[#EA580C]
                    "
                    >
                    8%
                    </span>

                </div>

                </div>

                <div
                className="
                    mt-3

                    h-2

                    rounded-full

                    bg-[#F1F1F1]

                    overflow-hidden
                "
                >

                <div
                    className="
                    h-full

                    rounded-full

                    bg-[#EA580C]
                    "
                    style={{
                    width: "8%",
                    }}
                />

                </div>

            </div>

            </div>

            {/* METRICS */}
            <div
            className="
                grid
                grid-cols-2
                gap-3
            "
            >

            <MetricCard
                iconBg="#EAF7EE"
                iconColor="#16A34A"
                title="CARBON SAVED"
                value="6.1 kg CO₂e"
                icon={<BoltRoundedIcon />}
            />

            <MetricCard
                iconBg="#EEF4FF"
                iconColor="#2563EB"
                title="WATER RECOVERED"
                value="18.0 L"
                icon={<RecyclingRoundedIcon />}
            />

            <MetricCard
                iconBg="#F5EFFF"
                iconColor="#9333EA"
                title="RECYCLABILITY"
                value="87%"
                icon={<ScienceRoundedIcon />}
            />

            <MetricCard
                iconBg="#FFF4E6"
                iconColor="#EA8A00"
                title="ENERGY RECOVERED"
                value="2.4 kWh"
                icon={<BoltRoundedIcon />}
            />

            </div>

            {/* CHECKLIST */}
            <div
            className="
                bg-white

                border border-[#ECECEC]

                rounded-[22px]

                p-4
            "
            >

            <div className="flex items-center gap-2">

                <BoltRoundedIcon
                style={{
                    fontSize: 16,
                    color: "#F59E0B",
                }}
                />

                <h3
                className="
                    text-[11px]

                    tracking-[0.14em]

                    font-black

                    text-[#A0A6B2]
                "
                >
                RECOVERY PROTOCOL CHECKLIST
                </h3>

            </div>

            <div className="mt-4 space-y-3">

                <ChecklistItem label="Metal Hardware Removed (Buttons, Zippers)" />
                <ChecklistItem label="Synthetic Lining Separated" />
                <ChecklistItem label="Chemical Trace Neutralization" />
                <ChecklistItem label="Fiber Shredding Sequence Initiated" />

            </div>

            <p
                className="
                mt-4

                text-[11px]

                text-[#A0A6B2]
                "
            >
                0 / 4 steps completed
            </p>

            </div>

            {/* UPLOAD */}
            <div
            className="
                bg-white

                border border-[#ECECEC]

                rounded-[22px]

                p-4
            "
            >

            <h3
                className="
                text-[11px]

                tracking-[0.14em]

                font-black

                text-[#A0A6B2]
                "
            >
                SHREDDING PROCESS PROOF
            </h3>

            <div
                className="
                mt-4

                h-[120px]

                rounded-[20px]

                border-2 border-dashed
                border-[#D7DCE2]

                bg-[#FAFAFA]

                flex flex-col
                items-center justify-center
                "
            >

                <UploadFileRoundedIcon
                style={{
                    fontSize: 28,
                    color: "#9CA3AF",
                }}
                />

                <p
                className="
                    mt-3

                    text-[13px]

                    font-black

                    text-[#374151]
                "
                >
                Upload Process Documentation
                </p>

                <p
                className="
                    mt-1

                    text-[11px]

                    text-[#9CA3AF]
                "
                >
                Video proof or sensor logs required for credit minting
                </p>

            </div>

            </div>

        </div>

        {/* FOOTER */}
        <div
            className="
            sticky bottom-0

            bg-white

            border-t border-[#ECECEC]

            px-4 py-3

            flex items-center gap-3
            "
        >

            <button
            onClick={() =>
                setSelectedItem(null)
            }
            className="
                flex-1

                h-[46px]

                rounded-2xl

                border border-[#ECECEC]

                bg-[#FAFAFA]

                text-[#6B7280]

                text-sm

                font-bold
            "
            >
            Cancel
            </button>

            <button
            className="
                flex-[2]

                h-[46px]

                rounded-2xl

                bg-[#166B2D]

                text-white

                text-[11px]

                font-black

                tracking-[0.14em]

                shadow-[0_10px_25px_rgba(22,107,45,0.20)]

                flex items-center justify-center gap-2
            "
            >

            <DeleteSweepRoundedIcon
                style={{ fontSize: 18 }}
            />

            TERMINATE & CLOSE LIFECYCLE

            </button>

        </div>

        </div>

    </>

    )}

      {/* QR MODAL */}
      <QRScannerModal
        open={scannerOpen}
        onClose={() =>
          setScannerOpen(false)
        }
        onScan={() => {

          setScannerOpen(false);

          setTimeout(() => {
            setShowCreateModal(true);
          }, 400);

        }}
      />

      {/* CREATE MODAL */}
      {showCreateModal && (

        <>
          <div
            onClick={() =>
              setShowCreateModal(false)
            }
            className="
              fixed inset-0
              bg-black/40
              backdrop-blur-[8px]
              z-[9998]
            "
          />

          <div
            className="
              fixed inset-0

              z-[9999]

              flex
              items-center
              justify-center

              p-5
            "
          >

            <div
              className="
                w-full
                max-w-[620px]

                rounded-[34px]

                bg-white

                border border-[#ECECEC]

                shadow-[0_40px_120px_rgba(0,0,0,0.28)]

                overflow-hidden
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

                <div className="flex gap-4">

                  <div
                    className="
                      w-12 h-12

                      rounded-2xl

                      bg-[#166B2D]

                      text-white

                      flex items-center justify-center
                    "
                  >

                    <ScienceRoundedIcon />

                  </div>

                  <div>

                    <h2
                      className="
                        text-[22px]
                        font-black
                        text-[#111827]
                      "
                    >
                      Create Recycling Record
                    </h2>

                    <p
                      className="
                        mt-1

                        text-[11px]

                        tracking-[0.12em]

                        font-black

                        text-[#16A34A]
                      "
                    >
                      BLOCKCHAIN MATERIAL RECOVERY
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="
                    w-10 h-10

                    rounded-xl

                    hover:bg-[#F5F5F5]

                    flex items-center justify-center
                  "
                >

                  <CloseRoundedIcon />

                </button>

              </div>

              {/* BODY */}
              <div className="p-6">

                <div
                  className="
                    h-[200px]

                    rounded-[28px]

                    border-2 border-dashed
                    border-[#D7DCE2]

                    bg-[#FAFAFA]

                    flex flex-col
                    items-center justify-center
                  "
                >

                  <ScienceRoundedIcon
                    style={{
                      fontSize: 42,
                      color: "#9CA3AF",
                    }}
                  />

                  <p
                    className="
                      mt-5

                      text-sm
                      font-black
                      text-[#374151]
                    "
                  >
                    Recycling Workflow Initialized
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-[#9CA3AF]
                    "
                  >
                    Material extraction process ready
                  </p>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

/* ======================================================= */

function StatCard({
  icon,
  title,
  value,
  valueColor,
  iconBg,
  iconColor,
}: any) {

  return (
    <div
      className="
        h-[128px]

        rounded-[28px]

        bg-white

        border border-[#ECECEC]

        px-6

        flex flex-col
        items-center
        justify-center

        shadow-[0_10px_35px_rgba(0,0,0,0.03)]
      "
    >

      <div
        className="
          w-10 h-10

          rounded-2xl

          flex items-center justify-center
        "
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <p
        className="
          mt-4

          text-[10px]

          tracking-[0.16em]

          font-black

          text-[#A0A6B2]
        "
      >
        {title}
      </p>

      <h1
        className="
          mt-2

          text-[22px]

          font-black

          leading-none
        "
        style={{
          color: valueColor,
        }}
      >
        {value}
      </h1>

    </div>
  );
}

/* ======================================================= */

function StageChip({ stage }: any) {

  const styles: any = {

    COMPLETED: {
      bg: "#EAF7EE",
      color: "#16A34A",
    },

    SORTING: {
      bg: "#F5E8FF",
      color: "#9333EA",
    },

    "FIBER RECOVERY": {
      bg: "#EEF4FF",
      color: "#2563EB",
    },

    "CHEMICAL SORT": {
      bg: "#FFF4E6",
      color: "#EA8A00",
    },

    "HARDWARE STRIP": {
      bg: "#FFF1EC",
      color: "#F97316",
    },

  };

  return (
    <div
      className="
        inline-flex items-center

        h-7

        px-3

        rounded-xl

        text-[10px]

        font-black

        tracking-[0.10em]
      "
      style={{
        background:
          styles[stage]?.bg,

        color:
          styles[stage]?.color,
      }}
    >
      {stage}
    </div>
  );
}

/* ======================================================= */

function MenuBtn({
  icon,
  label,
  onClick,
}: any) {

  return (
    <button
      onClick={onClick}
      className="
        w-full

        min-h-[54px]

        px-5

        flex items-center
        gap-3

        hover:bg-[#F8F8F8]

        text-sm
        font-semibold

        text-[#4B5563]

        transition-all
      "
    >

      <span className="text-[#6B7280]">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
}

/* ======================================================= */

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
        "
      >
        {value}
      </p>

    </div>
  );
}

/* ========================================= */
/* ADD THESE COMPONENTS BELOW */
/* ========================================= */

function MetricCard({
  icon,
  title,
  value,
  iconBg,
  iconColor,
}: any) {

  return (
    <div
      className="
        bg-white

        border border-[#ECECEC]

        rounded-[20px]

        p-4

        flex flex-col
        items-center
        justify-center

        text-center
      "
    >

      <div
        className="
          w-9 h-9

          rounded-xl

          flex items-center justify-center
        "
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <p
        className="
          mt-4

          text-[10px]

          tracking-[0.14em]

          font-black

          text-[#A0A6B2]
        "
      >
        {title}
      </p>

      <h2
        className="
          mt-2

          text-[18px]

          font-black

          text-[#111827]
        "
      >
        {value}
      </h2>

    </div>
  );
}

function ChecklistItem({
  label,
}: any) {

  return (
    <div
      className="
        min-h-[52px]

        rounded-2xl

        bg-[#FAFAFA]

        border border-[#F1F1F1]

        px-4

        flex items-center gap-3
      "
    >

      <div
        className="
          w-5 h-5

          rounded-md

          border border-[#D7DCE2]

          bg-white
        "
      />

      <p
        className="
          text-[12px]

          font-semibold

          text-[#4B5563]
        "
      >
        {label}
      </p>

    </div>
  );
}
