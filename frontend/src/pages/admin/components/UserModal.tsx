import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

export default function UserModal({ user, onClose }: any) {
  const [tab, setTab] = useState("profile");
  const [status, setStatus] = useState(user.status); 
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isActive = status === "ACTIVE";

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[60]">
        <div className="w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <PersonOutlineOutlinedIcon />
              </div>

              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>

                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {user.role}
                  </span>

                  <span
                    className={`text-[10px] px-2 py-1 rounded ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="text-gray-400">
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* TABS */}
          <div className="flex gap-6 px-6 border-b text-sm font-medium text-gray-400">
            {["profile", "access", "activity"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 border-b-2 ${
                  tab === t
                    ? "border-[#1B5E20] text-[#1B5E20]"
                    : "border-transparent"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* BODY */}
          <div className="p-6 max-h-[520px] overflow-y-auto">

            {/* ================= PROFILE ================= */}
            {tab === "profile" && (
            <div className="space-y-5">

                <Input
                label="FULL NAME"
                value={user.name}
                icon={<PersonOutlineOutlinedIcon fontSize="small" />}
                />

                <Input
                label="EMAIL ADDRESS"
                value={user.email}
                icon={<MailOutlineOutlinedIcon fontSize="small" />}
                />

                <div className="grid grid-cols-2 gap-4">
                <Input
                    label="ENTERPRISE ROLE"
                    value={user.role}
                    icon={<BusinessOutlinedIcon fontSize="small" />}
                />

                <Input
                    label="DEPARTMENT"
                    value="Production"
                    icon={<ApartmentOutlinedIcon fontSize="small" />}
                />
                </div>

                <Input
                label="NODE ID"
                value={user.node}
                icon={<LocationOnOutlinedIcon fontSize="small" />}
                />

                <div className="grid grid-cols-2 gap-4">
                <Input
                    label="IDENTITY ID"
                    value={user.id}
                    icon={<FingerprintOutlinedIcon fontSize="small" />}
                />

                <Input
                    label="JOINED"
                    value="Jan 12, 2025"
                    icon={<CalendarTodayOutlinedIcon fontSize="small" />}
                />
                </div>

            </div>
            )}

            {/* ================= ACCESS ================= */}
            {tab === "access" && (
                <div className="space-y-6">

                    {/* STATUS CARD */}
                    <div
                    className={`rounded-xl p-4 flex justify-between items-center border ${
                        isActive
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                    >
                    <div>
                        <p className={`font-semibold ${isActive ? "text-green-700" : "text-red-600"}`}>
                        {isActive ? "Account Active" : "Account Suspended"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                        {isActive
                            ? "Full blockchain write access granted"
                            : "All access suspended — read-only mode"}
                        </p>
                    </div>

                    <button
                        onClick={() => setStatus(isActive ? "SUSPENDED" : "ACTIVE")}
                        className={`px-3 py-1 text-xs rounded-lg font-medium ${
                        isActive
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                        {isActive ? "Suspend" : "Activate"}
                    </button>
                    </div>

                    {/* PERMISSIONS */}
                    <div className="border rounded-xl overflow-hidden">
                    {[
                        "Read DPP Records",
                        "Write DPP Entries",
                        "Mint Garment Passport",
                        "Submit Audit Reports",
                        "Access Node Dashboard",
                        "Export Chain Data",
                    ].map((p, i) => {
                        const disabled =
                        !isActive &&
                        ["Write DPP Entries", "Mint Garment Passport", "Submit Audit Reports", "Export Chain Data"].includes(p);

                        return (
                        <div key={i} className="flex justify-between items-center px-4 py-3 border-b last:border-none text-sm">
                            <span className={disabled ? "text-gray-400" : ""}>{p}</span>

                            {disabled ? (
                            <CancelIcon className="text-gray-300" fontSize="small" />
                            ) : (
                            <CheckCircleIcon className="text-green-500" fontSize="small" />
                            )}
                        </div>
                        );
                    })}
                    </div>

                    {/* DANGER ZONE */}
                    <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold">DANGER ZONE</p>

                    {/* ================= REVOKE ================= */}
                    {!confirmRevoke ? (
                        <div
                        onClick={() => {
                        setConfirmRevoke(true);
                        setConfirmDelete(false); 
                        }}
                        className="border rounded-xl p-4 flex items-center gap-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        >
                        <KeyOutlinedIcon className="text-yellow-500" />
                        <div>
                            <p className="text-sm font-medium">Revoke Cryptographic Keys</p>
                            <p className="text-xs text-gray-400">
                            Force re-authentication with new key pair
                            </p>
                        </div>
                        </div>
                    ) : (
                        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                        <p className="text-sm text-red-600 font-medium mb-2">
                            Revoke cryptographic keys for {user.name}?
                        </p>

                        <div className="flex gap-2">
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                            Confirm Revoke
                            </button>

                            <button
                            onClick={() => setConfirmRevoke(false)}
                            className="text-xs text-gray-500"
                            >
                            Cancel
                            </button>
                        </div>
                        </div>
                    )}

                    {/* ================= DELETE ================= */}
                    {!confirmDelete ? (
                        <div
                        onClick={() => {
                        setConfirmDelete(true);
                        setConfirmRevoke(false); 
                        }}
                        className="border rounded-xl p-4 flex items-center gap-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        >
                        <DeleteOutlineOutlinedIcon className="text-red-500" />
                        <div>
                            <p className="text-sm font-medium">Delete User Account</p>
                            <p className="text-xs text-gray-400">
                            Permanently remove from the system
                            </p>
                        </div>
                        </div>
                    ) : (
                        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                        <p className="text-sm text-red-600 font-medium mb-2">
                            Permanently delete {user.name}? This cannot be undone.
                        </p>

                        <div className="flex gap-2">
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                            Confirm Delete
                            </button>

                            <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-xs text-gray-500"
                            >
                            Cancel
                            </button>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                )}

            {/* ================= ACTIVITY ================= */}
            {tab === "activity" && (
                <div className="space-y-6">

                    {/* LAST LOGIN */}
                    <div className="bg-gray-50 border rounded-xl p-4">
                    <p className="text-xs text-gray-400">LAST LOGIN</p>
                    <p className="font-semibold">Feb 21, 2026 · 09:14</p>
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold">RECENT ACTIVITY</p>

                    {[
                        { text: "DPP Record Updated", color: "text-green-500" },
                        { text: "Blockchain TX Signed", color: "text-blue-500" },
                        { text: "Certificate Uploaded", color: "text-yellow-500" },
                        { text: "Report Exported", color: "text-gray-400" },
                        { text: "Password Changed", color: "text-red-500" },
                    ].map((a, i) => (
                        <div key={i} className="flex justify-between items-center border rounded-xl px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                            <FiberManualRecordIcon className={`${a.color}`} fontSize="small" />
                            {a.text}
                        </div>

                        <span className="text-xs text-gray-400">{i + 1}h ago</span>
                        </div>
                    ))}
                    </div>

                    {/* SESSIONS */}
                    <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold">SESSIONS</p>

                    <div className="flex justify-between items-center border rounded-xl px-4 py-3 text-sm">
                        <div>
                        <p>Chrome · Stockholm, SE</p>
                        <p className="text-xs text-green-500">Active now</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border rounded-xl px-4 py-3 text-sm">
                        <div>
                        <p>Safari · Gothenburg, SE</p>
                        <p className="text-xs text-gray-400">3 days ago</p>
                        </div>

                        <button className="text-red-500 text-xs">Terminate</button>
                    </div>
                    </div>
                </div>
                )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <span className="text-xs text-gray-400">ID: {user.id}</span>

            <div className="flex gap-4">
              <button onClick={onClose} className="text-sm text-gray-500">
                Cancel
              </button>

              <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* INPUT */
function Input({ label, value, icon }: any) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 font-bold mb-1">{label}</p>

      <div className="flex items-center h-10 border rounded-lg bg-gray-50 px-3">
        <div className="text-gray-300 mr-2 flex items-center">
          {icon}
        </div>

        <input
          value={value}
          readOnly
          className="bg-transparent outline-none text-sm w-full text-gray-700"
        />
      </div>
    </div>
  );
}