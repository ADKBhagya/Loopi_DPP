import { useState, useEffect } from "react";
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
import ModalPortal from "../../../components/modals/ModalPortal";
import { apiFetch } from "../../../lib/api";




export default function Certificates() {
  const [openModal, setOpenModal] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const fetchCertificates = async () => {
    try {
      setApiUnavailable(false);
      const data = await apiFetch<any[]>("/certificates");
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CERTIFICATES ERROR:", err);
      setApiUnavailable(true);
      setCertificates([]);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter((certificate) => {
    const haystack = [
      certificate.certificateType,
      certificate.garmentName,
      certificate.issuer,
      certificate.blockchainHash,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search.toLowerCase());
  });

  const expiringSoon = certificates.filter((certificate) => {
    if (!certificate.expiryDate) return false;

    const expiry = new Date(certificate.expiryDate).getTime();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return expiry >= now && expiry <= now + thirtyDays;
  }).length;

  return (
    <div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat 
        icon={<DescriptionOutlinedIcon />} 
        value={certificates.length}
        label="TOTAL CERTIFICATES" 
        type="total" 
        />

        <Stat 
        icon={<CheckCircleOutlineOutlinedIcon />} 
        value={certificates.filter((c) => c.verificationStatus === "verified").length}
        label="VALID" 
        type="valid" 
        />

        <Stat 
        icon={<WarningAmberOutlinedIcon />} 
        value={expiringSoon}
        label="EXPIRING (30D)" 
        type="expiring" 
        />

        <Stat 
        icon={<GppGoodOutlinedIcon />} 
        value={certificates.filter((c) => c.blockchainHash).length}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {apiUnavailable ? (
            <div className="py-16 text-center text-sm text-orange-500">
              Certificate backend is not deployed in production yet
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No certificates found
            </div>
          ) : (
            filteredCertificates.map((certificate) => (
              <CertCard
                key={certificate._id}
                title={certificate.certificateType}
                tag={certificate.verificationStatus?.toUpperCase() || "PENDING"}
                tagColor={certificate.verificationStatus === "verified" ? "green" : "yellow"}
                garment={certificate.garmentName}
                issuer={certificate.issuer}
                issued={formatDate(certificate.issuedDate || certificate.createdAt)}
                expires={formatDate(certificate.expiryDate)}
                hash={certificate.blockchainHash}
                fileName={certificate.fileName}
                expiring={isExpiringSoon(certificate.expiryDate)}
              />
            ))
          )}

        </div>
      </div>
      {openModal && (
        <UploadCertificateModal
          onClose={() => setOpenModal(false)}
          onUploaded={fetchCertificates}
          apiUnavailable={apiUnavailable}
        />
      )}
    </div>
  );
}

export function UploadCertificateModal({ onClose, onUploaded, apiUnavailable }: any) {
  const [form, setForm] = useState({
    garment: "",
    type: "",
    file: null as any,
  });
  
const [search, setSearch] = useState("");
const [showDropdown, setShowDropdown] = useState(false);


  const [errors, setErrors] = useState<any>({});
  const [toast, setToast] = useState("");

  const [garments, setGarments] = useState<any[]>([]);

  useEffect(() => {

  const fetchGarments = async () => {
    try {

      const data = await apiFetch<any[]>("/garments");
      setGarments(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    }
  };

  fetchGarments();

}, []); 

  const filteredGarments = garments.filter((g:any) =>
    g.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
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

  const handleUpload = async () => {
    if (apiUnavailable) {
      showToast("Certificate backend is not deployed yet");
      return;
    }

    if (!validate()) {
      showToast("Please complete all fields");
      return;
    }

    try {
      await apiFetch("/certificates", {
        method: "POST",
        body: JSON.stringify({
          garmentId: form.garment,
          certificateType: form.type,
          issuer: "LOOPI Verification Authority",
          fileName: form.file.name,
          fileUrl: "",
        }),
      });

      showToast("Certificate uploaded & verified");
      onUploaded?.();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <ModalPortal>
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg bg-green-50 border border-green-200 text-green-700">
          <CheckCircleOutlineOutlinedIcon />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
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
                        key={g._id}
                        onClick={() => {
                        setForm({
                          ...form,
                          garment: g._id,
                        });

                        setSearch(g.productName);
                        setShowDropdown(false);
                        setErrors((prev:any) => ({ ...prev, garment: false }));
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                        {g.productName}
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
    </ModalPortal>
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

function formatDate(value?: string) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExpiringSoon(value?: string) {
  if (!value) return false;

  const expiry = new Date(value).getTime();
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return expiry >= now && expiry <= now + thirtyDays;
}

function shortHash(value?: string) {
  if (!value) return "Pending hash";
  if (value.length <= 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function CertCard({ title, tag, tagColor, garment, issuer, issued, expires, expiring, hash, fileName }: any) {

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
            <span>{shortHash(hash)}</span>
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS (FIX STYLE) */}
      <div className="flex gap-2">

        <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs flex items-center gap-1 transition">
          <DownloadOutlinedIcon style={{ fontSize: 14 }} />
          {fileName ? "PDF" : "File"}
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
