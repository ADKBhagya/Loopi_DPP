import { useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";




export default function Certificates() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat 
        icon={<DescriptionOutlinedIcon />} 
        value="5" 
        label="TOTAL CERTIFICATES" 
        type="total" 
        />

        <Stat 
        icon={<CheckCircleOutlineOutlinedIcon />} 
        value="4" 
        label="VALID" 
        type="valid" 
        />

        <Stat 
        icon={<WarningAmberOutlinedIcon />} 
        value="1" 
        label="EXPIRING (30D)" 
        type="expiring" 
        />

        <Stat 
        icon={<GppGoodOutlinedIcon />} 
        value="5" 
        label="ON-CHAIN VERIFIED" 
        type="verified" 
        />
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-7">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Compliance Certificates
            </h2>
            <p className="text-xs text-gray-400">
              Blockchain-verified compliance documentation
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="relative">
              <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
              <input
                placeholder="Search certificates..."
                className="h-10 w-[200px] pl-10 pr-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
            onClick={() => setOpenModal(true)}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
              + Upload Certificate
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">

          <CertCard
            title="GOTS Certification"
            tag="ORGANIC"
            tagColor="green"
            garment="GP-9821"
            issuer="GOTS Global"
            issued="Jan 10, 2026"
            expires="Jan 10, 2027"
          />

          <CertCard
            title="OEKO-TEX Standard 100"
            tag="SAFETY"
            tagColor="blue"
            garment="GP-9822"
            issuer="Oeko-Tex"
            issued="Dec 5, 2025"
            expires="Dec 5, 2026"
          />

          <CertCard
            title="LCA Environmental Assessment"
            tag="LCA"
            tagColor="purple"
            garment="GP-9823"
            issuer="Bureau Veritas"
            issued="Nov 20, 2025"
            expires="Nov 20, 2026"
          />

          <CertCard
            title="EU Ecolabel"
            tag="ECO"
            tagColor="yellow"
            garment="GP-9824"
            issuer="EU Commission"
            issued="Sep 1, 2025"
            expires="Sep 1, 2026"
            expiring
          />

        </div>
      </div>
      {openModal && <UploadCertificateModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}

export function UploadCertificateModal({ onClose }: any) {
  const [form, setForm] = useState({
    garment: "",
    type: "",
    file: null as any,
  });
  
const [search, setSearch] = useState("");
const [showDropdown, setShowDropdown] = useState(false);


  const [errors, setErrors] = useState<any>({});
  const [toast, setToast] = useState("");

  const garments = [
    "GP-9821 Cotton Shirt",
    "GP-9822 Denim Jacket",
    "GP-9823 Linen Pants",
  ];
  const filteredGarments = garments.filter((g) =>
  g.toLowerCase().includes(search.toLowerCase())
);

  const types = ["GOTS", "OEKO-TEX", "LCA", "EU Ecolabel", "RCS"];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const validate = () => {
    const err: any = {};
    if (!form.garment) err.garment = true;
    if (!form.type) err.type = true;
    if (!form.file) err.file = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = () => {
    if (!validate()) {
      showToast("Please complete all fields");
      return;
    }

    showToast("Certificate uploaded & verified");

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg bg-green-50 border border-green-200 text-green-700">
          <CheckCircleOutlineOutlinedIcon />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[90]">
        <div className="w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <CloudUploadOutlinedIcon />
              </div>

              <div>
                <h2 className="text-lg font-bold">Upload Certificate</h2>
                <p className="text-sm text-gray-400">
                  Hash verified & recorded on blockchain
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {/* GARMENT SEARCH */}
            <div className="relative">
            <p className="text-xs font-semibold text-gray-500 mb-2">
                LINKED GARMENT *
            </p>

            <div className={`flex items-center gap-2 px-3 h-11 rounded-xl border 
            ${errors.garment ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}>

                <SearchOutlinedIcon className="text-gray-400" />

                <input
                value={search}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                }}
                placeholder="Search garment..."
                className="flex-1 bg-transparent outline-none text-sm"
                />
            </div>

            {/* DROPDOWN */}
            {showDropdown && (
                <div className="absolute top-12 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
                {filteredGarments.length === 0 ? (
                    <p className="p-3 text-sm text-gray-400">No results</p>
                ) : (
                    filteredGarments.map((g) => (
                    <div
                        key={g}
                        onClick={() => {
                        setForm({ ...form, garment: g });
                        setSearch(g);
                        setShowDropdown(false);
                        setErrors((prev:any) => ({ ...prev, garment: false }));
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                        {g}
                    </div>
                    ))
                )}
                </div>
            )}
            </div>

            {/* CERT TYPE */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                CERTIFICATE TYPE *
              </p>

              <div className="flex gap-3 flex-wrap">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
                      form.type === t
                        ? "bg-[#1B5E20] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {errors.type && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </div>

            {/* FILE UPLOAD */}
                <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);

                    const file = e.dataTransfer.files[0];

                    if (file && file.type === "application/pdf") {
                    setForm({ ...form, file });
                    setErrors((prev:any) => ({ ...prev, file: false }));
                    } else {
                    showToast("Only PDF allowed");
                    }
                }}
                onClick={() => document.getElementById("fileInput")?.click()}
                className={`h-[180px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition
                ${
                    errors.file
                    ? "border-red-400 bg-red-50"
                    : dragActive
                    ? "border-[#1B5E20] bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-[#1B5E20]"
                }`}
                >
                <CloudUploadOutlinedIcon style={{ fontSize: 40 }} />

                {form.file ? (
                    <p className="mt-2 text-sm font-semibold text-green-700">
                    {form.file.name}
                    </p>
                ) : (
                    <>
                    <p className="font-semibold mt-2">
                        Drop PDF here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Max 10MB • AI verified hash
                    </p>
                    </>
                )}
                </div>

                <input
                    id="fileInput"
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e: any) => {
                        const file = e.target.files[0];

                        if (file && file.type === "application/pdf") {
                        setForm({ ...form, file });
                        setErrors((prev:any) => ({ ...prev, file: false }));
                        } else {
                        showToast("Only PDF allowed");
                        }
                    }}
                    />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-4 px-6 py-5 border-t">
            <button
              onClick={onClose}
              className="text-gray-500 font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              className="bg-[#1B5E20] text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <VerifiedOutlinedIcon />
              Upload & Verify
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ icon, value, label, type }: any) {

  const styles: any = {
    total: "bg-blue-50 text-blue-600",
    valid: "bg-green-50 text-green-600",
    expiring: "bg-orange-50 text-orange-500",
    verified: "bg-green-50 text-green-700",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">

      {/* ICON */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles[type]}`}>
        {icon}
      </div>

      {/* VALUE */}
      <h2 className="text-2xl font-bold mt-3 text-gray-900">
        {value}
      </h2>

      {/* LABEL */}
      <p className="text-[11px] font-semibold text-gray-400 tracking-wide">
        {label}
      </p>
    </div>
  );
}

function CertCard({ title, tag, tagColor, garment, issuer, issued, expires, expiring }: any) {

  const tagStyles: any = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex justify-between items-center hover:shadow-sm transition">

      {/* LEFT */}
      <div className="flex gap-4 items-start">

        {/* ICON FIX */}
        <div className="w-11 h-11 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
          <VerifiedOutlinedIcon style={{ fontSize: 20 }} />
        </div>

        <div>

          {/* TITLE + TAG */}
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800">{title}</p>

            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${tagStyles[tagColor]}`}>
              {tag}
            </span>
          </div>

          {/* META */}
          <p className="text-xs text-gray-400 mt-1">
            Garment: {garment} • Issuer: {issuer} • Issued: {issued} •{" "}
            <span className={expiring ? "text-orange-500 font-semibold" : ""}>
              Expires: {expires}
            </span>
          </p>

          {/* HASH LINE (NEW 🔥) */}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>0xA3F9...21B8</span>
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS (FIX STYLE) */}
      <div className="flex gap-2">

        <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs flex items-center gap-1 transition">
          <DownloadOutlinedIcon style={{ fontSize: 14 }} />
          PDF
        </button>

        <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs flex items-center gap-1 transition">
          <ContentCopyOutlinedIcon style={{ fontSize: 14 }} />
          Hash
        </button>

        <button className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs flex items-center gap-1 transition">
          <VerifiedUserOutlinedIcon style={{ fontSize: 14 }} />
          Verify
        </button>

        {expiring && (
          <button className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs flex items-center gap-1 transition">
            <AutorenewOutlinedIcon style={{ fontSize: 14 }} />
            Renew
          </button>
        )}

      </div>
    </div>
  );
}