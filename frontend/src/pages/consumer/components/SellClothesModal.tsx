import { useState } from "react";

/* OUTLINED ICONS */
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

type Props = {
  onClose: () => void;
  initialPassportId?: string;
};

type Step = 1 | 2 | 3;

const conditionOptions = [
  {
    label: "New with Tags",
    description: "Never worn, original tags attached",
  },
  {
    label: "Excellent",
    description: "Like new, worn once or twice",
  },
  {
    label: "Very Good",
    description: "Gently used, no visible wear",
  },
  {
    label: "Good",
    description: "Used with minor signs of wear",
  },
  {
    label: "Fair",
    description: "Well-worn but still functional",
  },
];

export default function SellClothesModal({
  onClose,
  initialPassportId = "",
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [passportId, setPassportId] = useState(initialPassportId);
  const [verified, setVerified] = useState(false);

  const [condition, setCondition] = useState("Excellent");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const verifyOwnership = () => {
    if (!passportId.trim()) {
      alert("Please enter Product Passport ID");
      return;
    }

    setVerified(true);
    setStep(2);
  };

  const continueToReview = () => {
    if (!condition || !price.trim() || !location.trim()) {
      alert("Please complete condition, price, and location");
      return;
    }

    setStep(3);
  };

  const publishListing = () => {
    alert("Demo: Listing published successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
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
                <LocalOfferOutlinedIcon />
              </div>

              <div>
                <h2 className="text-2xl sm:text-2xl font-black">
                  Sell My Clothes
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  List your verified garment for resale
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <StepBar active={step >= 1} label="Verify" />
              <StepBar active={step >= 2} label="Details" />
              <StepBar active={step >= 3} label="Publish" />
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 sm:p-7 overflow-y-auto">
            {step === 1 && (
              <StepVerify
                passportId={passportId}
                setPassportId={setPassportId}
                verifyOwnership={verifyOwnership}
                onClose={onClose}
              />
            )}

            {step === 2 && (
              <StepDetails
                passportId={passportId}
                condition={condition}
                setCondition={setCondition}
                price={price}
                setPrice={setPrice}
                location={location}
                setLocation={setLocation}
                description={description}
                setDescription={setDescription}
                onBack={() => setStep(1)}
                onContinue={continueToReview}
              />
            )}

            {step === 3 && (
              <StepReview
                passportId={passportId}
                condition={condition}
                price={price}
                location={location}
                description={description}
                onBack={() => setStep(2)}
                onPublish={publishListing}
                verified={verified}
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
  verifyOwnership,
  onClose,
}: {
  passportId: string;
  setPassportId: (value: string) => void;
  verifyOwnership: () => void;
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
            Ownership Verification Required
          </h3>
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
            To prevent fraud, verify product ownership using the Digital Product
            Passport ID. This confirms that the garment is linked to a valid
            LOOPI passport record.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black text-[#102A1A]">
          Enter Product Passport ID <span className="text-[#DC2626]">*</span>
        </label>

        <input
          value={passportId}
          onChange={(e) => setPassportId(e.target.value)}
          placeholder="E.g. GP-9822"
          className="mt-3 w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] px-4 text-lg font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
        />

        <p className="text-xs text-[#94A3B8] font-semibold mt-2">
          Find the Passport ID on your product care label or digital passport.
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
          <p>Scan QR Code</p>
          <p className="text-xs font-bold opacity-80">
            Auto-fill Passport ID from product tag
          </p>
        </div>
      </button>

      <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-5 space-y-3">
        <FeatureLine text="Blockchain ownership verification" />
        <FeatureLine text="Authenticity guarantee for buyers" />
        <FeatureLine text="Automatic product details population" />
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="h-12 rounded-xl bg-[#F8FAFC] border border-[#DDE8DF] text-[#102A1A] font-black"
        >
          Cancel
        </button>

        <button
          onClick={verifyOwnership}
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2 hover:bg-[#0F3D1E] transition"
        >
          <ShieldOutlinedIcon fontSize="small" />
          Verify Ownership
        </button>
      </div>
    </div>
  );
}

/* STEP 2 */

function StepDetails({
  passportId,
  condition,
  setCondition,
  price,
  setPrice,
  location,
  setLocation,
  description,
  setDescription,
  onBack,
  onContinue,
}: {
  passportId: string;
  condition: string;
  setCondition: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl bg-[#E8F5E9] border border-[#1B5E20]/30 p-4 flex items-center gap-3">
        <CheckCircleOutlineOutlinedIcon className="text-[#1B5E20]" />
        <div>
          <p className="font-black text-[#1B5E20]">Ownership Verified</p>
          <p className="text-sm text-[#64748B]">Passport ID: {passportId}</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">
          Item Condition <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {conditionOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setCondition(option.label)}
              className={`
                w-full rounded-2xl border p-4 text-left transition
                ${
                  condition === option.label
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
          Asking Price <span className="text-[#DC2626]">*</span>
        </label>

        <div className="relative mt-3">
          <EuroOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            type="number"
            className="w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] pl-12 pr-4 text-lg font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
          />
        </div>

        <p className="text-xs text-[#94A3B8] font-semibold mt-2">
          Set a fair price based on condition and market value.
        </p>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">
          Location <span className="text-[#DC2626]">*</span>
        </label>

        <div className="relative mt-3">
          <LocationOnOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Colombo, Sri Lanka"
            className="w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">Description Optional</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add item details, reason for selling, care condition, etc."
          rows={4}
          className="mt-3 w-full rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] p-4 outline-none focus:ring-2 focus:ring-[#1B5E20] resize-none"
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">Photos Optional</label>

        <button
          onClick={() => alert("Demo: photo upload will be connected later")}
          className="mt-3 w-full h-28 rounded-2xl border border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] transition flex flex-col items-center justify-center text-[#64748B]"
        >
          <CameraAltOutlinedIcon />
          <p className="font-black mt-2">Upload Photos</p>
          <p className="text-xs">Add up to 5 photos of your item</p>
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
  condition,
  price,
  location,
  description,
  onBack,
  onPublish,
  verified,
}: {
  passportId: string;
  condition: string;
  price: string;
  location: string;
  description: string;
  onBack: () => void;
  onPublish: () => void;
  verified: boolean;
}) {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-black">Review Your Listing</h3>
        <p className="text-[#6B7280] mt-2">
          Check all details before publishing.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-[#DDE8DF] overflow-hidden">
        <div className="h-44 bg-[#F8FAFC] flex items-center justify-center">
          <Inventory2OutlinedIcon sx={{ fontSize: 70 }} className="text-[#DDE8DF]" />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-black">Verified LOOPI Item</h4>
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
            <ReviewRow label="Condition" value={condition} />
            <ReviewRow label="Location" value={location} />
            <ReviewRow label="Price" value={`€ ${price}`} />
          </div>

          {description && (
            <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8] font-black">
                Description
              </p>
              <p className="text-sm text-[#475569] mt-2">{description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#FFF8DC] border border-[#F59E0B]/40 p-4">
        <p className="text-sm text-[#92400E] font-bold leading-relaxed">
          Note: By publishing this listing, your verified ownership and product
          authenticity will be displayed to potential buyers.
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
          onClick={onPublish}
          className="h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition flex items-center justify-center gap-2"
        >
          <PublishOutlinedIcon fontSize="small" />
          Publish Listing
        </button>
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function StepBar({ active, label }: { active: boolean; label: string }) {
  return (
    <div>
      <div
        className={`h-1 rounded-full ${
          active ? "bg-white" : "bg-white/25"
        }`}
      />
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