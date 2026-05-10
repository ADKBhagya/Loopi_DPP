import { useState } from "react";

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
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";

export default function ActiveShipments() {

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-8 bg-[#F4F7FB] min-h-screen">

      {/* ================= TOP STATS ================= */}

      <div className="grid grid-cols-4 gap-5 mt-16">

        <TopCard
          title="IN TRANSIT"
          value="24"
          icon={<LocalShippingOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-blue-50"
          color="text-blue-600"
        />

        <TopCard
          title="DELIVERED"
          value="1,248"
          icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-green-50"
          color="text-green-600"
        />

        <TopCard
          title="DELAYED"
          value="3"
          icon={<ErrorOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-red-50"
          color="text-red-500"
        />

        <TopCard
          title="ACTIVE ROUTES"
          value="8"
          icon={<PlaceOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-purple-50"
          color="text-purple-500"
        />
      </div>

      {/* ================= TABLE ================= */}

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        {/* HEADER */}
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
                placeholder="Shipment ID, route..."
                className="w-[180px] h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm outline-none"
              />
            </div>

            <button className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <TuneOutlinedIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* TABLE */}
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

          <ShipmentRow
            shipment="SH-4402"
            garment="GP-9823"
            route="Stockholm → Hamburg"
            mode="Road"
            distance="892 km"
            emissions="0.82 kg"
            eta="2026-03-22"
            status="IN TRANSIT"
            statusStyle="bg-blue-100 text-blue-700"
            modeIcon={<LocalShippingOutlinedIcon style={{ fontSize: 15 }} />}
            onUpdate={() => setOpenModal(true)}
          />

          <ShipmentRow
            shipment="SH-4403"
            garment="GP-9811"
            route="Porto → London"
            mode="Ship"
            distance="1,640 km"
            emissions="2.15 kg"
            eta="2026-03-18"
            status="DELIVERED"
            statusStyle="bg-green-100 text-green-700"
            modeIcon={<NearMeOutlinedIcon style={{ fontSize: 15 }} />}
            onUpdate={() => setOpenModal(true)}
          />

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100">

          <p className="text-sm text-gray-400">
            4 shipments · All statuses tracked on-chain
          </p>

          <button className="flex items-center gap-2 text-[#1B5E20] text-xs font-bold tracking-widest">
            <FileDownloadOutlinedIcon style={{ fontSize: 18 }} />
            EXPORT
          </button>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <UpdateShipmentModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}

/* ================= UPDATE MODAL ================= */

function UpdateShipmentModal({ onClose }: any) {

  const [status, setStatus] = useState("arrived");
  const [arrivalDate, setArrivalDate] = useState("");
  const [emission, setEmission] = useState("0.62");
  const [documents, setDocuments] = useState<File[]>([]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80]" />

      <div className="fixed inset-0 z-[90] flex items-center justify-center">

        <div className="w-[470px] bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
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
                  SH-4405 · GP-9877
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

          {/* BODY */}
          <div className="p-6">

            {/* ROUTE */}
            <div className="h-14 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-5 flex items-center justify-between">

              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <PlaceOutlinedIcon style={{ fontSize: 18 }} />
                Amsterdam, NL
                <span className="text-gray-300">→</span>
                Paris, FR
              </div>

              <span className="px-3 py-1 rounded-lg bg-white border text-xs font-bold text-gray-400">
                Road
              </span>
            </div>

            {/* STATUS */}
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

            {/* INPUTS */}
            <div className="grid grid-cols-2 gap-4 mt-7">

            {/* DATE */}
            <div>
                <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-2">
                ACTUAL ARRIVAL DATE
                </p>

                <div className="relative">
                <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full h-11 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 pr-10 text-sm text-gray-700 outline-none focus:border-blue-500"
                />

                </div>
            </div>

            {/* EMISSIONS */}
            <div>
                <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-2">
                EMISSIONS (KG CO₂E)
                </p>

                <div className="relative">

                <input
                    type="number"
                    step="0.01"
                    value={emission}
                    onChange={(e) => setEmission(e.target.value)}
                    className="w-full h-11 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
                />

                <MyLocationOutlinedIcon
                    style={{ fontSize: 17 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                </div>
            </div>
            </div>

            {/* UPLOAD */}
                <div className="mt-7">

                <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-3">
                    SHIPPING DOCUMENTS
                </p>

                {/* EMPTY STATE */}
                {documents.length === 0 && (
                    <label className="h-[120px] rounded-2xl border border-dashed border-gray-300 bg-[#FAFBFC] flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">

                    <CloudUploadOutlinedIcon
                        style={{ fontSize: 28 }}
                    />

                    <p className="text-sm font-semibold mt-3">
                        Upload Delivery Proof / BOL
                    </p>

                    <p className="text-[11px] mt-1">
                        PDF, PNG, JPG up to 10MB
                    </p>

                    <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                        if (e.target.files) {
                            setDocuments((prev) => [
                            ...prev,
                            ...Array.from(e.target.files!)
                            ]);
                        }
                        }}
                    />
                    </label>
                )}

                {/* UPLOADED STATE */}
                {documents.length > 0 && (
                    <div className="rounded-2xl border border-dashed border-green-400 bg-green-50/40 p-5">

                    {/* TOP */}
                    <div className="flex flex-col items-center justify-center text-center">

                        <CloudUploadOutlinedIcon
                        style={{ fontSize: 32 }}
                        className="text-black"
                        />

                        <h3 className="text-sm font-bold text-gray-900 mt-2">
                        Upload Certificates (PDF)
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                        You can upload multiple files
                        </p>
                    </div>

                    {/* FILES */}
                    <div className="mt-5 space-y-3">

                        {documents.map((file, index) => (

                        <div
                            key={index}
                            className="h-12 rounded-xl bg-white border border-gray-200 px-4 flex items-center justify-between"
                        >

                            {/* FILE NAME */}
                            <p className="text-sm text-gray-700 truncate">
                            {file.name}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex items-center gap-3">

                            <CheckCircleRoundedIcon
                                className="text-green-600"
                                style={{ fontSize: 20 }}
                            />

                            <button
                                onClick={() => {
                                setDocuments((prev) =>
                                    prev.filter((_, i) => i !== index)
                                );
                                }}
                                className="text-red-400 hover:text-red-500 transition"
                            >
                                <CloseOutlinedIcon style={{ fontSize: 18 }} />
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* ADD MORE */}
                    <label className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700">

                        <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />

                        Upload Another File

                        <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                            if (e.target.files) {
                            setDocuments((prev) => [
                                ...prev,
                                ...Array.from(e.target.files!)
                            ]);
                            }
                        }}
                        />
                    </label>
                    </div>
                )}
                </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-4">

            <button
              onClick={onClose}
              className="text-sm text-gray-400 font-medium"
            >
              Cancel
            </button>

            <button className="h-11 px-6 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
              Confirm & Push to Blockchain
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= TOP CARD ================= */

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

/* ================= ROW ================= */

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

      <div className="text-sm font-bold text-gray-900">
        {shipment}
      </div>

      <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm">
        <Inventory2OutlinedIcon style={{ fontSize: 15 }} />
        {garment}
      </div>

      <div className="text-sm font-bold text-gray-800">
        {route}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        {modeIcon}
        {mode}
      </div>

      <div className="text-sm text-gray-500">
        {distance}
      </div>

      <div>
        <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-bold">
          {emissions}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        {eta}
      </div>

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