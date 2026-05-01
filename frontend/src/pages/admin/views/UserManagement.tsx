import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import ReviewModal from "../components/ReviewModal";

/* ================= MAIN ================= */

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [reviewUser, setReviewUser] = useState<any>(null);

  // ADD STATE (THIS IS THE FIX)
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: "REG-001",
      initials: "PN",
      name: "Priya Nair",
      role: "RETAILER",
      email: "priya@flashwd.de",
      org: "FlashForward GmbH • Germany",
      time: "Feb 20, 2026 • 09:58",
      color: "purple",
    },
    {
      id: "REG-004",
      initials: "MÖ",
      name: "Mikael Öberg",
      role: "REPAIR CENTER",
      email: "mikael@textilefix.se",
      org: "TextileFix Stockholm • Sweden",
      time: "Feb 19, 2026 • 11:30",
      color: "orange",
    },
    {
      id: "REG-005",
      initials: "FA",
      name: "Fatima Al-Rashid",
      role: "RECYCLER",
      email: "fatima@greenloop.nl",
      org: "GreenLoop NL • Netherlands",
      time: "Feb 18, 2026 • 16:05",
      color: "green",
    },
  ]);

  // REMOVE FUNCTION (IMPORTANT)
  const handleComplete = (id: string) => {
    setPendingUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">

      {/* ================= PENDING ================= */}
      <div className="bg-[#FFFCF5] border border-[#FDE68A] rounded-2xl px-6 py-5">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-gray-800">
                Pending Registrations
              </p>

              {/* DYNAMIC COUNT */}
              <span className="bg-yellow-200 text-yellow-800 text-[10px] px-2 py-1 rounded-full font-bold">
                {pendingUsers.length} AWAITING REVIEW
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Self-registered accounts requiring admin approval to activate
            </p>
          </div>

          {/* FILTERS (UNCHANGED) */}
          <div className="flex gap-2 text-xs">
            {["ALL", "MANUFACTURER", "LOGISTICS", "RETAILER", "REPAIR CENTER", "RECYCLER"].map((f) => (
              <span
                key={f}
                className={`px-3 py-1 rounded-full border text-[11px] font-medium cursor-pointer ${
                  f === "ALL"
                    ? "bg-black text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <PendingRow
              {...user}
              setReviewUser={setReviewUser}
              onApprove={handleComplete}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-5 text-xs text-gray-500">
          <span>1 approved • 1 rejected this session</span>

          <span className="text-orange-500 font-medium">
            SELF-REGISTRABLE ROLES: MANUFACTURER • LOGISTICS • RETAILER • REPAIR CENTER • RECYCLER
          </span>
        </div>

      </div>

      {/* ================= USER TABLE ================= */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="p-5 flex justify-between items-center border-b bg-gray-50">
          <div>
            <p className="font-semibold text-sm text-gray-800">User Management</p>
            <p className="text-xs text-gray-400">
              Manage all system users and permissions
            </p>
          </div>

          <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm">
            + Provision New User
          </button>
        </div>

        <div className="grid grid-cols-5 px-6 py-3 text-[11px] text-gray-400 font-semibold uppercase">
          <p>Identity ID</p>
          <p>Full Name</p>
          <p>Enterprise Role</p>
          <p>Access Status</p>
          <p></p>
        </div>

        <div className="divide-y">
          <UserRow id="U-001" name="Erik Larsson" role="MANUFACTURER" status="ACTIVE" onSelect={setSelectedUser} />
          <UserRow id="U-002" name="Maria Silva" role="AUDITOR" status="ACTIVE" onSelect={setSelectedUser} />
          <UserRow id="U-003" name="Hans Müller" role="LOGISTICS" status="SUSPENDED" onSelect={setSelectedUser} />
        </div>

      </div>

      {/* MODAL OUTSIDE (FIX) */}
      {reviewUser && (
        <ReviewModal
          user={reviewUser}
          onClose={() => setReviewUser(null)}
          onComplete={handleComplete}
        />
      )}

    </div>
  );
}

/* ================= PENDING ROW ================= */

function PendingRow({ id, initials, name, role, email, org, time, color, setReviewUser, onApprove }: any) {

  const [confirmApprove, setConfirmApprove] = useState(false);

  const roleColors: any = {
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="flex justify-between items-center py-3">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-sm font-bold">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-gray-800">{name}</p>

            <span className={`text-[10px] px-2 py-[2px] rounded-md ${roleColors[color]}`}>
              {role}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {email} • {org}
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 min-w-[340px] justify-end">

        {/* TIME */}
        <div className="text-right text-xs text-gray-400 w-[140px]">
          <p className="uppercase text-[10px]">Submitted</p>
          <p className="text-gray-600 font-medium">{time}</p>
        </div>

        {/* REVIEW */}
        <button
          onClick={() => setReviewUser({ id, name, email, role })}
          className="border px-3 py-1.5 rounded-md text-xs"
        >
          Review
        </button>

        {/* ================= APPROVE FLOW ================= */}

        {!confirmApprove ? (
          <button
            onClick={() => setConfirmApprove(true)}
            className="bg-[#166534] text-white px-3.5 py-1.5 rounded-full text-xs font-medium"
          >
            ✓ Approve
          </button>
        ) : (
          <div className="flex items-center gap-2">

            <button
              onClick={() => onApprove(id)}
              className="bg-[#166534] text-white px-3 py-1.5 rounded-full text-xs"
            >
              Confirm
            </button>

            <button
              onClick={() => setConfirmApprove(false)}
              className="text-xs text-gray-500"
            >
              Cancel
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

/* ================= USER ROW ================= */

function UserRow({ id, name, role, status, onSelect }: any) {
  const user = { id, name, role, status };

  return (
    <div className="grid grid-cols-5 items-center px-6 py-5 hover:bg-gray-50">

      <div>
        <p className="text-xs text-gray-500 font-medium">{id}</p>
        <p className="text-xs text-gray-400 mt-1">Stockholm-MF-01</p>
      </div>

      <div>
        <p className="font-semibold text-sm text-gray-800">{name}</p>
        <p className="text-xs text-gray-400 mt-1">
          {name.toLowerCase().replace(" ", ".")}@loopi.se
        </p>
      </div>

      <div>
        <span className="text-[11px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md font-medium">
          {role}
        </span>
      </div>

      <div>
        <StatusBadge status={status} />
      </div>

      <div className="flex justify-end">
        <SettingsIcon
          onClick={() => onSelect(user)}
          className="text-gray-400 cursor-pointer"
          fontSize="small"
        />
      </div>

    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }: any) {
  const isActive = status === "ACTIVE";

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`} />
      {status}
    </span>
  );
}