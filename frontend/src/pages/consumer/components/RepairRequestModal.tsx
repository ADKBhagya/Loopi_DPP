import { useState } from "react";

/* OUTLINED ICONS */
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

type PendingConsumerAction = "sell" | "repair" | "recycle" | "report";

type Props = {
  onClose: () => void;
  initialPassportId?: string;
};

type Step = 1 | 2 | 3;

const repairTypes = [
  {
    label: "Stitching Repair",
    description: "Fix torn seams, loose stitching, or small fabric damage",
  },
  {
    label: "Zip / Button Repair",
    description: "Repair or replace broken zips, buttons, and closures",
  },
  {
    label: "Fabric Patching",
    description: "Patch damaged areas using compatible circular materials",
  },
  {
    label: "Color Restoration",
    description: "Refresh faded areas using fabric-safe restoration methods",
  },
  {
    label: "General Clothing Repair",
    description: "Let the repair partner inspect and suggest the best option",
  },
];

const repairCenters = [
  {
    name: "Green Stitch Repair Hub",
    location: "Colombo 03",
    distance: "2.4 km",
    rating: "4.8",
  },
  {
    name: "Circular Textile Care",
    location: "Nugegoda",
    distance: "4.1 km",
    rating: "4.6",
  },
  {
    name: "EcoWear Repair Point",
    location: "Rajagiriya",
    distance: "5.8 km",
    rating: "4.7",
  },
];

export default function RepairRequestModal({
  onClose,
  initialPassportId = "",
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [passportId, setPassportId] = useState(initialPassportId);
  const [verified, setVerified] = useState(false);

  const [repairType, setRepairType] = useState("Stitching Repair");
  const [selectedCenter, setSelectedCenter] = useState("Green Stitch Repair Hub");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  const verifyPassport = () => {
    if (!passportId.trim()) {
      alert("Please enter Product Passport ID");
      return;
    }

    setVerified(true);
    setStep(2);
  };

  const continueToReview = () => {
    if (!repairType || !selectedCenter || !preferredDate.trim()) {
      alert("Please select repair type, repair center, and preferred date");
      return;
    }

    setStep(3);
  };

  const submitRepairRequest = () => {
    alert("Demo: Repair request submitted successfully");
    onClose();
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
                <BuildOutlinedIcon />
              </div>

              <div>
                <h2 className="text-2xl sm:text-2xl font-black">
                  Request Repair
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  Book a verified circular repair partner
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <StepBar active={step >= 1} label="Verify" />
              <StepBar active={step >= 2} label="Repair" />
              <StepBar active={step >= 3} label="Submit" />
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 sm:p-7 overflow-y-auto">
            {step === 1 && (
              <StepVerify
                passportId={passportId}
                setPassportId={setPassportId}
                verifyPassport={verifyPassport}
                onClose={onClose}
              />
            )}

            {step === 2 && (
              <StepRepairDetails
                passportId={passportId}
                repairType={repairType}
                setRepairType={setRepairType}
                selectedCenter={selectedCenter}
                setSelectedCenter={setSelectedCenter}
                preferredDate={preferredDate}
                setPreferredDate={setPreferredDate}
                notes={notes}
                setNotes={setNotes}
                onBack={() => setStep(1)}
                onContinue={continueToReview}
              />
            )}

            {step === 3 && (
              <StepReview
                passportId={passportId}
                repairType={repairType}
                selectedCenter={selectedCenter}
                preferredDate={preferredDate}
                notes={notes}
                verified={verified}
                onBack={() => setStep(2)}
                onSubmit={submitRepairRequest}
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
  verifyPassport,
  onClose,
}: {
  passportId: string;
  setPassportId: (value: string) => void;
  verifyPassport: () => void;
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
            Verify the Digital Product Passport before requesting repair. This
            helps the repair center understand product material, care rules, and
            repair eligibility.
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
          Enter the Passport ID printed on the garment tag or digital passport.
        </p>
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px bg-[#E5E7EB] flex-1" />
        <span className="text-xs font-black text-[#94A3B8]">OR</span>
        <div className="h-px bg-[#E5E7EB] flex-1" />
      </div>

      <button
        onClick={() => alert("Demo: QR scan will be connected later")}
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
        <FeatureLine text="Material-aware repair guidance" />
        <FeatureLine text="Verified partner matching" />
        <FeatureLine text="Repair history added to lifecycle record" />
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="h-12 rounded-xl bg-[#F8FAFC] border border-[#DDE8DF] text-[#102A1A] font-black"
        >
          Cancel
        </button>

        <button
          onClick={verifyPassport}
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

function StepRepairDetails({
  passportId,
  repairType,
  setRepairType,
  selectedCenter,
  setSelectedCenter,
  preferredDate,
  setPreferredDate,
  notes,
  setNotes,
  onBack,
  onContinue,
}: {
  passportId: string;
  repairType: string;
  setRepairType: (value: string) => void;
  selectedCenter: string;
  setSelectedCenter: (value: string) => void;
  preferredDate: string;
  setPreferredDate: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
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
          Repair Type <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {repairTypes.map((option) => (
            <button
              key={option.label}
              onClick={() => setRepairType(option.label)}
              className={`
                w-full rounded-2xl border p-4 text-left transition
                ${
                  repairType === option.label
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

      <div className="mt-6">
        <label className="text-sm font-black">
          Repair Center <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {repairCenters.map((center) => (
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

                <span className="text-sm font-black text-[#F59E0B]">
                  ★ {center.rating}
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

      <div className="mt-6">
        <label className="text-sm font-black">Damage Notes Optional</label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the damage, preferred repair outcome, or special care notes."
          rows={4}
          className="mt-3 w-full rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] p-4 outline-none focus:ring-2 focus:ring-[#1B5E20] resize-none"
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">Damage Photos Optional</label>

        <button
          onClick={() => alert("Demo: photo upload will be connected later")}
          className="mt-3 w-full h-28 rounded-2xl border border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] transition flex flex-col items-center justify-center text-[#64748B]"
        >
          <CameraAltOutlinedIcon />
          <p className="font-black mt-2">Upload Photos</p>
          <p className="text-xs">Add photos to help the repair center inspect damage</p>
        </button>
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
  repairType,
  selectedCenter,
  preferredDate,
  notes,
  verified,
  onBack,
  onSubmit,
}: {
  passportId: string;
  repairType: string;
  selectedCenter: string;
  preferredDate: string;
  notes: string;
  verified: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-black">Review Repair Request</h3>
        <p className="text-[#6B7280] mt-2">
          Confirm details before sending to the repair center.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-[#DDE8DF] overflow-hidden">
        <div className="h-44 bg-[#F8FAFC] flex items-center justify-center">
          <BuildOutlinedIcon sx={{ fontSize: 70 }} className="text-[#DDE8DF]" />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-black">Verified Repair Request</h4>
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
            <ReviewRow label="Repair Type" value={repairType} />
            <ReviewRow label="Repair Center" value={selectedCenter} />
            <ReviewRow label="Preferred Date" value={preferredDate} />
          </div>

          {notes && (
            <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8] font-black">
                Notes
              </p>
              <p className="text-sm text-[#475569] mt-2">{notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#E8F5E9] border border-[#CFE8D2] p-4">
        <p className="text-sm text-[#1B5E20] font-bold leading-relaxed">
          This repair request will help extend the garment lifecycle and can be
          added to the product passport history after service completion.
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
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
        >
          <PublishOutlinedIcon fontSize="small" />
          Submit Request
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