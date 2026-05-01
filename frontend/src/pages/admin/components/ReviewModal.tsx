import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useState } from "react";

export default function ReviewModal({ user, onClose, onComplete }: any){

  const [mode, setMode] = useState<"default" | "approve" | "reject">("default");
  const [reason, setReason] = useState("");

  const reset = () => {
    setMode("default");
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

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
                REG-005 · Submitted Feb 18, 2026 · 16:05
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
              FA
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
                  <p>GreenLoop NL</p>
                  <p className="uppercase text-gray-400 text-[10px] mt-2">VAT / TAX NO.</p>
                  <p>NL864321987B01</p>
                </div>

                <div>
                  <p className="uppercase text-gray-400 text-[10px]">Country</p>
                  <p>Netherlands</p>
                </div>
              </div>
            </div>
          </div>

          {/* NOTE */}
          <div>
            <p className="text-xs text-gray-400 mb-2">APPLICANT NOTE</p>
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-100 text-sm">
              Industrial textile recycler, ISO 14001 certified.
            </div>
          </div>

          {/* ================= APPROVE MODE ================= */}
          {mode === "approve" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <CheckCircleIcon fontSize="small" /> Confirm Approval
              </p>

              <ul className="text-xs space-y-1 ml-5 list-disc">
                <li>Blockchain identity provisioned under node NET-RE-20</li>
                <li>Welcome email sent</li>
                <li>Permissions activated</li>
                <li>Audit log created</li>
              </ul>

              <button onClick={reset} className="text-xs text-gray-500 mt-2">
                ← Change decision
              </button>
            </div>
          )}

          {/* ================= REJECT MODE ================= */}
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
                <option>Incomplete documentation submitted</option>
                <option>VAT / company registration could not be verified</option>
                <option>Role not applicable</option>
                <option>Duplicate account detected</option>
              </select>

              <textarea
                placeholder="Add any additional context..."
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm"
              />

              <button onClick={reset} className="text-xs text-gray-500">
                ← Change decision
              </button>
            </div>
          )}

          {/* ================= DEFAULT MODE ================= */}
          {mode === "default" && (
            <div>
              <p className="text-xs text-gray-400 mb-2">ASSIGN NODE ID</p>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <LocationOnOutlinedIcon className="text-gray-400 mr-2" fontSize="small" />
                <input value="NET-RE-20" readOnly className="bg-transparent w-full text-sm outline-none" />
              </div>

              <p className="text-[10px] text-gray-400 mt-1">
                Auto-generated — edit if needed before approving.
              </p>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t">

          <p className="text-xs text-gray-400">REG-005</p>

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
                onClick={() => {
                    onComplete(user.id); 
                    onClose();          
                }}
                className="bg-green-700 text-white px-5 py-2 rounded-xl"
                >
                Approve & Provision
                </button>
            )}

            {mode === "reject" && (
              <button
                onClick={() => {
                    onComplete(user.id); 
                    onClose();
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-xl"
                >
                Confirm Rejection
                </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}