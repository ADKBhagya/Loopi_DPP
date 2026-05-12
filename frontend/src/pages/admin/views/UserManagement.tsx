import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useEffect, type ReactElement } from "react";
import ReviewModal from "../components/ReviewModal";
import UserModal from "../components/UserModal";
import ProvisionUserModal from "../components/ProvisionUserModal";
import ModalPortal from "../../../components/modals/ModalPortal";

const ProvisionUserModalComponent =
  ProvisionUserModal as unknown as (props: any) => ReactElement;

/* ================= MAIN ================= */

export default function UserManagement({ setPendingCount }: any = {}){
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [reviewUser, setReviewUser] = useState<any>(null);
  const [approveUser, setApproveUser] = useState<any>(null);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const token = localStorage.getItem("token");
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const [filterRole, setFilterRole] = useState("ALL");
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);

// session counters
const [approvedCount, setApprovedCount] = useState(0);
const [rejectedCount, setRejectedCount] = useState(0);

const filteredUsers = users.filter((u) => {
  if (filterRole === "ALL") return true;
  return u.role.toUpperCase() === filterRole;
});

const pendingUsers = filteredUsers.map((u) => ({
  id: u._id,
  name: u.fullName,
  email: u.email,
  org: u.organization,
  role: u.role,
  initials: u.fullName?.charAt(0) || "U",
  time: new Date(u.createdAt).toLocaleDateString(),
  color: "green",
}));


useEffect(() => {
  if (!token) return;

  fetch(`https://loopidpp.online/api/admin/approved-users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => setApprovedUsers(data));
}, [token]);

  // ================= FETCH USERS =================
  const fetchUsers = () => {
    fetch(`https://loopidpp.online/api/admin/pending-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setPendingCount?.(data.length); // update sidebar when parent provides it
      })
      .catch((err) => console.error(err));
  };

    // ================= APPROVE =================
const handleApprove = async (id: string) => {
  try {
    await fetch(`https://loopidpp.online/api/admin/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setApprovedCount(prev => prev + 1); 

    setToast({ type: "success", message: "User approved successfully" });

    fetchUsers();
  } catch {
    setToast({ type: "error", message: "Approval failed" });
  }
};

  // ================= REJECT =================
const handleReject = async (id: string) => {
  try {
    await fetch(`https://loopidpp.online/api/admin/reject/${id}`, {
      method: "PUT", // 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRejectedCount(prev => prev + 1);

    setToast({ type: "error", message: "User rejected" });

    fetchUsers();
  } catch {
    setToast({ type: "error", message: "Rejection failed" });
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }
}, [toast]);

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
              onClick={() => setFilterRole(f)} 
              className={`px-3 py-1 rounded-full border text-[11px] font-medium cursor-pointer ${
                filterRole === f
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
              key={user.id}
              {...user}
              setReviewUser={setReviewUser}
              setApproveUser={setApproveUser}
              onApprove={handleApprove}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-5 text-xs text-gray-500">
          <span>
            {approvedCount} approved • {rejectedCount} rejected this session
          </span>

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

          <button
            onClick={() => setShowProvisionModal(true)}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm"
          >
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
        {approvedUsers.map((user) => (
          <UserRow
            key={user._id}
            id={user._id}
            name={user.fullName}
            role={user.role}
            status={user.status === "approved" ? "ACTIVE" : "REJECTED"}
            onSelect={setSelectedUser}
          />
        ))}
      </div>

      </div>

      {/* MODAL OUTSIDE (FIX) */}
      {reviewUser && (
        <ReviewModal
          user={reviewUser}
          onClose={() => setReviewUser(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {approveUser && (
        <ApproveConfirmModal
          user={approveUser}
          onClose={() => setApproveUser(null)}
          onConfirm={() => {
            handleApprove(approveUser.id);
            setApproveUser(null);
          }}
        />
      )}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

    {showProvisionModal && (
      <ProvisionUserModalComponent
        onClose={() => setShowProvisionModal(false)}
        setToast={setToast} 
      />
    )}

     {toast && (
        <div className={`fixed top-20 right-6 px-5 py-3 rounded-xl shadow-lg ${
          toast.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}

/* ================= PENDING ROW ================= */

function PendingRow({
  id,
  initials,
  name,
  role,
  email,
  org,
  time,
  color,
  setReviewUser,
  setApproveUser,
  onApprove,
}: any) {

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
            onClick={() => setApproveUser({ id, name, email, role })}
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

  if (status === "ACTIVE") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
        ACTIVE
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">
        REJECTED
      </span>
    );
  }

  return null;
}

function ApproveConfirmModal({ user, onClose, onConfirm }: any) {
  return (
    <ModalPortal>
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
      />

      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <p className="text-sm font-semibold text-gray-800">
              Confirm Approval
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Approve this registration and activate account access
            </p>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-gray-700">
              Are you sure you want to approve{" "}
              <span className="font-semibold">{user.name}</span>?
            </p>

            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3">
              This will provision blockchain identity, activate permissions, and remove the request from pending registrations.
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm rounded-lg bg-[#166534] text-white font-semibold hover:bg-[#14532d]"
            >
              Confirm Approve
            </button>
          </div>
        </div>
      </div>
    </>
    </ModalPortal>
  );
}

