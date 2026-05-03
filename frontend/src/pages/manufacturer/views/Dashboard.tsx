import { useState, useEffect } from "react";
import Sidebar from "../../manufacturer/components/Sidebar";
import Topbar from "../../manufacturer/components/Topbar";

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



function Dashboard() {
  const [view, setView] = useState("overview");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">

      <Sidebar view={view} setView={setView} />

      {/* TOAST */}
      {message && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{
            background: "rgba(220, 252, 231, 0.9)",
            border: "1px solid #BBF7D0",
            color: "#166534",
          }}
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white">
            <CheckCircleRoundedIcon style={{ fontSize: 16 }} />
          </div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 ml-[210px]">
        <Topbar />

        <div className="pt-[90px] px-6">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard icon="clock" value="12" label="DRAFT GARMENTS" />
            <StatCard icon="truck" value="08" label="IN SHIPMENT" />
            <StatCard icon="audit" value="05" label="PENDING AUDIT" />
            <StatCard icon="success" value="142" label="APPROVED" />
            <StatCard icon="reject" value="02" label="REJECTED" />
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

              {[
                { label: "DRAFT", status: "done" },
                { label: "SHIPPED", status: "done" },
                { label: "UNDER AUDIT", status: "current" },
                { label: "GOV REVIEW", status: "upcoming" },
                { label: "APPROVED", status: "upcoming" },
                { label: "ACTIVE", status: "upcoming" },
              ].map((step, i) => {
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
                <ProductRow id="GP-9821" name="Recycled Wool Blazer" material="Wool, PET" co2="4.2kg" water="15L" status="approved" />
                <ProductRow id="GP-9822" name="Organic Cotton T-Shirt" material="Cotton" co2="1.8kg" water="2.5L" status="pending" />
                <ProductRow id="GP-9823" name="Linen Trousers" material="Linen" co2="2.1kg" water="8L" status="shipment" />
                <ProductRow id="GP-9824" name="Denim Jacket" material="Cotton, Elastane" co2="12.5kg" water="45L" status="draft" />
              </tbody>
            </table>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <span>SHOWING 4 RECORDS</span>

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
        <CreateGarmentModal onClose={() => setShowCreateModal(false)} />
      )}

      </div>
    </div>
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
      <p className="text-[10px] text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function ProductRow({ id, name, material, co2, water, status }: any) {
  const statusStyle: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-600",
    shipment: "bg-blue-100 text-blue-600",
    draft: "bg-gray-100 text-gray-500",
  };

  const statusLabel: any = {
    approved: "APPROVED",
    pending: "PENDING AUDIT",
    shipment: "IN SHIPMENT",
    draft: "DRAFT",
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">

      <td className="py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Inventory2OutlinedIcon style={{ fontSize: 16 }} />
        </div>
        {id}
      </td>

      <td className="font-medium">{name}</td>
      <td className="text-gray-500">{material}</td>

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
        <span className={`px-3 py-1 rounded-full text-xs ${statusStyle[status]}`}>
          {statusLabel[status]}
        </span>
      </td>

      <td className="flex justify-end gap-3">
        <QrCode2OutlinedIcon className="text-gray-400 cursor-pointer" />
        <MoreVertOutlinedIcon className="text-gray-400 cursor-pointer" />
      </td>

    </tr>
  );
}

function CreateGarmentModal({ onClose }: any) {
  const [step, setStep] = useState(1);
  const [transport, setTransport] = useState("Road");

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[90]">
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

                  {/* CIRCLE */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step > s
                        ? "bg-green-600 text-white"
                        : step === s
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s ? <CheckCircleIcon style={{ fontSize: 18 }} /> : s}
                  </div>

                  {/* LABEL */}
                  <span className={`${step === s ? "text-black" : "text-gray-400"}`}>
                    {label}
                  </span>

                  {/* LINE */}
                  {i !== 2 && (
                    <div className="flex-1 h-[2px] bg-gray-200 ml-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* BODY */}
          <div className="p-8">

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6">

                <Input label="FACTORY LOCATION" />
                <Input label="PRODUCT NAME" placeholder="e.g. Recycled Wool Blazer" />

                <div className="col-span-2">
                  <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
                    MATERIAL COMPOSITION
                  </p>

                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border">
                    {["Recycled Wool", "Organic Cotton", "Linen", "Hemp", "Polyester", "Tencel"].map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="accent-[#1B5E20]" />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="space-y-6">

                <div className="grid grid-cols-2 gap-6">

                  <Card type="green" icon={<LocalFloristOutlinedIcon />} title="CARBON FOOTPRINT (CO2E)" value="4.2" unit="kg" />

                  <Card type="blue" icon={<WaterDropOutlinedIcon />} title="WATER USAGE" value="15.0" unit="Liters" />

                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
                    COMPLIANCE CERTIFICATES
                  </p>

                  <div className="border rounded-xl p-10 text-center text-gray-400 bg-gray-50">
                    <UploadFileOutlinedIcon style={{ fontSize: 40 }} />
                    <p className="mt-4 font-semibold">
                      Drop GOTS, OEKO-TEX or LCA PDFs here
                    </p>
                    <p className="text-xs mt-1">
                      Max size 10MB per file. Authenticity verified by AI.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <div className="space-y-6">

                <Input label="LOGISTICS PROVIDER" icon={<LocalShippingOutlinedIcon />} />

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
                    TRANSPORT MODE
                  </p>

                  <div className="flex gap-3">
                    {["Road", "Ship", "Air"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTransport(m)}
                        className={`px-6 py-2 rounded-xl border text-sm font-medium ${
                          transport === m
                            ? "bg-[#1B5E20] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="font-semibold text-blue-700">
                    Estimated Transport Emissions
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Based on route Stockholm → Hamburg (Road), emissions are estimated at <b>0.82kg CO2e</b>
                  </p>

                  <div className="mt-3 h-2 bg-blue-200 rounded-full">
                    <div className="w-1/2 h-full bg-blue-600 rounded-full" />
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
              className="flex items-center gap-2 text-gray-400 disabled:opacity-30"
            >
              <ArrowBackOutlinedIcon /> Back
            </button>

            <div className="flex gap-3">

              <button className="border px-5 py-2 rounded-xl text-sm">
                Save Draft
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-[#1B5E20] text-white px-6 py-2 rounded-xl text-sm font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <button className="bg-[#1B5E20] text-white px-6 py-2 rounded-xl text-sm font-semibold">
                  Finalize & Ship
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function Input({ label, placeholder, icon }: any) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 text-gray-500 tracking-wide">
        {label}
      </p>

      <div className="relative">
        {icon && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}

        <input
          placeholder={placeholder}
          className="w-full h-12 px-4 rounded-xl border bg-gray-50 text-sm outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
        />
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

export default Dashboard;