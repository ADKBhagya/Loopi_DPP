import { useState } from "react";

/* OUTLINED ICONS */
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

type Props = {
  onClose: () => void;
  initialPassportId?: string;
};

type Step = 1 | 2 | 3;

const issueTypes = [
  {
    label: "Fake Product Suspicion",
    description: "The product may not match the verified LOOPI passport.",
  },
  {
    label: "Incorrect Material Data",
    description: "Material composition or sustainability data looks incorrect.",
  },
  {
    label: "Broken QR Code",
    description: "The QR code cannot be scanned or opens the wrong passport.",
  },
  {
    label: "Wrong Lifecycle Information",
    description: "Manufacturing, shipping, repair, or ownership data seems wrong.",
  },
  {
    label: "Other Product Issue",
    description: "Report another problem related to this product passport.",
  },
];

export default function ReportIssueModal({
  onClose,
  initialPassportId = "",
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [passportId, setPassportId] = useState(initialPassportId);
  const [verified, setVerified] = useState(false);

  const [issueType, setIssueType] = useState("Fake Product Suspicion");
  const [description, setDescription] = useState("");

  const verifyProduct = () => {
    if (!passportId.trim()) {
      alert("Please enter Product Passport ID");
      return;
    }

    setVerified(true);
    setStep(2);
  };

  const continueToReview = () => {
    if (!issueType || !description.trim()) {
      alert("Please select issue type and enter issue description");
      return;
    }

    setStep(3);
  };

  const submitIssue = () => {
    alert("Demo: Product issue report submitted successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/55 p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          {/* HEADER */}
          <div className="bg-[#92400E] text-white px-5 sm:px-7 py-5 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <CloseOutlinedIcon />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <ReportProblemOutlinedIcon />
              </div>

              <div>
                <h2 className="text-2xl sm:text-2xl font-black">
                  Report Product Issue
                </h2>
                <p className="text-white/75 text-sm mt-1">
                  Help protect product passport trust and data quality
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <StepBar active={step >= 1} label="Verify" />
              <StepBar active={step >= 2} label="Issue" />
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
                onClose={onClose}
              />
            )}

            {step === 2 && (
              <StepIssueDetails
                passportId={passportId}
                issueType={issueType}
                setIssueType={setIssueType}
                description={description}
                setDescription={setDescription}
                onBack={() => setStep(1)}
                onContinue={continueToReview}
              />
            )}

            {step === 3 && (
              <StepReview
                passportId={passportId}
                issueType={issueType}
                description={description}
                verified={verified}
                onBack={() => setStep(2)}
                onSubmit={submitIssue}
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
  onClose,
}: {
  passportId: string;
  setPassportId: (value: string) => void;
  verifyProduct: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl bg-[#FFF8DC] border border-[#F59E0B]/40 p-5 flex gap-4">
        <div className="h-11 w-11 rounded-2xl bg-white text-[#92400E] flex items-center justify-center shrink-0">
          <ShieldOutlinedIcon />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#102A1A]">
            Product Verification Required
          </h3>
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
            Enter the product passport ID before reporting an issue. This helps
            LOOPI identify the exact product record and investigate the problem.
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
          className="mt-3 w-full h-14 rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] px-4 text-lg font-bold outline-none focus:ring-2 focus:ring-[#92400E]"
        />

        <p className="text-xs text-[#94A3B8] font-semibold mt-2">
          Use the Passport ID printed on the garment tag or digital passport.
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
        <FeatureLine text="Helps detect fake product records" />
        <FeatureLine text="Improves passport data accuracy" />
        <FeatureLine text="Supports trusted circular fashion data" />
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
          className="h-12 rounded-xl bg-[#92400E] text-white font-black flex items-center justify-center gap-2 hover:bg-[#78350F] transition"
        >
          <ShieldOutlinedIcon fontSize="small" />
          Verify Product
        </button>
      </div>
    </div>
  );
}

/* STEP 2 */

function StepIssueDetails({
  passportId,
  issueType,
  setIssueType,
  description,
  setDescription,
  onBack,
  onContinue,
}: {
  passportId: string;
  issueType: string;
  setIssueType: (value: string) => void;
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
          <p className="font-black text-[#1B5E20]">Product Verified</p>
          <p className="text-sm text-[#64748B]">Passport ID: {passportId}</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">
          Issue Type <span className="text-[#DC2626]">*</span>
        </label>

        <div className="mt-3 space-y-3">
          {issueTypes.map((option) => (
            <button
              key={option.label}
              onClick={() => setIssueType(option.label)}
              className={`
                w-full rounded-2xl border p-4 text-left transition
                ${
                  issueType === option.label
                    ? "border-[#92400E] bg-[#FFF8DC]"
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
          Issue Description <span className="text-[#DC2626]">*</span>
        </label>

        <div className="relative mt-3">
          <DescriptionOutlinedIcon className="absolute left-4 top-4 text-[#94A3B8]" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what is wrong with this product passport, QR code, lifecycle data, or material information."
            rows={5}
            className="w-full rounded-2xl border border-[#DDE8DF] bg-[#F8FAFC] pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#92400E] resize-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-black">Evidence Photos Optional</label>

        <button
          onClick={() => alert("Demo: evidence upload will be connected later")}
          className="mt-3 w-full h-28 rounded-2xl border border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] transition flex flex-col items-center justify-center text-[#64748B]"
        >
          <CameraAltOutlinedIcon />
          <p className="font-black mt-2">Upload Evidence</p>
          <p className="text-xs">Add screenshots, tag photos, or product images</p>
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-[#FFF8DC] border border-[#F59E0B]/40 p-4">
        <p className="text-sm text-[#92400E] font-bold leading-relaxed">
          Reports are reviewed before changes are made to public passport data.
          False reports may be rejected by LOOPI verification reviewers.
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
          className="h-12 rounded-xl bg-[#92400E] text-white font-black hover:bg-[#78350F] transition"
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
  issueType,
  description,
  verified,
  onBack,
  onSubmit,
}: {
  passportId: string;
  issueType: string;
  description: string;
  verified: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-black">Review Issue Report</h3>
        <p className="text-[#6B7280] mt-2">
          Confirm details before submitting the report.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-[#DDE8DF] overflow-hidden">
        <div className="h-44 bg-[#F8FAFC] flex items-center justify-center">
          <ReportProblemOutlinedIcon
            sx={{ fontSize: 70 }}
            className="text-[#DDE8DF]"
          />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-black">Verified Issue Report</h4>
              <p className="text-sm text-[#94A3B8] font-bold mt-1">
                Passport: {passportId}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full border border-[#92400E] text-[#92400E] text-xs font-black flex items-center gap-1">
              <VerifiedUserOutlinedIcon fontSize="small" />
              VERIFIED
            </span>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <ReviewRow label="Issue Type" value={issueType} />
            <ReviewRow label="Description" value={description} />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#FFF8DC] border border-[#F59E0B]/40 p-4">
        <p className="text-sm text-[#92400E] font-bold leading-relaxed">
          This report will be reviewed by LOOPI verification staff before public
          passport data is corrected or flagged.
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
          className="h-12 rounded-xl bg-[#92400E] text-white font-black hover:bg-[#78350F] transition flex items-center justify-center gap-2"
        >
          <PublishOutlinedIcon fontSize="small" />
          Submit Report
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
      <span className="font-black text-right break-words max-w-[65%]">{value}</span>
    </div>
  );
}