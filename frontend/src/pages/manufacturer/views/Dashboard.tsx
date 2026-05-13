import { useCallback, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import ModalPortal from "../../../components/modals/ModalPortal";
import { apiFetch } from "../../../lib/api";

/* ICONS */
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type ToastType = "success" | "error";

function assetUrl(value?: string) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/.test(value)) return value;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "") || window.location.origin;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

function passportIdFor(garment: any) {
  if (!garment) return "";
  return garment.sku || garment.batchNumber || `GP-${String(garment._id || "").slice(-6).toUpperCase()}`;
}

function buildLifecycleSteps(garment: any) {
  const status = garment?.status || "draft";
  const shipped = ["shipment", "shipped", "in_transit", "delivered", "approved"].includes(status);
  const approved = status === "approved";
  const underAudit = status === "pending";

  return [
    { label: "DRAFT", status: garment ? "done" : "current" },
    { label: "SHIPPED", status: shipped || approved ? "done" : status === "draft" ? "upcoming" : "current" },
    { label: "UNDER AUDIT", status: approved ? "done" : underAudit ? "current" : shipped ? "current" : "upcoming" },
    { label: "GOV REVIEW", status: approved ? "done" : "upcoming" },
    { label: "APPROVED", status: approved ? "done" : "upcoming" },
    { label: "ACTIVE", status: approved ? "current" : "upcoming" },
  ];
}

function certificateForGarment(certificates: any[], garment: any) {
  return certificates.find((item) => {
    const garmentId = String(item.garmentId?._id || item.garmentId || "");
    return (
      garmentId === String(garment?._id || "") ||
      String(item.garmentName || "").toLowerCase() ===
        String(garment?.productName || "").toLowerCase()
    );
  });
}



function Dashboard() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<ToastType>("success");
  const [show, setShow] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [garments, setGarments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  const [stats, setStats] = useState({

  totalGarments: 0,
  totalShipments: 0,
  totalCertificates: 0,
  totalTransactions: 0,

  approvedGarments: 0,
  pendingGarments: 0,
  shipmentGarments: 0,
  draftGarments: 0,

});

  const fetchGarments = useCallback(async () => {
    try {
      const data = await apiFetch<any[]>("/garments");
      setGarments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GARMENTS ERROR:", err);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const [garmentData, shipmentData, certificateData] = await Promise.all([
        apiFetch<any[]>("/garments"),
        apiFetch<any[]>("/shipments"),
        apiFetch<any[]>("/certificates").catch(() => []),
      ]);

      const garmentsList = Array.isArray(garmentData) ? garmentData : [];
      const shipmentsList = Array.isArray(shipmentData) ? shipmentData : [];
      const certificatesList = Array.isArray(certificateData) ? certificateData : [];

      setStats({
        totalGarments: garmentsList.length,
        totalShipments: shipmentsList.length,
        totalCertificates: certificatesList.length,
        totalTransactions: 0,
        approvedGarments: garmentsList.filter((g) => g.status === "approved").length,
        pendingGarments: garmentsList.filter((g) => g.status === "pending").length,
        shipmentGarments: garmentsList.filter((g) =>
          ["shipment", "shipped", "in_transit"].includes(g.status)
        ).length,
        draftGarments: garmentsList.filter((g) => !g.status || g.status === "draft").length,
      });
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    try {
      const data = await apiFetch<any[]>("/certificates");
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CERTIFICATES ERROR:", err);
      setCertificates([]);
    }
  }, []);

  /* ================= TOAST ================= */
  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setMessage(msg);
      setShow(true);

      localStorage.removeItem("loginSuccess");

      setTimeout(() => setShow(false), 2500);
      setTimeout(() => setMessage(""), 3000);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchGarments();
    fetchCertificates();
  }, [fetchDashboardStats, fetchGarments, fetchCertificates]);

  useEffect(() => {
    if (!selectedProduct && garments.length > 0) {
      setSelectedProduct(garments[0]);
    }
  }, [garments, selectedProduct]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, []);

  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCreateModal]);

  const showToast = (msg: string, type: ToastType = "success") => {
    setMessage(msg);
    setMessageType(type);
    setShow(true);
    setTimeout(() => setShow(false), 2500);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      {/* TOAST */}
      {message && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{
            background:
              messageType === "success"
                ? "rgba(220, 252, 231, 0.9)"
                : "rgba(254, 226, 226, 0.95)",
            border:
              messageType === "success"
                ? "1px solid #BBF7D0"
                : "1px solid #FCA5A5",
            color: messageType === "success" ? "#166534" : "#991B1B",
          }}
        >
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircleRoundedIcon style={{ fontSize: 16 }} />
            ) : (
              <CancelOutlinedIcon style={{ fontSize: 16 }} />
            )}
          </div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <div className="space-y-6">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard
                icon="clock"
                value={stats.pendingGarments}
                label="PENDING"
              />

              <StatCard
                icon="truck"
                value={stats.totalShipments}
                label="SHIPMENTS"
              />

              <StatCard
                icon="audit"
                value={stats.totalCertificates}
                label="CERTIFICATES"
              />

              <StatCard
                icon="success"
                value={stats.approvedGarments}
                label="APPROVED"
              />

              <StatCard
                icon="reject"
                value={stats.draftGarments}
                label="DRAFT"
              />
          </div>

          {/* ================= LIFECYCLE ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Active Lifecycle Flow
                </p>
                <p className="text-xs text-gray-400">
                  Global supply chain traceability progress
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-green-50 border text-green-700 text-xs font-semibold">
                IMMUTABLE RECORD
              </div>
            </div>

            <div className="relative flex justify-between items-center px-2">
              <div className="absolute top-4 left-2 right-2 h-[2px] bg-gray-200" />

              {buildLifecycleSteps(selectedProduct).map((step, i) => {
                const isDone = step.status === "done";
                const isCurrent = step.status === "current";

                return (
                  <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
                      ${isDone ? "bg-green-600 text-white shadow" : ""}
                      ${isCurrent ? "bg-white border-2 border-gray-200 text-gray-700 shadow-sm" : ""}
                      ${step.status === "upcoming" ? "bg-gray-100 text-gray-400" : ""}`}
                    >
                      {isDone ? <CheckCircleIcon style={{ fontSize: 18 }} /> : i + 1}
                    </div>

                    <p className={`text-[10px] font-semibold ${
                      isDone || isCurrent ? "text-gray-700" : "text-gray-400"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                {selectedProduct?.imageUrl ? (
                  <img
                    src={assetUrl(selectedProduct.imageUrl)}
                    alt={selectedProduct.productName}
                    className="w-11 h-11 rounded-xl object-cover border border-white shadow-sm"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-white text-gray-400 border flex items-center justify-center">
                    <Inventory2OutlinedIcon style={{ fontSize: 18 }} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {selectedProduct?.productName || "Select a product record"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedProduct ? `Passport ${passportIdFor(selectedProduct)}` : "Click any product row to update this lifecycle view"}
                  </p>
                </div>
              </div>

              {selectedProduct && (
                <button
                  onClick={() => {
                    setSelectedQR({
                      id: passportIdFor(selectedProduct),
                      rawId: selectedProduct._id,
                      name: selectedProduct.productName,
                    });
                    setShowQRModal(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-2 hover:bg-green-100 transition"
                >
                  <QrCode2OutlinedIcon style={{ fontSize: 16 }} />
                  QR
                </button>
              )}
            </div>
          </div>

          {/* ================= PRODUCT REGISTER ================= */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">

              <div>
                <p className="text-sm font-semibold">Product Register</p>
                <p className="text-xs text-gray-400">
                  Batch records and traceability status
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="relative">
                  <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search ID..."
                    className="h-9 w-[180px] pl-9 pr-3 text-sm border rounded-xl bg-gray-50 outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-green-800 transition"
                >
                  + Create Garment
                </button>

              </div>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
              <thead className="text-gray-400 text-[11px] uppercase">
                <tr className="border-b">
                  <th className="py-3 text-left">Garment ID</th>
                  <th className="text-left">Product Name</th>
                  <th className="text-left">Material</th>
                  <th className="text-left">LCA Data</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {garments.map((g) => {
                  return (
                    <ProductRow
                      key={g._id}
                      id={`GP-${g._id.slice(-6).toUpperCase()}`}
                      rawId={g._id}
                      name={g.productName}
                      material={g.materials?.join(", ") || g.material}
                      co2={g.carbon ? `${g.carbon}kg` : "N/A"}
                      water={g.water ? `${g.water}L` : "N/A"}
                      status={g.status}
                      imageUrl={g.imageUrl}
                      active={selectedProduct?._id === g._id}
                      onSelect={() => setSelectedProduct(g)}
                      onQRClick={(data:any) => {
                        setSelectedQR(data);
                        setShowQRModal(true);
                      }}
                      onMenuClick={(pos:any, data:any) => {
                        setMenuPosition(pos);
                        const certificate = certificateForGarment(certificates, g);
                        setSelectedRow({ ...data, certificate });
                        setMenuOpen(true);
                      }}
                    />
                  );
                })}
              </tbody>
            </table>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <span>SHOWING {garments.length} RECORDS</span>

              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-md border">‹</button>
                <button className="w-7 h-7 bg-gray-100 rounded-md font-semibold">1</button>
                <button className="w-7 h-7">2</button>
                <button className="w-7 h-7 rounded-md border">›</button>
              </div>
            </div>
          </div>

      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreateGarmentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            fetchDashboardStats();
            fetchGarments();
            fetchCertificates();
          }}
          onNotify={showToast}
        />
      )}

      {showQRModal && (
        <QRModal 
          data={selectedQR}
          onClose={() => setShowQRModal(false)} 
          onNotify={showToast}
        />
      )}

      {menuOpen && (
        <ActionMenu
          position={menuPosition}
          data={selectedRow}
          onClose={() => setMenuOpen(false)}
          onView={() => {
            window.open(`/consumer/passport/${selectedRow?.id}`, "_blank", "noopener,noreferrer");
            setMenuOpen(false);
          }}
          onGenerateQR={() => {
            setSelectedQR(selectedRow);
            setShowQRModal(true);
            setMenuOpen(false);
          }}
          onNotify={showToast}
        />
      )}

    </>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, value, label }: any) {
  const config: any = {
    clock: { icon: <AccessTimeOutlinedIcon />, bg: "bg-gray-100 text-gray-500" },
    truck: { icon: <LocalShippingOutlinedIcon />, bg: "bg-blue-100 text-blue-600" },
    audit: { icon: <SearchOutlinedIcon />, bg: "bg-orange-100 text-orange-600" },
    success: { icon: <CheckCircleOutlineOutlinedIcon />, bg: "bg-green-100 text-green-600" },
    reject: { icon: <CancelOutlinedIcon />, bg: "bg-red-100 text-red-500" },
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config[icon].bg}`}>
        {config[icon].icon}
      </div>

      <h2 className="text-2xl font-bold mt-3">{value}</h2>
      <p className="text-[12px] text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function ProductRow({ id, rawId, name, material, co2, water, status, imageUrl, active, onSelect, onQRClick, onMenuClick }: any): any {
  const normalizedStatus = status || "draft";
  const statusStyle: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-600",
    shipment: "bg-blue-100 text-blue-600",
    shipped: "bg-blue-100 text-blue-600",
    in_transit: "bg-blue-100 text-blue-600",
    draft: "bg-gray-100 text-gray-500",
  };

  const statusLabel: any = {
    approved: "APPROVED",
    pending: "PENDING AUDIT",
    shipment: "IN SHIPMENT",
    shipped: "IN SHIPMENT",
    in_transit: "IN SHIPMENT",
    draft: "DRAFT",
  };

  return (
    <tr
      onClick={onSelect}
      className={`border-b hover:bg-gray-50 transition cursor-pointer ${
        active ? "bg-green-50/60" : ""
      }`}
    >

      <td className="py-4 flex items-center gap-3">
        {imageUrl ? (
          <img
            src={assetUrl(imageUrl)}
            alt={name}
            className="w-8 h-8 rounded-lg object-cover border border-gray-100"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Inventory2OutlinedIcon style={{ fontSize: 16 }} />
          </div>
        )}
        {id}
      </td>

      <td className="font-medium">{name}</td>
      <td className="text-gray-500">
        {material || "N/A"}
      </td>

      <td className="flex gap-4">
        <span className="flex items-center gap-1 text-green-600">
          <LocalFloristOutlinedIcon style={{ fontSize: 14 }} />
          {co2}
        </span>
        <span className="flex items-center gap-1 text-blue-600">
          <WaterDropOutlinedIcon style={{ fontSize: 14 }} />
          {water}
        </span>
      </td>

      <td>
        <span className={`px-3 py-1 rounded-full text-xs ${statusStyle[normalizedStatus] || statusStyle.draft}`}>
          {statusLabel[normalizedStatus] || normalizedStatus.toUpperCase()}
        </span>
      </td>

      <td className="flex justify-end gap-3">
        <QrCode2OutlinedIcon 
          className="text-gray-400 cursor-pointer hover:text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            onQRClick({ id, rawId, name });
          }}
        />
        <MoreVertOutlinedIcon 
          className="text-gray-400 cursor-pointer hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();

          const menuWidth = 280;
          const spaceRight = window.innerWidth - rect.right;

          let x;

          // If enough space → open RIGHT
          if (spaceRight > menuWidth) {
            x = rect.right + 10;
          } 
          // Otherwise → open LEFT
          else {
            x = rect.left - menuWidth - 10;
          }

          onMenuClick({
            x,
            y: rect.bottom + 6
          }, { id, rawId, name });
          }}
        />
      </td>

    </tr>
  );
}

function CreateGarmentModal({ onClose, onCreated, onNotify }: any) {
  const [step, setStep] = useState(1);
  const [transport, setTransport] = useState("Road");
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const [form, setForm] = useState({
    location: "",
    productName: "",
    materials: [] as string[],
    carbon: "4.2",
    water: "15.0",
    certificates: [] as File[],
    image: null as File | null,
    logisticsProvider: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [savedSteps, setSavedSteps] = useState<any>({
    1: false,
    2: false,
    3: false,
  });

  const providerOptions: any = {
    Road: ["DHL Road Freight", "DB Schenker Trucking", "LOOPI Road Partner"],
    Ship: ["Maersk Line", "MSC Shipping", "Ocean DPP Logistics"],
    Air: ["DHL Air Cargo", "FedEx Air Freight", "Emirates SkyCargo"],
  };

  const transportIcon: any = {
    Road: <LocalShippingOutlinedIcon />,
    Ship: <DirectionsBoatOutlinedIcon />,
    Air: <FlightOutlinedIcon />,
  };

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const isStepValid = () => {
    if (step === 1) {
      return form.location && form.productName && form.image && form.materials.length > 0;
    }
    if (step === 2) {
      return form.carbon && form.water && form.certificates.length > 0;
    }
    if (step === 3) {
      return form.logisticsProvider;
    }
    return false;
  };

  const handleSave = () => {
    if (!isStepValid()) {
      if (step === 1) {
        setErrors((prev: any) => ({
          ...prev,
          location: !form.location,
          productName: !form.productName,
          image: !form.image,
          materials: form.materials.length === 0,
        }));
      }
      showToast("Please complete required fields", "error");
      return;
    }

    setSavedSteps((prev: any) => ({ ...prev, [step]: true }));
    showToast(`Step ${step} saved successfully`, "success");
  };

  const handleContinue = () => {
    if (!isStepValid()) {
      if (step === 1) {
        setErrors((prev: any) => ({
          ...prev,
          location: !form.location,
          productName: !form.productName,
          image: !form.image,
          materials: form.materials.length === 0,
        }));
      }
      showToast("Please fill all required fields first.", "error");
      return;
    }

    if (!savedSteps[step]) {
      showToast("Please save this step before continuing.", "error");
      return;
    }

    setStep(step + 1);
  };

  const toggleMaterial = (material: string) => {
    setSavedSteps((prev: any) => ({ ...prev, 1: false }));
    setErrors((prev: any) => ({ ...prev, materials: false }));

    setForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }));
  };

  const handleFinalize = async () => {
    if (!isStepValid()) {
      showToast("Complete the logistics setup before finalizing", "error");
      return;
    }

    setSavedSteps((prev: any) => ({ ...prev, 3: true }));

    try {
      const payload = new FormData();
      payload.append("productName", form.productName);
      payload.append("location", form.location);
      payload.append("materials", JSON.stringify(form.materials));
      payload.append("carbon", form.carbon);
      payload.append("water", form.water);
      payload.append("logisticsProvider", form.logisticsProvider);
      if (form.image) payload.append("image", form.image);

      const createdGarment = await apiFetch<any>("/garments", {
        method: "POST",
        body: payload,
      });

      await Promise.all(
        form.certificates.map((file) => {
          const certificatePayload = new FormData();
          certificatePayload.append("garmentId", createdGarment._id);
          certificatePayload.append("certificateType", "LCA");
          certificatePayload.append("issuer", "LOOPI Verification Authority");
          certificatePayload.append("file", file);

          return apiFetch("/certificates", {
            method: "POST",
            body: certificatePayload,
          });
        })
      );

      showToast("Garment created successfully", "success");
      onNotify?.("Garment created successfully", "success");
      onCreated?.();

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      console.error(err);
      showToast("Error creating garment", "error");
      onNotify?.(err instanceof Error ? err.message : "Error creating garment", "error");
    }
  };

  const handleFiles = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];

    setSavedSteps((prev: any) => ({ ...prev, 2: false }));

    setForm((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setSavedSteps((prev: any) => ({ ...prev, 2: false }));

    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  return (
    <ModalPortal>
    <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />

      {toast && (
        <div
          className={`fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleRoundedIcon style={{ fontSize: 18 }} />
          ) : (
            <CancelOutlinedIcon style={{ fontSize: 18 }} />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="w-[950px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <AddOutlinedIcon />
              </div>

              <div>
                <h2 className="text-lg font-bold">Register New Product</h2>
                <p className="text-sm text-gray-400">
                  Digital Product Passport Creation Wizard
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* STEP FLOW */}
          <div className="flex items-center justify-between px-10 py-5 border-b text-xs font-semibold">
            {["GARMENT INFO", "LCA & CERTIFICATES", "LOGISTICS SETUP"].map((label, i) => {
              const s = i + 1;

              return (
                <div key={i} className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step > s || savedSteps[s]
                        ? "bg-green-600 text-white"
                        : step === s
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s || savedSteps[s] ? (
                      <CheckCircleIcon style={{ fontSize: 18 }} />
                    ) : (
                      s
                    )}
                  </div>

                  <span className={`${step === s ? "text-black" : "text-gray-400"}`}>
                    {label}
                  </span>

                  {i !== 2 && <div className="flex-1 h-[2px] bg-gray-200 ml-2" />}
                </div>
              );
            })}
          </div>

          {/* BODY */}
          <div className="p-8">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6">
            <SelectInput
              label="FACTORY LOCATION"
              value={form.location}
              error={errors.location}  
              icon={<LocationOnOutlinedIcon />}
              options={[
                "Stockholm Factory",
                "Hamburg Facility",
                "Colombo Production Hub",
              ]}
              onChange={(value: string) => {
                setSavedSteps((prev: any) => ({ ...prev, 1: false }));

                //CLEAR ERROR WHEN USER SELECTS
                setErrors((prev: any) => ({ ...prev, location: false }));

                setForm({ ...form, location: value });
              }}
            />

                <Input
                  label="PRODUCT NAME"
                  placeholder="e.g. Recycled Wool Blazer"
                  value={form.productName}
                  error={errors.productName}
                  onChange={(value: string) => {
                    setSavedSteps((prev: any) => ({ ...prev, 1: false }));
                    setForm({ ...form, productName: value });
                  }}
                />

                <div className="col-span-2">
                  <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
                    GARMENT IMAGE *
                  </p>

                  <label
                    className={`flex items-center gap-4 rounded-xl border border-dashed p-4 cursor-pointer hover:border-[#1B5E20] transition ${
                      errors.image
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    {form.image ? (
                      <img
                        src={URL.createObjectURL(form.image)}
                        alt={form.image.name}
                        className="w-20 h-20 rounded-xl object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-white text-gray-400 border flex items-center justify-center">
                        <UploadFileOutlinedIcon />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-700">
                        {form.image ? form.image.name : "Upload product image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, or WebP. Used on the public passport and product register.
                      </p>
                    </div>

                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSavedSteps((prev: any) => ({ ...prev, 1: false }));
                        setForm({ ...form, image: file });
                        setErrors((prev: any) => ({ ...prev, image: false }));
                      }}
                    />
                  </label>
                  {errors.image && (
                    <p className="text-xs text-red-500 mt-1">
                      Garment image is required
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
                    MATERIAL COMPOSITION
                  </p>

                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border">
                    {["Recycled Wool", "Organic Cotton", "Linen", "Hemp", "Polyester", "Tencel"].map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={form.materials.includes(m)}
                          onChange={() => toggleMaterial(m)}
                          className="accent-[#1B5E20]"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                  {errors.materials && (
                    <p className="text-xs text-red-500 mt-1">
                      Select at least one material
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <MetricCard
                    type="green"
                    icon={<LocalFloristOutlinedIcon />}
                    title="CARBON FOOTPRINT (CO2E)"
                    value={form.carbon}
                    unit="kg"
                    onChange={(value: string) => {
                      setSavedSteps((prev: any) => ({ ...prev, 2: false }));
                      setForm({ ...form, carbon: value });
                    }}
                  />

                  <MetricCard
                    type="blue"
                    icon={<WaterDropOutlinedIcon />}
                    title="WATER USAGE"
                    value={form.water}
                    unit="Liters"
                    onChange={(value: string) => {
                      setSavedSteps((prev: any) => ({ ...prev, 2: false }));
                      setForm({ ...form, water: value });
                    }}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
                    COMPLIANCE CERTIFICATES *
                  </p>

                  <div
                    className={`border-2 border-dashed rounded-xl p-6 transition
                    ${
                      errors.certificates
                        ? "border-red-400 bg-red-50"
                        : form.certificates.length > 0
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-[#1B5E20]"
                    }`}
                  >
                    {/* Upload Area */}
                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      <UploadFileOutlinedIcon style={{ fontSize: 40 }} />

                      <p className="mt-2 font-semibold text-sm">
                        Upload Certificates (PDF)
                      </p>

                      <p className="text-xs text-gray-400">
                        You can upload multiple files
                      </p>

                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf"
                        onChange={handleFiles}
                      />
                    </label>

                    {/* File List */}
                    {form.certificates.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {form.certificates.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border"
                          >
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>

                            <div className="flex items-center gap-2">
                              <CheckCircleRoundedIcon className="text-green-600" />

                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => removeFile(i)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ERROR MESSAGE */}
                  {errors.certificates && (
                    <p className="text-xs text-red-500 mt-1">
                      Certificates are required
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
                    TRANSPORT MODE
                  </p>

                  <div className="flex gap-3">
                    {["Road", "Ship", "Air"].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setTransport(m);
                          setSavedSteps((prev: any) => ({ ...prev, 3: false }));
                          setForm({ ...form, logisticsProvider: "" });
                        }}
                        className={`px-8 py-3 rounded-xl border text-sm font-semibold transition ${
                          transport === m
                            ? "bg-[#1B5E20] text-white border-[#1B5E20]"
                            : "bg-white text-gray-600 border-gray-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <SelectInput
                  label="LOGISTICS PROVIDER"
                  value={form.logisticsProvider}
                  icon={transportIcon[transport]}
                  options={providerOptions[transport]}
                  onChange={(value: string) => {
                    setSavedSteps((prev: any) => ({ ...prev, 3: false }));
                    setForm({ ...form, logisticsProvider: value });
                  }}
                />

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="font-semibold text-blue-700">
                    Estimated Transport Emissions
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Based on selected route, emissions are estimated at{" "}
                    <b>
                      {transport === "Road"
                        ? "0.82kg CO2e"
                        : transport === "Ship"
                        ? "0.46kg CO2e"
                        : "1.35kg CO2e"}
                    </b>{" "}
                    per garment unit.
                  </p>

                  <div className="mt-3 h-2 bg-blue-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width:
                          transport === "Road"
                            ? "45%"
                            : transport === "Ship"
                            ? "30%"
                            : "70%",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-5 border-t">
            <button
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-gray-500 disabled:opacity-30"
            >
              <ArrowBackOutlinedIcon /> Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="border px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gray-50"
              >
                <SaveOutlinedIcon style={{ fontSize: 18 }} />
                Save Draft
              </button>

              {step < 3 ? (
                <button
                  onClick={handleContinue}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    isStepValid() && savedSteps[step]
                      ? "bg-[#1B5E20] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue <ArrowForwardOutlinedIcon style={{ fontSize: 18 }} />
                </button>
              ) : (
              <button
                onClick={handleFinalize}
                className={`px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  isStepValid() && savedSteps[3]
                    ? "bg-[#1B5E20] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <SendOutlinedIcon style={{ fontSize: 18 }} />
                Finalize & Ship
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
    </ModalPortal>
  );
}

function Input({ label, value, onChange, placeholder, error }: any) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
        {label} *
      </p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-12 px-4 rounded-xl text-sm outline-none
        ${
          error
            ? "border border-red-400 bg-red-50"
            : "border border-gray-200 bg-gray-50"
        }
        focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]`}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          This field is required
        </p>
      )}
    </div>
  );
}

function SelectInput({ label, value, onChange, options, icon, error }: any) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
        {label} *
      </p>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none
          ${
            error
              ? "border border-red-400 bg-red-50"
              : "border border-gray-200 bg-gray-50"
          }
          focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]`}
        >
          <option value="">Select {label.toLowerCase()}</option>

          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* ICON */}
        <span className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        {/* DROPDOWN ICON */}
        <KeyboardArrowDownOutlinedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          Please select a location
        </p>
      )}
    </div>
  );
}

function MetricCard({ type, icon, title, value, unit, onChange }: any) {
  const style =
    type === "green"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-blue-50 border-blue-200 text-blue-700";

  return (
    <div className={`p-6 rounded-xl border ${style} flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold">{title}</p>

        <div className="flex items-center gap-2 mt-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 bg-transparent text-2xl font-bold outline-none border-b border-transparent focus:border-current"
          />
          <span className="text-sm font-semibold">{unit}</span>
          <EditOutlinedIcon style={{ fontSize: 16 }} />
        </div>
      </div>
    </div>
  );
}

function Card({ type, icon, title, value, unit }: any) {
  const style =
    type === "green"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-blue-50 border-blue-200 text-blue-700";

  return (
    <div className={`p-6 rounded-xl border ${style} flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {value} <span className="text-sm">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function QRModal({ data, onClose, onNotify }: any) {
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);
  // Prefer rawId (db _id) for passport URLs when available, fall back to display id
  const passportIdentifier = data?.rawId || data?.id || "";
  const passportUrl = passportIdentifier
    ? `${window.location.origin}/consumer/passport/${passportIdentifier}`
    : "";

  const handleDownload = () => {
    setDownloading(true);

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) {
      onNotify?.("Unable to generate QR code", "error");
      setDownloading(false);
      return;
    }

    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data?.id || "passport"}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
      onNotify?.("QR code downloaded", "success");
    }, 600);
  };

  const handleShare = async () => {
    try {
      if (navigator.share && passportUrl) {
        await navigator.share({
          title: `LOOPI Passport ${data?.id}`,
          text: data?.name || "Digital Product Passport",
          url: passportUrl,
        });
      } else {
        await navigator.clipboard.writeText(passportUrl);
      }
      onNotify?.("Passport link copied", "success");
    } catch (err) {
      onNotify?.("Unable to share passport link", "error");
    }
  };

  return (
    <ModalPortal>
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="w-[300px] bg-[#F5F6F5] rounded-[28px] shadow-xl p-6 text-center">

          {/* HEADER */}
          <div className="flex items-center justify-center gap-2 text-[#1B5E20] text-[11px] font-semibold tracking-wider mb-2">
            <CheckCircleRoundedIcon style={{ fontSize: 14 }} />
            PASSPORT VERIFICATION NODE
          </div>

          <h2 className="text-[18px] font-semibold text-gray-800">
            Product QR Code
          </h2>

          <p className="text-[11px] text-gray-400 mb-5">
            Immutable Digital Product Passport (DPP)
          </p>

          {/* QR CONTAINER */}
          <div className="relative bg-[#E7E9E8] rounded-[24px] p-4 shadow-inner">

            {/* QR INNER */}
            <div ref={qrRef} className="bg-white rounded-[16px] p-3 shadow-sm inline-block">
              <QRCodeSVG
                value={passportUrl}
                size={208}
                fgColor="#1B5E20"
                bgColor="#FFFFFF"
                level="M"
                includeMargin
              />
            </div>

            {/* DOWNLOAD OVERLAY (IMAGE 3 EFFECT) */}
            {downloading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center rounded-[24px]">

                <div className="w-12 h-12 bg-white border rounded-full flex items-center justify-center shadow">
                  <DownloadOutlinedIcon className="text-[#1B5E20]" />
                </div>

                <p className="text-[11px] mt-2 text-[#1B5E20] font-semibold">
                  DOWNLOAD PNG
                </p>
              </div>
            )}

            {/* NODE TEXT */}
            <div className="mt-3">
              <span className="text-[10px] bg-gray-200 px-3 py-1 rounded-md text-gray-500">
                NODE : {data?.id}
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1B5E20] text-white py-2.5 rounded-xl text-[12px] font-semibold shadow hover:bg-green-800 transition"
            >
              <DownloadOutlinedIcon style={{ fontSize: 16 }} />
              DOWNLOAD
            </button>

            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl text-[12px] text-gray-600 hover:bg-gray-100 transition"
            >
              <IosShareOutlinedIcon style={{ fontSize: 16 }} />
              SHARE
            </button>
          </div>

          {/* DIVIDER */}
          <div className="h-[1px] bg-gray-200 my-5" />

          {/* DISMISS */}
          <button
            onClick={onClose}
            className="mt-4 text-[11px] text-gray-400 tracking-wider hover:text-gray-600"
          >
            DISMISS
          </button>

        </div>
      </div>
    </>
    </ModalPortal>
  );
}

function MenuItem({ icon, title, desc, color = "", onClick, disabled }: any) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center gap-4 px-3 py-3 rounded-xl transition
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white cursor-pointer"}`}
    >
      {/* ICON BOX */}
      <div className="w-12 h-12 rounded-xl bg-[#EEF1EE] flex items-center justify-center">
        {icon}
      </div>

      {/* TEXT */}
      <div className="flex flex-col">
        <p
          className={`text-[15px] font-semibold ${
            disabled
              ? "text-blue-300"
              : color || "text-gray-800"
          }`}
        >
          {title}
        </p>

        <p className="text-[12px] text-gray-400 leading-tight">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ActionMenu({ position, onClose, onView, onGenerateQR, data, onNotify }: any) {
  useEffect(() => {
    const close = () => setTimeout(() => onClose(), 0);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

const hasCertificateFile = Boolean(data?.certificate?.fileUrl);
const menuWidth = 280;
const padding = 12;
const maxHeight = Math.max(240, window.innerHeight - padding * 2);
const estimatedHeight = Math.min(640, maxHeight);

// calculate LEFT
let left = position.x;

// if overflow right → shift left
if (left + menuWidth > window.innerWidth) {
  left = window.innerWidth - menuWidth - padding;
}

// if overflow left → reset
if (left < padding) {
  left = padding;
}

// calculate TOP
let top = position.y;
const openUp = position.y + estimatedHeight > window.innerHeight - padding;

// if overflow bottom → move up
if (openUp) {
  top = window.innerHeight - estimatedHeight - padding;
}

if (top < padding) {
  top = padding;
}

return createPortal(
  <div
    className="fixed z-[9999] w-[280px] bg-[#F6F7F6] rounded-[28px] shadow-[0_25px_90px_rgba(0,0,0,0.2)] p-3 overflow-y-auto"
    style={openUp ? { left, bottom: padding, maxHeight } : { top, left, maxHeight }}
    onClick={(e) => e.stopPropagation()}
  >
      <MenuItem
        icon={<VisibilityOutlinedIcon className="text-blue-600" />}
        title="View Passport"
        desc="Open consumer-facing DPP"
        color="text-blue-600"
        onClick={onView}
      />

      <MenuItem
        icon={<QrCode2OutlinedIcon className="text-green-700" />}
        title="Generate QR"
        desc="Create passport QR code"
        color="text-green-700"
        onClick={onGenerateQR}
      />

      <MenuItem
        icon={<EditOutlinedIcon className="text-gray-600" />}
        title="Edit Garment"
        desc="Update product details"
        onClick={() => {
          onNotify?.("Edit garment is not available in production yet", "error");
          onClose();
        }}
      />

      <MenuItem
        icon={<LocalShippingOutlinedIcon className="text-purple-400" />}
        title="Mark as Shipped"
        desc="Update lifecycle status"
        color="text-purple-400"
        onClick={() => {
          onNotify?.("Shipment status must be updated from Shipment Records", "error");
          onClose();
        }}
      />

      <MenuItem
        icon={<VerifiedUserOutlinedIcon className="text-orange-500" />}
        title="Request Audit"
        desc="Submit for compliance review"
        color="text-orange-500"
        onClick={() => {
          onNotify?.("Audit request sent", "success");
          onClose();
        }}
      />

      <MenuItem
        icon={<DownloadOutlinedIcon className={hasCertificateFile ? "text-green-700" : "text-gray-400"} />}
        title="Download Certificate"
        desc={data?.certificate?.fileName || "No certificate file attached"}
        color={hasCertificateFile ? "text-green-700" : "text-gray-500"}
        disabled={!hasCertificateFile}
        onClick={() => {
          const url = assetUrl(data?.certificate?.fileUrl);
          window.open(url, "_blank", "noopener,noreferrer");
          onNotify?.("Certificate opened", "success");
          onClose();
        }}
      />

      <MenuItem
        icon={<ContentCopyOutlinedIcon className="text-gray-600" />}
        title="Copy Passport ID"
        desc={data?.id}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(data?.id || "");
            onNotify?.("Passport ID copied", "success");
          } catch (err) {
            onNotify?.("Unable to copy passport ID", "error");
          }
          onClose();
        }}
      />

      <div className="border-t my-3 opacity-60" />

      <MenuItem
        icon={<DeleteOutlineOutlinedIcon className="text-red-600" />}
        title="Delete Record"
        desc="Remove from blockchain (requires admin)"
        color="text-red-600"
        onClick={() => {
          onNotify?.("Delete requires admin approval", "error");
          onClose();
        }}
      />
  </div>,
  document.body
);
}

export default Dashboard;
