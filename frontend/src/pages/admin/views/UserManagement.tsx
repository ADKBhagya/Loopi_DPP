import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";

export default function UserManagement() {
  return (
    <div className="space-y-6">

      {/* ================= PENDING ================= */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Pending Registrations</h3>

        {["Priya Nair", "Mikael Öberg", "Fatima Al-Rashid"].map((name) => (
          <div key={name} className="flex justify-between items-center border-t py-3">

            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-500">Company · Country</p>
            </div>

            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded text-sm">
                Review
              </button>

              <button className="bg-green-700 text-white px-3 py-1 rounded text-sm">
                Approve
              </button>

              <CancelIcon className="text-red-500 cursor-pointer" />
            </div>

          </div>
        ))}
      </div>

      {/* ================= USERS ================= */}
      <div className="bg-white rounded-xl p-5 border shadow-sm">

        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">User Management</h3>

          <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm">
            Add New User
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-400 text-xs uppercase">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <UserRow id="U-001" name="Erik Larsson" role="Manufacturer" status="active" />
            <UserRow id="U-002" name="Maria Silva" role="Auditor" status="active" />
            <UserRow id="U-003" name="Hans Müller" role="Logistics" status="suspended" />
          </tbody>
        </table>

      </div>

    </div>
  );
}

function UserRow({ id, name, role, status }: any) {
  return (
    <tr className="border-t">
      <td>{id}</td>
      <td>{name}</td>
      <td>{role}</td>

      <td>
        {status === "active" ? (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircleIcon fontSize="small" /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500">
            <CancelIcon fontSize="small" /> Suspended
          </span>
        )}
      </td>

      <td>
        <SettingsIcon className="text-gray-400 cursor-pointer" />
      </td>
    </tr>
  );
}