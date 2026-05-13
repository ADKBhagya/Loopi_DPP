import { useState } from "react";
import { apiFetch } from "../../../lib/api";

/* OUTLINED ICONS */
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

type Props = {
  onClose: () => void;
  initialPassportId?: string;
};

type Step = 1 | 2 | 3;

const recyclingMethods = [
  {
    label: "Drop-off at Recycling Center",
    description: "Take the garment to a verified LOOPI recycling partner.",
  },
  {
    label: "Schedule Pickup",
    description: "Request a partner pickup from your selected location.",
  },
  {
    label: "Retail Return Point",
    description: "Return the product to a LOOPI retail collection point.",
  },
];

const recyclingCenters = [
  {
    name: "LOOPI Circular Hub",
    location: "Colombo 03",
    distance: "2.1 km",
    status: "Open today",
  },
  {
    name: "Green Fiber Recovery",
    location: "Nugegoda",
    distance: "4.6 km",
    status: "Open until 18:00",
  },
  {
    name: "Textile Loop Center",
    location: "Rajagiriya",
    distance: "5.2 km",
    status: "Partner verified",
  },
];

export default function RecyclingRequestModal({
  onClose,
  initialPassportId = "",
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [passportId, setPassportId] = useState(initialPassportId);
  const [verified, setVerified] = useState(false);

  const [method, setMethod] = useState("Drop-off at Recycling Center");
  const [selectedCenter, setSelectedCenter] = useState("LOOPI Circular Hub");
  const [preferredDate, setPreferredDate] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const verifyProduct = async () => {
    if (!passportId.trim()) {
      alert("Please enter Product Passport ID");
      return;
    }

    try {
      await apiFetch<any>(`/consumer/verify/${passportId.trim()}`);
      setVerified(true);
      setStep(2);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Product verification failed");
    }
  };

  const continueToReview = () => {
    if (!method || !selectedCenter || !preferredDate.trim()) {
      alert("Please select recycling method, center, and preferred date");
      return;
    }

    if (method === "Schedule Pickup" && !location.trim()) {
      alert("Please enter pickup location");
      return;
    }

    setStep(3);
  };

  const submitRecyclingRequest = async () => {
    setSubmitting(true);

    try {
      await apiFetch("/consumer/recycling-requests", {
        method: "POST",
        body: JSON.stringify({
          passportId: passportId.trim(),
          method,
          selectedCenter,
          preferredDate,
          location,
        }),
      });
      alert("Recycling request submitted successfully");
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to submit recycling request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/55 p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          {/* HEADER */}
          <div className="bg-[#1B5E20] text-white px-5 sm:px-7 py-5 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <CloseOutlinedIcon />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <RecyclingOutlinedIcon />
              </div>

              <div>
                <h2 className="text-2xl sm:text-2xl font-black">
                  Register Recycling
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  Send your verified garment to a circular recovery partner
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <StepBar active={step >= 1} label="Verify" />
              <StepBar active={step >= 2} label="Recycle" />
              <StepBar active={step >= 3} label="Submit" />
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 sm:p-7 overflow-y-auto">
            {step === 1 && (
              <StepVerify
                passportId={passportId}
                setPassportId={setPassportId}
                verifyProduct={verifyProduct}
                simulateQrScan={() => setPassportId("GP-9822")}
                onClose={onClose}
              />
            )}

            {step === 2 && (
              <StepRecycleDetails
                passportId={passportId}
                method={method}
                setMethod={setMethod}
                selectedCenter={selectedCenter}
                setSelectedCenter={setSelectedCenter}
                preferredDate={preferredDate}
                setPreferredDate={setPreferredDate}
                location={location}
                setLocation={setLocation}
                onBack={() => setStep(1)}
                onContinue={continueToReview}
              />
            )}

            {step === 3 && (
              <StepReview
                passportId={passportId}
                method={method}
                selectedCenter={selectedCenter}
                preferredDate={preferredDate}
                location={location}
                verified={verified}
                onBack={() => setStep(2)}
                onSubmit={submitRecyclingRequest}
                submitting={submitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* STEP 1 */

function StepVerify({
  passportId,
  setPassportId,
  verifyProduct,
  simulateQrScan,
  onClose,
}: {
  passportId: string;
  setPassportId: (value: string) => void;
  verifyProduct: () => void;
  simulateQrScan: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-5 flex gap-4">
        <div className="h-11 w-11 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center shrink-0">
          <ShieldOutlinedIcon />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#102A1A]">
            Product Verification Required
          </h3>
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
            Verify the Digital Product Passport before registering recycling.
            This helps the system identify material type, recycling eligibility,
            and credit rewards.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black text-[#102A1A]">
          Product Passport ID <span className="text-[#DC2626]">*</span>
        </label>

        <input
          value={passportId}
          onChange={(e) => setPassportId(e.target.value)}
          placeholder="E.g. GP-9822"
          className="mt-3 w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] px-4 text-lg font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
        />

        <p className="text-xs text-[#94A3B8] font-semibold mt-2">
          Enter the Passport ID from the garment tag or digital product passport.
        </p>
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px bg-[#E5E7EB] flex-1" />
        <span className="text-xs font-black text-[#94A3B8]">OR</span>
        <div className="h-px bg-[#E5E7EB] flex-1" />
      </div>

      <button
        onClick={simulateQrScan}
        className="w-full h-16 rounded-2xl bg-[#EFF6FF] border border-[#2563EB] text-[#2563EB] font-black flex items-center justify-center gap-3 hover:bg-[#DBEAFE] transition"
      >
        <QrCodeScannerOutlinedIcon />
        <div className="text-left">
          <p>Scan Product QR</p>
          <p className="text-xs font-bold opacity-80">
            Auto-fill Passport ID from product tag
          </p>
        </div>
      </button>

      <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-5 space-y-3">
        <FeatureLine text="Material-based recycling guidance" />
        <FeatureLine text="Verified recovery partner matching" />
        <FeatureLine text="Eco credits after successful recycling" />
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="h-12 rounded-xl bg-[#F8FAFC] border border-[#DDE8DF] text-[#102A1A] font-black"
        >
          Cancel
        </button>

        <button
          onClick={verifyProduct}
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2 hover:bg-[#0F3D1E] transition"
        >
          <ShieldOutlinedIcon fontSize="small" />
          Verify Product
        </button>
      </div>
    </div>
  );
}

/* STEP 2 */

function StepRecycleDetails({
  passportId,
  method,
  setMethod,
  selectedCenter,
  setSelectedCenter,
  preferredDate,
  setPreferredDate,
  location,
  setLocation,
  onBack,
  onContinue,
}: {
  passportId: string;
  method: string;
  setMethod: (value: string) => void;
  selectedCenter: string;
  setSelectedCenter: (value: string) => void;
  preferredDate: string;
  setPreferredDate: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl bg-[#E8F5E9] border border-[#1B5E20]/30 p-4 flex items-center gap-3">
        <CheckCircleOutlineOutlinedIcon className="text-[#1B5E20]" />
        <div>
          <p className="font-black text-[#1B5E20]">Product Verified</p>
          <p className="text-sm text-[#64748B]">Passport ID: {passportId}</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">
          Recycling Method <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {recyclingMethods.map((option) => (
            <button
              key={option.label}
              onClick={() => setMethod(option.label)}
              className={`
                w-full rounded-2xl border p-4 text-left transition
                ${
                  method === option.label
                    ? "border-[#1B5E20] bg-[#F1F8F4]"
                    : "border-[#DDE8DF] bg-white hover:bg-[#F8FAFC]"
                }
              `}
            >
              <p className="font-black text-[#102A1A]">{option.label}</p>
              <p className="text-sm text-[#6B7280] mt-1">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {method === "Schedule Pickup" && (
        <div className="mt-6">
          <label className="text-sm font-black">
            Pickup Location <span className="text-[#DC2626]">*</span>
          </label>

          <div className="relative mt-3">
            <LocationOnOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Colombo 03, Sri Lanka"
              className="w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="text-sm font-black">
          Recycling Center <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {recyclingCenters.map((center) => (
            <button
              key={center.name}
              onClick={() => setSelectedCenter(center.name)}
              className={`
                w-full rounded-2xl border p-4 text-left transition
                ${
                  selectedCenter === center.name
                    ? "border-[#1B5E20] bg-[#F1F8F4]"
                    : "border-[#DDE8DF] bg-white hover:bg-[#F8FAFC]"
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-[#102A1A]">{center.name}</p>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {center.location} • {center.distance}
                  </p>
                </div>

                <span className="text-xs font-black text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full">
                  {center.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">
          Preferred Date <span className="text-[#DC2626]">*</span>
        </label>

        <div className="relative mt-3">
          <CalendarMonthOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#FFF8DC] border border-[#F59E0B]/40 p-4">
        <p className="text-sm text-[#92400E] font-bold leading-relaxed">
          Remove personal items and accessories before recycling. The recycling
          partner may reject contaminated or unsafe items.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onBack}
          className="h-12 rounded-xl bg-[#F8FAFC] border border-[#DDE8DF] text-[#102A1A] font-black flex items-center justify-center gap-2"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Back
        </button>

        <button
          onClick={onContinue}
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* STEP 3 */

function StepReview({
  passportId,
  method,
  selectedCenter,
  preferredDate,
  location,
  verified,
  onBack,
  onSubmit,
  submitting,
}: {
  passportId: string;
  method: string;
  selectedCenter: string;
  preferredDate: string;
  location: string;
  verified: boolean;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-black">Review Recycling Request</h3>
        <p className="text-[#6B7280] mt-2">
          Confirm details before registering end-of-life processing.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-[#DDE8DF] overflow-hidden">
        <div className="h-44 bg-[#F8FAFC] flex items-center justify-center">
          <RecyclingOutlinedIcon sx={{ fontSize: 70 }} className="text-[#DDE8DF]" />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-black">Verified Recycling Request</h4>
              <p className="text-sm text-[#94A3B8] font-bold mt-1">
                Passport: {passportId}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full border border-[#1B5E20] text-[#1B5E20] text-xs font-black flex items-center gap-1">
              <VerifiedUserOutlinedIcon fontSize="small" />
              VERIFIED
            </span>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <ReviewRow label="Method" value={method} />
            <ReviewRow label="Center" value={selectedCenter} />
            <ReviewRow label="Preferred Date" value={preferredDate} />
            {location && <ReviewRow label="Pickup Location" value={location} />}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#E8F5E9] border border-[#CFE8D2] p-4">
        <p className="text-sm text-[#1B5E20] font-bold leading-relaxed">
          After successful recycling, the product lifecycle can be closed and eco
          credits can be issued to the Consumer account.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onBack}
          className="h-12 rounded-xl bg-[#F8FAFC] border border-[#DDE8DF] text-[#102A1A] font-black flex items-center justify-center gap-2"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
        >
          <PublishOutlinedIcon fontSize="small" />
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function StepBar({ active, label }: { active: boolean; label: string }) {
  return (
    <div>
      <div className={`h-1 rounded-full ${active ? "bg-white" : "bg-white/25"}`} />
      <p
        className={`text-[10px] uppercase tracking-[0.14em] font-black mt-2 ${
          active ? "text-white" : "text-white/50"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function FeatureLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#64748B] font-semibold">
      <CheckCircleOutlineOutlinedIcon
        fontSize="small"
        className="text-[#1B5E20]"
      />
      {text}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#EEF2F0] pb-2 last:border-b-0">
      <span className="text-[#94A3B8] font-bold">{label}</span>
      <span className="font-black text-right">{value}</span>
    </div>
  );
}
