import { useEffect, useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import WifiTetheringOutlinedIcon from "@mui/icons-material/WifiTetheringOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import ModalPortal from "../../../components/modals/ModalPortal";
import { apiFetch } from "../../../lib/api";

export default function ActiveShipments() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    inTransit: 0,
    delivered: 0,
    delayed: 0,
    activeRoutes: 0,
  });

  const fetchShipments = async () => {
    try {
      const data = await apiFetch("/logistics/shipments");
      setShipments(Array.isArray(data.shipments) ? data.shipments : []);
      setStats({
        inTransit: data.stats?.inTransit || 0,
        delivered: data.stats?.delivered || 0,
        delayed: data.stats?.delayed || 0,
        activeRoutes: data.stats?.activeRoutes || 0,
      });
    } catch (error) {
      console.error("LOGISTICS SHIPMENTS ERROR:", error);
      setShipments([]);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) =>
    [
      shipment.shipmentId,
      shipment.garment,
      shipment.route,
      shipment.mode,
      shipment.provider,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F4F7FB] min-h-screen">
      <div className="grid grid-cols-4 gap-5">
        <TopCard
          title="IN TRANSIT"
          value={stats.inTransit}
          icon={<LocalShippingOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-blue-50"
          color="text-blue-600"
        />
        <TopCard
          title="DELIVERED"
          value={stats.delivered}
          icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-green-50"
          color="text-green-600"
        />
        <TopCard
          title="DELAYED"
          value={stats.delayed}
          icon={<ErrorOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-red-50"
          color="text-red-500"
        />
        <TopCard
          title="ACTIVE ROUTES"
          value={stats.activeRoutes}
          icon={<PlaceOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-purple-50"
          color="text-purple-500"
        />
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[23px] font-semibold text-gray-900">
              Active Shipments
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Live blockchain-tracked shipment status across LOOPI network
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchOutlinedIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                style={{ fontSize: 18 }}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Shipment ID, route..."
                className="w-[180px] h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm outline-none"
              />
            </div>
            <button className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <TuneOutlinedIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-8 px-6 py-4 text-[11px] font-bold tracking-widest text-gray-400 border-b border-gray-100">
            <div>SHIPMENT ID</div>
            <div>GARMENT</div>
            <div>ROUTE</div>
            <div>MODE</div>
            <div>DISTANCE</div>
            <div>EMISSIONS</div>
            <div>ETA</div>
            <div className="text-right pr-2">STATUS</div>
          </div>

          {filteredShipments.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              No logistics shipments found
            </div>
          ) : (
            filteredShipments.map((item) => (
              <ShipmentRow
                key={item.id}
                shipment={item.shipmentId}
                garment={item.garment}
                route={item.route}
                mode={item.mode}
                distance={item.distance}
                emissions={item.emissions}
                eta={item.eta}
                status={formatStatus(item.status)}
                statusStyle={getStatusStyle(item.status)}
                modeIcon={getModeIcon(item.mode)}
                onUpdate={() => {
                  setSelectedShipment(item);
                  setOpenModal(true);
                }}
              />
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            {filteredShipments.length} shipments - All statuses tracked on-chain
          </p>
          <button className="flex items-center gap-2 text-[#1B5E20] text-xs font-bold tracking-widest">
            <FileDownloadOutlinedIcon style={{ fontSize: 18 }} />
            EXPORT
          </button>
        </div>
      </div>

      {openModal && (
        <UpdateShipmentModal
          shipment={selectedShipment}
          onClose={() => setOpenModal(false)}
          onUpdated={fetchShipments}
        />
      )}
    </div>
  );
}

function UpdateShipmentModal({ shipment, onClose, onUpdated }: any) {
  const [status, setStatus] = useState("arrived");
  const [arrivalDate, setArrivalDate] = useState("");
  const [emission, setEmission] = useState("0.62");
  const [documents, setDocuments] = useState<File[]>([]);
  const [toast, setToast] = useState("");

  const handleConfirm = async () => {
    if (!shipment?.id) {
      setToast("Shipment record is missing");
      return;
    }

    try {
      await apiFetch(`/logistics/shipments/${shipment.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          arrivalDate,
          emission,
          documents: documents.map((file) => file.name),
        }),
      });

      setToast("Shipment updated on-chain");
      await onUpdated?.();
      setTimeout(onClose, 900);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <ModalPortal>
      <>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />

        {toast && (
          <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg bg-blue-50 border border-blue-200 text-blue-700">
            <CheckCircleRoundedIcon />
            <span className="text-sm font-medium">{toast}</span>
          </div>
        )}

        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="w-[470px] bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <LocalShippingOutlinedIcon />
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold text-gray-900">
                    Update Shipment
                  </h2>
                  <p className="text-xs font-bold text-blue-600 mt-1">
                    {shipment?.shipmentId || "Shipment"} · {shipment?.garment || "Garment"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700"
              >
                <CloseOutlinedIcon />
              </button>
            </div>

            <div className="p-6">
              <div className="h-14 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <PlaceOutlinedIcon style={{ fontSize: 18 }} />
                  {shipment?.from || "Origin"}
                  <span className="text-gray-300">-&gt;</span>
                  {shipment?.to || "Destination"}
                </div>
                <span className="px-3 py-1 rounded-lg bg-white border text-xs font-bold text-gray-400">
                  {shipment?.mode || "Road"}
                </span>
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-3">
                  ARRIVAL STATUS
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStatus("arrived")}
                    className={`h-11 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 ${
                      status === "arrived"
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <CheckCircleRoundedIcon style={{ fontSize: 18 }} />
                    ARRIVED
                  </button>
                  <button
                    onClick={() => setStatus("delayed")}
                    className={`h-11 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 ${
                      status === "delayed"
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <AccessTimeFilledRoundedIcon style={{ fontSize: 18 }} />
                    DELAYED
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-7">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-2">
                    ACTUAL ARRIVAL DATE
                  </p>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(event) => setArrivalDate(event.target.value)}
                    className="w-full h-11 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm text-gray-700 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-2">
                    EMISSIONS (KG CO2E)
                  </p>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={emission}
                      onChange={(event) => setEmission(event.target.value)}
                      className="w-full h-11 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
                    />
                    <MyLocationOutlinedIcon
                      style={{ fontSize: 17 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-3">
                  SHIPPING DOCUMENTS
                </p>
                <label className="h-[120px] rounded-2xl border border-dashed border-gray-300 bg-[#FAFBFC] flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  <CloudUploadOutlinedIcon style={{ fontSize: 28 }} />
                  <p className="text-sm font-semibold mt-3">
                    {documents.length > 0
                      ? `${documents.length} document(s) selected`
                      : "Upload Delivery Proof / BOL"}
                  </p>
                  <p className="text-[11px] mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={(event) => {
                      if (event.target.files) {
                        setDocuments(Array.from(event.target.files));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                className="text-sm text-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="h-11 px-6 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
              >
                Confirm & Push to Blockchain
              </button>
            </div>
          </div>
        </div>
      </>
    </ModalPortal>
  );
}

function TopCard({ title, value, icon, bg, color }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[13px] font-bold tracking-widest text-gray-400">
          {title}
        </p>
        <h1 className="text-[23px] font-bold text-gray-900 mt-2 leading-none">
          {value}
        </h1>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function ShipmentRow({
  shipment,
  garment,
  route,
  mode,
  distance,
  emissions,
  eta,
  status,
  statusStyle,
  modeIcon,
  onUpdate,
}: any) {
  return (
    <div className="grid grid-cols-8 items-center px-6 py-5 border-b border-gray-100 last:border-none">
      <div className="text-sm font-bold text-gray-900">{shipment}</div>
      <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm">
        <Inventory2OutlinedIcon style={{ fontSize: 15 }} />
        {garment}
      </div>
      <div className="text-sm font-bold text-gray-800">{route}</div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {modeIcon}
        {mode}
      </div>
      <div className="text-sm text-gray-500">{distance}</div>
      <div>
        <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-bold">
          {emissions}
        </span>
      </div>
      <div className="text-sm text-gray-500">{eta}</div>
      <div className="flex items-center justify-end gap-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusStyle}`}>
          • {status}
        </span>
        <button
          onClick={onUpdate}
          className="h-9 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          UPDATE
        </button>
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return (status || "in_transit").replace(/_/g, " ").toUpperCase();
}

function getStatusStyle(status: string) {
  const normalized = status || "in_transit";

  if (normalized === "delivered") return "bg-green-100 text-green-700";
  if (normalized === "delayed") return "bg-red-100 text-red-600";
  return "bg-blue-100 text-blue-700";
}

function getModeIcon(mode: string) {
  if (mode === "Ship") return <NearMeOutlinedIcon style={{ fontSize: 15 }} />;
  if (mode === "Air") return <WifiTetheringOutlinedIcon style={{ fontSize: 15 }} />;
  return <LocalShippingOutlinedIcon style={{ fontSize: 15 }} />;
}
