import { useEffect, useMemo, useRef, useState } from "react";
import QRScannerModal from "../../../components/qr/QRScannerModal";
import { apiFetch } from "../../../lib/api";

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
  const [selectedBreakdown, setSelectedBreakdown] = useState<any>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    passport: "",
    garment: "",
    material: "",
    weight: "0.60 kg",
    stage: "SORTING",
  });
  const [creating, setCreating] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [passportDetails, setPassportDetails] = useState<any>(null);
  const [stats, setStats] = useState({
    materialRecovery: "0 Items",
    credits: 0,
  });
  const [apiError, setApiError] = useState("");

  const menuRef = useRef<any>(null);

  const [items, setItems] = useState<any[]>([]);

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

  const selectedMaterialRows = useMemo(() => {
    const source = selectedBreakdown?.materials?.length
      ? selectedBreakdown.materials
      : String(selectedItem?.material || "")
          .split(/,|\//)
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name, index, list) => ({
            name,
            type: /poly|pet|elastane|synthetic/i.test(name)
              ? "SYNTHETIC"
              : /metal|zip|button|hardware/i.test(name)
                ? "METAL"
                : "NATURAL",
            value: list.length === 1 ? 100 : index === 0 ? 70 : 30,
            barColor: index === 0 ? "#166B2D" : index === 1 ? "#2563EB" : "#EA580C",
            badge: /elastane|chemical|dye/i.test(name) ? "Non-Extract" : "Extractable",
            badgeBg: /elastane|chemical|dye/i.test(name) ? "#FFF1F1" : "#EAF7EE",
            badgeColor: /elastane|chemical|dye/i.test(name) ? "#EF4444" : "#16A34A",
          }));

    return source.map((material: any, index: number) => ({
      name: material.name || material,
      type: material.type || "MATERIAL",
      value: Number.parseFloat(String(material.value || 0)) || (index === 0 ? 70 : 30),
      barColor: material.barColor || material.color || (index === 0 ? "#166B2D" : "#2563EB"),
      badge: material.badge || "Extractable",
      badgeBg: material.badgeBg || "#EAF7EE",
      badgeColor: material.badgeColor || "#16A34A",
    }));
  }, [selectedBreakdown, selectedItem]);

  const selectedMetrics = selectedBreakdown?.metrics || {
    carbon: "N/A",
    water: "N/A",
    recyclability: selectedItem?.stage === "COMPLETED" ? "91%" : "87%",
    energy: "N/A",
  };

  const normalizePassportInput = (value?: string) => {
    const rawValue = String(value || "").trim();
    if (!rawValue) return "";

    try {
      const url = new URL(rawValue);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || rawValue;
    } catch {
      return rawValue;
    }
  };

  const applyPassportDetails = (passport: any, scannedValue?: string) => {
    const material = Array.isArray(passport.materials)
      ? passport.materials.map((item: any) => item.name || item).join(", ")
      : passport.material || passport.materials?.[0]?.name || "";

    setPassportDetails(passport);
    setCreateForm((prev) => ({
      ...prev,
      passport: passport.id || normalizePassportInput(scannedValue) || prev.passport,
      garment: passport.garment || prev.garment,
      material: material || prev.material,
      weight: passport.weight || prev.weight || "0.60 kg",
    }));
  };

  const lookupPassport = async (value?: string) => {
    const passport = normalizePassportInput(value || createForm.passport);
    if (!passport) return null;

    setLookupLoading(true);
    setLookupError("");

    try {
      const data = await apiFetch<any>(`/recycler/passport/${encodeURIComponent(passport)}`);
      applyPassportDetails(data, passport);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Digital passport not found";
      setPassportDetails(null);
      setLookupError(message);
      return null;
    } finally {
      setLookupLoading(false);
    }
  };

  const loadProcessing = () => {
    apiFetch<any>("/recycler/processing")
      .then((data) => {
        setApiError("");
        setItems(data.items || []);
        setStats({
          materialRecovery: data.stats?.materialRecovery || "0 Items",
          credits: data.stats?.credits || 0,
        });
      })
      .catch((error) => {
        console.error("Failed to load recycling queue", error);
        setApiError(error instanceof Error ? error.message : "Failed to load recycling queue");
      });
  };

  useEffect(() => {
    loadProcessing();
  }, []);

  useEffect(() => {
    if (!selectedItem?.passport) {
      setSelectedBreakdown(null);
      return;
    }

    let active = true;

    const loadBreakdown = async () => {
      setBreakdownLoading(true);
      try {
        const data = await apiFetch<any>(
          `/recycler/passport/${encodeURIComponent(selectedItem.passport)}`
        );
        if (active) setSelectedBreakdown(data);
      } catch (error) {
        if (active) setSelectedBreakdown(null);
      } finally {
        if (active) setBreakdownLoading(false);
      }
    };

    loadBreakdown();

    return () => {
      active = false;
    };
  }, [selectedItem?.passport]);

  useEffect(() => {
    if (!showCreateModal) return;

    const passport = normalizePassportInput(createForm.passport);
    if (!passport || passport === passportDetails?.id) return;

    const timer = setTimeout(() => {
      lookupPassport(passport);
    }, 600);

    return () => clearTimeout(timer);
  }, [createForm.passport, showCreateModal]);

  const updateProcess = async (itemId: string, stage: string) => {
    try {
      const endpoint =
        stage === "CLOSED"
          ? `/recycler/processing/${itemId}/close`
          : `/recycler/processing/${itemId}`;
      const data = await apiFetch<any>(endpoint, {
        method: stage === "CLOSED" ? "POST" : "PATCH",
        body: JSON.stringify({ stage }),
      });

      if (stage === "CLOSED") {
        setItems((prev) => prev.filter((row) => row.id !== itemId));
        setSelectedItem(null);
      } else {
        setItems((prev) =>
          prev.map((row) => (row.id === itemId ? data.item : row))
        );
      }

      setShowMenu("");
      loadProcessing();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to update recycling process");
    }
  };

  const createProcess = async () => {
    if (!createForm.passport.trim()) {
      setLookupError("Enter a passport ID before creating the recycling record");
      return;
    }

    try {
      setCreating(true);
      const data = await apiFetch<any>("/recycler/processing", {
        method: "POST",
        body: JSON.stringify(createForm),
      });
      setItems((prev) =>
        prev.some((item) => item.id === data.item.id)
          ? prev.map((item) => (item.id === data.item.id ? data.item : item))
          : [data.item, ...prev]
      );
      setShowCreateModal(false);
      setPassportDetails(null);
      setLookupError("");
      setApiError(data.existing ? data.message : "");
      setCreateForm({
        passport: "",
        garment: "",
        material: "",
        weight: "0.60 kg",
        stage: "SORTING",
      });
      loadProcessing();
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : "Failed to create recycling process");
    } finally {
      setCreating(false);
    }
  };

  const exportQueue = () => {
    downloadJson("recycling-queue.json", {
      exportedAt: new Date().toISOString(),
      stats,
      items: filteredItems,
    });
  };

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
      {apiError && (
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-bold text-[#B91C1C]">
          {apiError}
        </div>
      )}

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
          value={stats.materialRecovery}
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
          value={String(stats.credits)}
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
          overflow-visible
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
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

            {/* REFRESH */}
            <button
              onClick={loadProcessing}
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
            <div className="relative w-full sm:w-auto">

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
                  w-full
                  sm:w-[220px]
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
            hidden
            lg:grid
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
                          updateProcess(item.id, "FIBER RECOVERY");

                        }}
                      />

                      <MenuBtn
                        icon={
                          <CheckCircleRoundedIcon />
                        }
                        label="Mark Completed"
                        onClick={() => {
                          updateProcess(item.id, "COMPLETED");

                        }}
                      />

                      <MenuBtn
                        icon={
                          <DeleteSweepRoundedIcon />
                        }
                        label="Terminate Lifecycle"
                        onClick={() => {
                          updateProcess(item.id, "CLOSED");

                        }}
                      />

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

        <div className="divide-y divide-[#F3F4F6] lg:hidden">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-black text-[#111827]">
                    {item.id}
                  </p>
                  <p className="mt-2 break-words text-[15px] font-black text-[#111827]">
                    {item.passport}
                  </p>
                  <p className="mt-1 break-words text-[12px] text-[#9CA3AF]">
                    {item.garment}
                  </p>
                </div>

                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowMenu(showMenu === item.id ? "" : item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECECEC] text-[#6B7280]"
                  >
                    <MoreVertRoundedIcon style={{ fontSize: 18 }} />
                  </button>

                  {showMenu === item.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-10 z-[9999] w-[220px] overflow-hidden rounded-[22px] border border-[#ECECEC] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.16)]"
                    >
                      <MenuBtn
                        icon={<VisibilityOutlinedIcon />}
                        label="View Breakdown"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowMenu("");
                        }}
                      />
                      <MenuBtn
                        icon={<AutorenewRoundedIcon />}
                        label="Move To Recovery"
                        onClick={() => updateProcess(item.id, "FIBER RECOVERY")}
                      />
                      <MenuBtn
                        icon={<CheckCircleRoundedIcon />}
                        label="Mark Completed"
                        onClick={() => updateProcess(item.id, "COMPLETED")}
                      />
                      <MenuBtn
                        icon={<DeleteSweepRoundedIcon />}
                        label="Terminate Lifecycle"
                        onClick={() => updateProcess(item.id, "CLOSED")}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MobileMeta label="Material" value={item.material} />
                <MobileMeta label="Entry Date" value={item.date} />
                <MobileMeta label="Weight" value={item.weight} />
                <MobileMeta label="Credits" value={item.credits} accent />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <StageChip stage={item.stage} />
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 text-[11px] font-black text-[#166B2D]"
                >
                  <VisibilityOutlinedIcon style={{ fontSize: 16 }} />
                  REVIEW
                </button>
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
            onClick={exportQueue}
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

            {breakdownLoading && (
              <p className="mt-5 text-[12px] font-black tracking-[0.12em] text-[#9CA3AF]">
                LOADING MATERIAL DATA...
              </p>
            )}

            {!breakdownLoading && selectedMaterialRows.length === 0 && (
              <p className="mt-5 text-sm font-semibold text-[#9CA3AF]">
                No material breakdown found for this passport.
              </p>
            )}

            {!breakdownLoading &&
              selectedMaterialRows.map((material: any) => (
                <MaterialRow key={`${material.name}-${material.value}`} material={material} />
              ))}

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
                value={selectedMetrics.carbon || "N/A"}
                icon={<BoltRoundedIcon />}
            />

            <MetricCard
                iconBg="#EEF4FF"
                iconColor="#2563EB"
                title="WATER RECOVERED"
                value={selectedMetrics.water || "N/A"}
                icon={<RecyclingRoundedIcon />}
            />

            <MetricCard
                iconBg="#F5EFFF"
                iconColor="#9333EA"
                title="RECYCLABILITY"
                value={selectedMetrics.recyclability || "N/A"}
                icon={<ScienceRoundedIcon />}
            />

            <MetricCard
                iconBg="#FFF4E6"
                iconColor="#EA8A00"
                title="ENERGY RECOVERED"
                value={selectedMetrics.energy || "N/A"}
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

            <button
                type="button"
                onClick={() =>
                  downloadJson(`recycling-breakdown-${selectedItem.passport}.json`, {
                    process: selectedItem,
                    passport: selectedBreakdown,
                    materials: selectedMaterialRows,
                    metrics: selectedMetrics,
                  })
                }
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
                Download Process Documentation
                </p>

                <p
                className="
                    mt-1

                    text-[11px]

                    text-[#9CA3AF]
                "
                >
                Exports selected process, material, and passport evidence
                </p>

            </button>

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
            onClick={() =>
                selectedItem && updateProcess(selectedItem.id, "CLOSED")
            }
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
        onScan={async (value) => {
          const passport = normalizePassportInput(value);

          setScannerOpen(false);
          setCreateForm((prev) => ({
            ...prev,
            passport,
          }));

          setTimeout(async () => {
            setShowCreateModal(true);
            if (passport) await lookupPassport(passport);
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
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  <CreateField
                    label="Passport ID"
                    value={createForm.passport}
                    onChange={(value: string) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        passport: normalizePassportInput(value),
                      }))
                    }
                    onBlur={() => lookupPassport()}
                    placeholder="Passport ID or SKU"
                  />
                  <CreateField
                    label="Weight"
                    value={createForm.weight}
                    onChange={(value: string) =>
                      setCreateForm((prev) => ({ ...prev, weight: value }))
                    }
                    placeholder="0.60 kg"
                  />
                  <CreateField
                    label="Garment"
                    value={createForm.garment}
                    onChange={(value: string) =>
                      setCreateForm((prev) => ({ ...prev, garment: value }))
                    }
                    placeholder="Optional override"
                  />
                  <CreateField
                    label="Material"
                    value={createForm.material}
                    onChange={(value: string) =>
                      setCreateForm((prev) => ({ ...prev, material: value }))
                    }
                    placeholder="Optional override"
                  />

                  <label className="md:col-span-2">
                    <span className="text-[10px] font-black tracking-[0.12em] text-[#6B7280]">
                      INITIAL STAGE
                    </span>
                    <select
                      value={createForm.stage}
                      onChange={(event) =>
                        setCreateForm((prev) => ({ ...prev, stage: event.target.value }))
                      }
                      className="mt-2 h-[46px] w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 text-sm font-bold outline-none focus:border-[#166B2D]"
                    >
                      <option value="SORTING">SORTING</option>
                      <option value="FIBER RECOVERY">FIBER RECOVERY</option>
                      <option value="CHEMICAL SORT">CHEMICAL SORT</option>
                      <option value="HARDWARE STRIP">HARDWARE STRIP</option>
                    </select>
                  </label>

                </div>

                {(lookupLoading || lookupError || passportDetails) && (
                  <div
                    className={`
                      mt-4 rounded-2xl border px-4 py-3 text-sm
                      ${
                        lookupError
                          ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                          : "border-[#DCEFD9] bg-[#F7FCF8] text-[#166B2D]"
                      }
                    `}
                  >
                    {lookupLoading && (
                      <p className="font-black tracking-[0.08em]">
                        LOADING PASSPORT DETAILS...
                      </p>
                    )}

                    {!lookupLoading && lookupError && (
                      <p className="font-bold">{lookupError}</p>
                    )}

                    {!lookupLoading && passportDetails && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <div>
                          <p className="text-[10px] font-black tracking-[0.12em] text-[#6B7280]">
                            PASSPORT
                          </p>
                          <p className="mt-1 font-black text-[#111827]">
                            {passportDetails.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-[0.12em] text-[#6B7280]">
                            GARMENT
                          </p>
                          <p className="mt-1 font-black text-[#111827]">
                            {passportDetails.garment}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-[0.12em] text-[#6B7280]">
                            RECYCLABILITY
                          </p>
                          <p className="mt-1 font-black text-[#111827]">
                            {passportDetails.metrics?.recyclability || "Pending"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={createProcess}
                  disabled={creating}
                  className="mt-5 h-[50px] w-full rounded-2xl bg-[#166B2D] text-sm font-black tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(22,107,45,0.18)] disabled:opacity-60"
                >
                  {creating ? "CREATING..." : "CREATE RECYCLING RECORD"}
                </button>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

/* ======================================================= */

function MaterialRow({ material }: any) {
  const percent = `${Math.min(100, Math.max(0, Number(material.value) || 0))}%`;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="hidden lg:block">
          <p className="text-[13px] font-black text-[#111827]">
            {material.name}
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-[#A0A6B2]">
            {material.type}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="rounded-lg px-2 py-1 text-[9px] font-black"
            style={{
              background: material.badgeBg,
              color: material.badgeColor,
            }}
          >
            {material.badge}
          </span>

          <span
            className="text-[12px] font-black"
            style={{
              color: material.barColor,
            }}
          >
            {percent}
          </span>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1F1F1]">
        <div
          className="h-full rounded-full"
          style={{
            width: percent,
            background: material.barColor,
          }}
        />
      </div>
    </div>
  );
}

/* ======================================================= */

function MobileMeta({ label, value, accent }: any) {
  return (
    <div className="rounded-2xl border border-[#F1F1F1] bg-[#FAFAFA] px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#A0A6B2]">
        {label}
      </p>
      <p
        className={`mt-1 break-words text-[12px] font-black ${
          accent ? "text-[#F97316]" : "text-[#111827]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ======================================================= */

function CreateField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
}) {
  return (
    <label>
      <span className="text-[10px] font-black tracking-[0.12em] text-[#6B7280]">
        {label.toUpperCase()}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="mt-2 h-[46px] w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 text-sm font-bold outline-none focus:border-[#166B2D]"
      />
    </label>
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
