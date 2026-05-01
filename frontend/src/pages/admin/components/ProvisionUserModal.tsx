import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

export default function ProvisionUserModal({ onClose }: any) {
  const [status, setStatus] = useState("ACTIVE");

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[60]">
        <div className="w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-start px-6 py-5 border-b">

            <div className="flex items-start gap-3">
              {/* ICON */}
              <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <PersonAddAltOutlinedIcon fontSize="small" />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-800">
                  Provision New System User
                </p>
                <p className="text-xs text-gray-400">
                  Admin-controlled role assignment
                </p>
              </div>
            </div>

            <button className="text-gray-400" onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-5 space-y-5">

            {/* WARNING */}
            <div className="flex items-start gap-2 border border-red-200 bg-red-50 text-red-500 text-xs p-4 rounded-xl">
              <LockOutlinedIcon fontSize="small" />
              <p>
                Restricted — Admin Only. Direct Manufacturer, Logistics,
                Retailer, Repair Center, or Recycler to self-registration.
              </p>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-2 gap-4">

              {/* FULL NAME */}
              <div>
                <label className="text-[11px] text-gray-400 font-bold">
                  FULL NAME *
                </label>
                <div className="flex items-center border rounded-lg px-3 h-10 bg-gray-50">
                  <PersonOutlineOutlinedIcon className="text-gray-300 mr-2" fontSize="small" />
                  <input
                    placeholder="John Doe"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-[11px] text-gray-400 font-bold">
                  EMAIL *
                </label>
                <div className="flex items-center border rounded-lg px-3 h-10 bg-gray-50">
                  <MailOutlineOutlinedIcon className="text-gray-300 mr-2" fontSize="small" />
                  <input
                    placeholder="john@co.com"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="text-[11px] text-gray-400 font-bold">
                  ENTERPRISE ROLE
                </label>
                <select className="w-full h-10 border rounded-lg px-3 text-sm bg-gray-50">
                  <option>Auditor</option>
                  <option>Manufacturer</option>
                  <option>Logistics</option>
                </select>
              </div>

              {/* NODE (DISABLED STYLE) */}
              <div>
                <label className="text-[11px] text-gray-400 font-bold">
                  DEPT / NODE ID
                </label>
                <div className="flex items-center border rounded-lg px-3 h-10 bg-gray-100 text-gray-400">
                  <LockOutlinedIcon className="mr-2" fontSize="small" />
                  Stockholm-AU-01
                </div>
              </div>

            </div>

            {/* STATUS CARD */}
            <div className="border rounded-xl p-4 bg-gray-50">

              <p className="text-sm font-semibold text-gray-700">
                Account Access Status
              </p>

              <p className="text-xs text-gray-400 mb-3">
                Blockchain write permissions
              </p>

              {/* TOGGLE */}
              <div className="flex items-center gap-2 mb-3">

                {/* ACTIVE */}
                <button
                    onClick={() => setStatus("ACTIVE")}
                    className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 ${
                    status === "ACTIVE"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                    ✓ Active
                </button>

                {/* SUSPENDED */}
                <button
                    onClick={() => setStatus("SUSPENDED")}
                    className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 ${
                    status === "SUSPENDED"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                    ✕ Suspended
                </button>

                </div>

              {/* INFO */}
              <div className="flex items-start gap-2 text-xs text-blue-600">
                <InfoOutlinedIcon fontSize="small" />
                <p>
                  New user receives a secure one-time blockchain key pair
                  generation link. This action is logged in the audit trail.
                </p>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-4 border-t">

            <span className="text-xs text-orange-500 font-medium">
              Consumes 1 Gas Credit
            </span>

            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>

              <button className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow">
                Save & Provision
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}