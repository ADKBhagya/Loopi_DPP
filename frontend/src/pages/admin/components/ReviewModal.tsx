import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useState } from "react";
import ModalPortal from "../../../components/modals/ModalPortal";

export default function ReviewModal({ user, onClose, onApprove, onReject }: any) {

  const [mode, setMode] = useState<"default" | "approve" | "reject">("default");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setMode("default");
    setReason("");
    setError("");
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">

      <div className="bg-white w-[560px] rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-white">
              <AccessTimeIcon fontSize="small" />
            </div>

            <div>
              <p className="font-semibold text-sm">Review Registration</p>
              <p className="text-xs text-gray-400">
                REG-005 · Submitted {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <CloseIcon onClick={onClose} className="cursor-pointer text-gray-400" />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 max-h-[520px] overflow-y-auto">

          {/* USER CARD */}
          <div className="border rounded-xl p-4 flex gap-4 bg-gray-50">
            <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold">
              {user.name?.charAt(0) || "U"}
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>

              <div className="grid grid-cols-2 mt-3 text-xs text-gray-600">
                <div>
                  <p className="uppercase text-gray-400 text-[10px]">Company</p>
                  <p>{user.org || "—"}</p>
                </div>

                <div>
                  <p className="uppercase text-gray-400 text-[10px]">Country</p>
                  <p>—</p>
                </div>
              </div>
            </div>
          </div>

          {/* NOTE */}
          <div>
            <p className="text-xs text-gray-400 mb-2">APPLICANT NOTE</p>
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-100 text-sm">
              Submitted via self-registration
            </div>
          </div>

          {/* APPROVE MODE */}
          {mode === "approve" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <CheckCircleIcon fontSize="small" /> Confirm Approval
              </p>

              <ul className="text-xs space-y-1 ml-5 list-disc">
                <li>Account will be activated</li>
                <li>User can login immediately</li>
                <li>Permissions will be enabled</li>
              </ul>

              <button onClick={reset} className="text-xs text-gray-500 mt-2">
                ← Change decision
              </button>
            </div>
          )}

          {/* REJECT MODE */}
          {mode === "reject" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">

              <p className="text-red-600 font-semibold flex items-center gap-2 text-sm">
                <CancelIcon fontSize="small" /> Rejection Reason
              </p>

              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">— Select a reason —</option>
                <option>Incomplete documentation</option>
                <option>Invalid company details</option>
                <option>Duplicate account</option>
              </select>

              <textarea
                placeholder="Optional note..."
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm"
              />

              <button onClick={reset} className="text-xs text-gray-500">
                ← Change decision
              </button>
            </div>
          )}

          {/* DEFAULT MODE */}
          {mode === "default" && (
            <div>
              <p className="text-xs text-gray-400 mb-2">ASSIGN NODE ID</p>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <LocationOnOutlinedIcon className="text-gray-400 mr-2" fontSize="small" />
                <input value="AUTO-GENERATED" readOnly className="bg-transparent w-full text-sm outline-none" />
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t">

          <p className="text-xs text-gray-400">USER REVIEW</p>

          <div className="flex items-center gap-3">

            {mode === "default" && (
              <>
                <button
                  onClick={() => setMode("approve")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-300 bg-green-50 text-green-700"
                >
                  <CheckCircleIcon fontSize="small" />
                  Approve
                </button>

                <button
                  onClick={() => setMode("reject")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 bg-red-50 text-red-500"
                >
                  <CancelIcon fontSize="small" />
                  Reject
                </button>
              </>
            )}

            {mode === "approve" && (
              <button
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError("");

                    await onApprove(user.id);

                    onClose();
                  } catch {
                    setError("Failed to approve user");
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl text-white ${
                  loading ? "bg-green-400 cursor-not-allowed" : "bg-green-700"
                }`}
              >
                {loading ? "Processing..." : "Approve & Provision"}
              </button>
            )}

            {mode === "reject" && (
              <button
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError("");

                    await onReject(user.id);

                    onClose();
                  } catch {
                    setError("Failed to reject user");
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl text-white ${
                  loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500"
                }`}
              >
                {loading ? "Processing..." : "Confirm Rejection"}
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
}
