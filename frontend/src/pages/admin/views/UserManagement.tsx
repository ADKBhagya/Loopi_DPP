import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState } from "react";

// Local fallback UserModal in case the external file isn't a module/exported correctly.
function UserModal({ user, onClose }: any) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">User Details</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="text-sm text-gray-700 space-y-2">
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Status:</strong> {user.status}</div>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="space-y-6">

      {/* ================= PENDING ================= */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mt-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                Pending Registrations
              </span>

              <span className="bg-yellow-200 text-yellow-800 text-[10px] px-2 py-1 rounded-full font-bold">
                3 AWAITING REVIEW
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Self-registered accounts requiring admin approval to activate
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 text-xs">
            {["ALL", "MANUFACTURER", "LOGISTICS", "RETAILER", "REPAIR CENTER", "RECYCLER"].map((f, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full border cursor-pointer ${
                  f === "ALL"
                    ? "bg-black text-white"
                    : "bg-white text-gray-500"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          <PendingRow
            initials="PN"
            name="Priya Nair"
            role="RETAILER"
            email="priya@flashwd.de"
            org="FlashForward GmbH • Germany"
            time="Feb 20, 2026 • 09:58"
            roleColor="purple"
          />

          <PendingRow
            initials="MÖ"
            name="Mikael Öberg"
            role="REPAIR CENTER"
            email="mikael@textilefix.se"
            org="TextileFix Stockholm • Sweden"
            time="Feb 19, 2026 • 11:30"
            roleColor="orange"
          />

          <PendingRow
            initials="FA"
            name="Fatima Al-Rashid"
            role="RECYCLER"
            email="fatima@greenloop.nl"
            org="GreenLoop NL • Netherlands"
            time="Feb 18, 2026 • 16:05"
            roleColor="green"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>1 approved • 1 rejected this session</span>
          <span className="text-orange-500">
            SELF-REGISTRABLE ROLES: MANUFACTURER • LOGISTICS • RETAILER • REPAIR CENTER • RECYCLER
          </span>
        </div>

      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-white rounded-xl border shadow-sm">

        <div className="p-5 flex justify-between items-center border-b">
          <div>
            <p className="font-semibold text-sm">User Management</p>
            <p className="text-xs text-gray-400">
              Manage all system users and permissions
            </p>
          </div>

          <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm">
            Add New User
          </button>
        </div>

        <div className="p-5 space-y-4">
          <UserRow id="U-001" name="Erik Larsson" role="MANUFACTURER" status="ACTIVE" onSelect={setSelectedUser} />
          <UserRow id="U-002" name="Maria Silva" role="AUDITOR" status="ACTIVE" onSelect={setSelectedUser} />
          <UserRow id="U-003" name="Hans Müller" role="LOGISTICS" status="SUSPENDED" onSelect={setSelectedUser} />
        </div>

      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

    </div>
  );
}

/* ================= PENDING ROW ================= */

function PendingRow({ initials, name, role, email, org, time, roleColor }: any) {
  const roleColors: any = {
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="flex justify-between items-center border-t pt-4">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{name}</p>

            <span className={`text-[10px] px-2 py-1 rounded ${roleColors[roleColor]}`}>
              {role}
            </span>
          </div>

          <p className="text-xs text-gray-500">{email} • {org}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-xs text-gray-500">

        <div className="text-right">
          <p className="text-[10px] uppercase">Submitted</p>
          <p>{time}</p>
        </div>

        <button className="border px-3 py-1 rounded text-xs">
          Review
        </button>

        <button className="bg-green-700 text-white px-3 py-1 rounded text-xs">
          ✓ Approve
        </button>

        <CancelIcon className="text-red-500 cursor-pointer" fontSize="small" />

      </div>
    </div>
  );
}

/* ================= USER ROW ================= */

function UserRow({ id, name, role, status, onSelect }: any) {
  const user = { id, name, role, status };

  return (
    <div className="flex justify-between items-center border-t pt-4">

      <div>
        <p className="text-xs text-gray-400">{id}</p>
        <p className="font-semibold text-sm">{name}</p>
      </div>

      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
        {role}
      </span>

      <StatusBadge status={status} />

      <SettingsIcon
        onClick={() => onSelect(user)}
        className="text-gray-400 cursor-pointer"
      />
    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }: any) {
  if (status === "ACTIVE") {
    return (
      <span className="flex items-center gap-1 text-green-600 text-xs">
        <CheckCircleIcon fontSize="small" /> ACTIVE
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-red-500 text-xs">
      <CancelIcon fontSize="small" /> SUSPENDED
    </span>
  );
}