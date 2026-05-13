import { useEffect, useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import ModalPortal from "../../../components/modals/ModalPortal";
import { apiFetch } from "../../../lib/api";
import { downloadTextFile } from "../../../lib/download";

type ToastType = "success" | "error";

export default function Shipments() {

  const [showModal, setShowModal] = useState(false); 
  const [trackingShipment, setTrackingShipment] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const fetchShipments = async () => {
  try {
    const data = await apiFetch<any[]>("/shipments");
    setShipments(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("SHIPMENTS ERROR:", err);
  }
};

  useEffect(() => {
  fetchShipments();
}, []);

  const filteredShipments = shipments.filter((shipment) =>
    [shipment.shipmentId, shipment.product, shipment.from, shipment.to, shipment.provider]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const deliveredCount = shipments.filter((s) => s.status === "delivered").length;
  const activeCount = shipments.filter((s) => s.status !== "delivered").length;

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleExportPod = (shipment: any) => {
    if (shipment.status !== "delivered") {
      showToast("Proof of delivery is only available after delivery", "error");
      return;
    }

    const body = [
      "LOOPI Proof of Delivery",
      `Shipment: ${shipment.shipmentId || shipment._id}`,
      `Product: ${shipment.product || "N/A"}`,
      `Route: ${shipment.from || "N/A"} -> ${shipment.to || "N/A"}`,
      `Provider: ${shipment.provider || "N/A"}`,
      `Delivered: ${shipment.actualArrivalDate || shipment.updatedAt || "Recorded on chain"}`,
    ].join("\n");

    downloadTextFile(`${shipment.shipmentId || shipment._id}-pod.txt`, body);
    showToast("Proof of delivery exported", "success");
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleRoundedIcon style={{ fontSize: 18 }} />
          ) : (
            <CloseOutlinedIcon style={{ fontSize: 18 }} />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Stat icon={<LocalShippingOutlinedIcon />} value={activeCount} label="ACTIVE SHIPMENTS" color="blue" />
          <Stat icon={<CheckCircleRoundedIcon />} value={deliveredCount} label="DELIVERED" color="green" />
          <Stat icon={<Inventory2OutlinedIcon />} value={shipments.length} label="TOTAL SHIPMENTS" color="purple" />
          <Stat icon={<EnergySavingsLeafOutlinedIcon />} value="5.8kg" label="AVG CO₂/SHIPMENT" color="green" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[620px]">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shipment Records</h2>
              <p className="text-xs text-gray-400">Active logistics and delivery traceability</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shipment..."
                  className="h-10 w-[190px] pl-10 pr-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                + New Shipment
              </button>
            </div>
          </div>

          {filteredShipments.map((s) => (
            <ShipmentCard
              key={s._id}
              id={s.shipmentId || s._id.slice(-4)}
              status={formatShipmentStatus(s.status)}
              garments={s.product}
              route={`${s.from} → ${s.to}`}
              company={s.provider}
              co2={s.co2 || "6.5kg"}
              progress={s.status === "delivered" ? 100 : s.status === "in_transit" ? 60 : 10}
              eta={s.eta}
              delivered={s.status === "delivered"}
              onTrack={() => setTrackingShipment(s)}
              onExportPod={() => handleExportPod(s)}
              onViewChain={() => {
                window.location.href = "/manufacturer/explorer";
              }}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <CreateShipmentModal
  onClose={() => setShowModal(false)}
  refresh={fetchShipments}
/>
      )}

      {trackingShipment && (
        <TrackingModal
          shipment={trackingShipment}
          onClose={() => setTrackingShipment(null)}
        />
      )}
      
       
    </>
  );
function formatShipmentStatus(status = "in_transit") {
  return status.replace(/_/g, " ").toUpperCase();
}

function Stat({ icon, value, label, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold mt-4 text-gray-900">{value}</h2>
      <p className="text-[11px] font-semibold text-gray-400 tracking-wide">{label}</p>
    </div>
  );
}

function ShipmentCard({ id, status, garments, route, company, co2, progress, eta, delivered, onTrack, onExportPod, onViewChain }: any) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${delivered ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
            <LocalShippingOutlinedIcon />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">{id}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${delivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {status}
              </span>
              <span className="text-xs text-gray-400">{garments}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
              <span className="flex items-center gap-1">
                <LocationOnOutlinedIcon style={{ fontSize: 14 }} />
                {route}
              </span>
              <span>{company}</span>
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <EnergySavingsLeafOutlinedIcon  style={{ fontSize: 14 }} />
                {co2}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <p className="text-gray-400 font-semibold">ETA</p>
          <p className="font-bold text-gray-700">{eta}</p>
        </div>
      </div>

      <div className="ml-[60px] mt-5">
        <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2">
          <span>DELIVERY PROGRESS</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${delivered ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onTrack}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition"
          >
            <PublicOutlinedIcon style={{ fontSize: 15 }} />
            Track Live
          </button>

          <button
            onClick={onExportPod}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <DownloadOutlinedIcon style={{ fontSize: 15 }} />
            Export PoD
          </button>

          <button
            onClick={onViewChain}
            className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold flex items-center gap-2 hover:bg-green-100 transition"
          >
            <TagOutlinedIcon style={{ fontSize: 15 }} />
            View on Chain
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackingModal({ shipment, onClose }: any) {
  const route = `${shipment.from || "Origin pending"} -> ${shipment.to || "Destination pending"}`;
  const progress = shipment.status === "delivered" ? 100 : shipment.status === "in_transit" ? 60 : 15;

  return (
    <ModalPortal>
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <PublicOutlinedIcon />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Live Shipment Tracking</h2>
                  <p className="text-sm text-gray-400">{shipment.shipmentId || shipment._id}</p>
                </div>
              </div>
              <button onClick={onClose}>
                <CloseOutlinedIcon />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-xs text-blue-600 font-bold">CURRENT ROUTE</p>
                <p className="font-semibold text-gray-800 mt-1">{route}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {shipment.currentLocation || shipment.from || "Location signal pending"}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2">
                  <span>DELIVERY PROGRESS</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Info label="PROVIDER" value={shipment.provider || "N/A"} />
                <Info label="ETA" value={shipment.eta || "N/A"} />
                <Info label="TRANSPORT" value={shipment.transport || "N/A"} />
                <Info label="STATUS" value={(shipment.status || "in_transit").replace(/_/g, " ").toUpperCase()} />
              </div>
            </div>
          </div>
        </div>
      </>
    </ModalPortal>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
      <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function CreateShipmentModal({ onClose, refresh }: any) {
  const [form, setForm] = useState({
    shipmentId: "",
    garmentId: "",
    product: "",
    from: "",
    to: "",
    transport: "Road",
    provider: "",
    eta: "",
    retailerId: "",
  });
  const [retailers, setRetailers] = useState<any[]>([]);
  const [garments, setGarments] = useState<any[]>([]);
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const id = "SHP-" + Math.floor(1000 + Math.random() * 9000);
    setForm((prev) => ({ ...prev, shipmentId: id }));
  }, []);

  useEffect(() => {
    apiFetch<any[]>("/manufacturer/retailers")
      .then((data) => setRetailers(Array.isArray(data) ? data : []))
      .catch(() => setRetailers([]));
  }, []);

  useEffect(() => {
    apiFetch<any[]>("/manufacturer/garments")
      .then((data) => setGarments(Array.isArray(data) ? data : []))
      .catch(() => setGarments([]));
  }, []);

  const providerOptions: any = {
    Road: ["DHL Road Freight", "DB Schenker Trucking", "LOOPI Road Partner"],
    Ship: ["Maersk Line", "MSC Shipping", "Ocean DPP Logistics"],
    Air: ["DHL Air Cargo", "FedEx Air Freight", "Emirates SkyCargo"],
  };

  const [errors, setErrors] = useState<any>({});
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.shipmentId) newErrors.shipmentId = true;
    if (!form.product) newErrors.product = true;
    if (!form.from) newErrors.from = true;
    if (!form.to) newErrors.to = true;
    if (!form.transport) newErrors.transport = true;
    if (!form.provider) newErrors.provider = true;
    if (!form.eta) newErrors.eta = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transportIcon: any = {
    Road: <LocalShippingOutlinedIcon style={{ fontSize: 18 }} />,
    Ship: <DirectionsBoatOutlinedIcon style={{ fontSize: 18 }} />,
    Air: <FlightOutlinedIcon style={{ fontSize: 18 }} />,
  };
  

  const handleCreate = async () => {
    if (!validate()) {
      showToast("Fill all fields", "error");
      return;
    }

    try {
      await apiFetch("/shipments", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          status: "in_transit",
        }),
      });

      showToast("Shipment created", "success");
      await refresh?.();

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Shipment creation failed", "error");
    }
  };

  return (
    <ModalPortal>
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
      />

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircleRoundedIcon /> : <CloseOutlinedIcon />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="w-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <LocalShippingOutlinedIcon />
              </div>

              <div>
                <h2 className="text-lg font-bold">Create Shipment</h2>
                <p className="text-sm text-gray-400">
                  Logistics & delivery configuration
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-2 gap-5">

            <Input
              label="Shipment ID"
              icon={<Inventory2OutlinedIcon />}
              value={form.shipmentId}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm text-gray-500"
            />

            <Select
              label="Product Name"
              icon={<Inventory2OutlinedIcon />}
              value={form.product}
              error={errors.product}
              options={
                garments.length > 0
                  ? garments.map((garment) => garment.productName || garment.sku || garment._id)
                  : []
              }
              onChange={(v:any) => {
                const garment = garments.find((item) => (item.productName || item.sku || item._id) === v);
                setForm({ ...form, product: v, garmentId: garment?._id || "" });
                setErrors((prev:any) => ({ ...prev, product: false }));
              }}
            />

            <Select
              label="From Location"
              icon={<LocationOnOutlinedIcon style={{ fontSize: 18 }} />}
              value={form.from}
              error={errors.from}
              options={[
                "Stockholm, SE",
                "Berlin, DE",
                "Amsterdam, NL",
                "Colombo, LK",
              ]}
              onChange={(v:any) => {
                setForm({ ...form, from: v });
                setErrors((prev:any) => ({ ...prev, from: false }));
              }}
            />

            <Select
              label="Destination"
              icon={<PublicOutlinedIcon style={{ fontSize: 18 }} />}
              value={form.to}
              error={errors.to}
              options={
                retailers.length > 0
                  ? retailers.map((retailer) => retailer.destination)
                  : [
                    "Berlin, DE",
                    "Paris, FR",
                    "London, UK",
                    "Tokyo, JP",
                  ]
              }
              onChange={(v:any) => {
                const retailer = retailers.find((item) => item.destination === v);
                setForm({ ...form, to: v, retailerId: retailer?.id || "" });
                setErrors((prev:any) => ({ ...prev, to: false }));
              }}
            />

              {/*  TRANSPORT MODE */}
              <div className="col-span-2">
                <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
                  Transport Mode *
                </p>

                <div className="flex gap-3">
                  {["Road", "Ship", "Air"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setForm({
                          ...form,
                          transport: mode,
                          provider: "", // reset provider
                        });
                        setErrors((prev:any) => ({ ...prev, transport: false }));
                      }}
                      className={`px-6 py-2 rounded-xl border text-sm font-semibold transition ${
                        form.transport === mode
                          ? "bg-[#1B5E20] text-white border-[#1B5E20]"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {errors.transport && (
                  <p className="text-xs text-red-500 mt-1">Required field</p>
                )}
              </div>

          <Select
            label="Logistics Provider"
            icon={transportIcon[form.transport]}
            value={form.provider}
            error={errors.provider}
            options={providerOptions[form.transport] || []}   
            onChange={(v: any) => {
              setForm({ ...form, provider: v });
              setErrors((prev:any) => ({ ...prev, provider: false }));
            }}
          />

            {/*  ESTIMATED DELIVERY */}
            <div>
              <p className="text-xs font-semibold mb-2 text-gray-500">
                Estimated Delivery *
              </p>

              <div className="flex items-center gap-3 px-3 h-11 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#1B5E20]">
                <AccessTimeOutlinedIcon style={{ fontSize: 18, color: "#6B7280" }} /> 

                <input
                  type="datetime-local"
                  value={form.eta}
                  onChange={(e) => {
                    setForm({ ...form, eta: e.target.value });
                    setErrors((prev:any) => ({ ...prev, eta: false }));
                  }}
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>

              {errors.eta && (
                <p className="text-xs text-red-500 mt-1">Required field</p>
              )}
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-5 border-t">
            <button
              onClick={onClose}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              className="bg-[#1B5E20] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition"
            >
              Create Shipment
            </button>
          </div>

        </div>
      </div>
    </>
    </ModalPortal>
  );
}

function Input({ label, icon, value, onChange, error, readOnly }: any) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-gray-500">
        {label} *
      </p>

      <div
        className={`flex items-center gap-3 px-3 h-11 rounded-xl border
        ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}
        focus-within:border-[#1B5E20]`}
      >
        <span className="text-gray-400 text-[16px]">{icon}</span>

        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          Required field
        </p>
      )}
    </div>
  );
}

function Select({ label, icon, value, onChange, options, error }: any) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-gray-500">
        {label} *
      </p>

      <div
        className={`flex items-center gap-3 px-3 h-11 rounded-xl border
        ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}
        focus-within:border-[#1B5E20]`}
      >
        <span className="text-gray-400">{icon}</span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        >
          <option value="">Select option</option>
          {(options || []).map((o:any) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          Required field
        </p>
      )}
    </div>
  );
}
}

