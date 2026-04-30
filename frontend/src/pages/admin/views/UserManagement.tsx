import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";

export default function UserManagement() {
  return (
    <div className="space-y-6">

      {/* ================= PENDING REGISTRATIONS ================= */}
      <div className="bg-[#FFF7E6] border border-[#FACC15] rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
              <WarningAmberRoundedIcon className="text-yellow-600 text-[20px]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Pending Registrations
              </p>
              <p className="text-xs text-gray-500">
                Self-registered accounts requiring admin approval to activate
              </p>
            </div>

            <span className="ml-2 text-[10px] bg-yellow-400 text-white px-2 py-0.5 rounded-md font-semibold">
              5 AWAITING REVIEW
            </span>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-2 text-[11px]">
            {["ALL", "MANUFACTURER", "LOGISTICS", "RETAILER"].map((f, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-md cursor-pointer ${
                  i === 0
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* LIST */}
        {pendingUsers.map((u, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-5 py-4 border-t"
          >

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* AVATAR */}
              <div className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {u.initials}
              </div>

              {/* USER INFO */}
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {u.name}
                </p>

                <p className="text-xs text-gray-500">
                  {u.email} · {u.company} · {u.country}
                </p>

                <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">
                  {u.role}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              <div className="text-right text-xs text-gray-400">
                <p className="uppercase text-[10px]">Submitted</p>
                <p>{u.date}</p>
              </div>

              <button className="border border-gray-200 px-3 py-1 rounded-md text-xs">
                Review
              </button>

              <button className="bg-green-700 text-white px-3 py-1 rounded-md text-xs">
                ✓ Approve
              </button>

              <CancelIcon className="text-red-500 cursor-pointer text-[18px]" />
            </div>
          </div>
        ))}

        <div className="px-5 py-3 text-[10px] text-gray-400 border-t">
          SELF-REGISTRABLE ROLES: MANUFACTURER · LOGISTICS · RETAILER · REPAIR CENTER · RECYCLER
        </div>
      </div>

      {/* ================= USER TABLE ================= */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              User Management
            </p>
            <p className="text-xs text-gray-400">
              Manage all system users and permissions
            </p>
          </div>

          <button className="bg-green-800 text-white px-4 py-2 rounded-md text-xs">
            + Provision New User
          </button>
        </div>

        {/* HEADER */}
        <div className="grid grid-cols-5 text-[11px] text-gray-400 pb-2 border-b">
          <span>IDENTITY ID</span>
          <span>FULL NAME</span>
          <span>ENTERPRISE ROLE</span>
          <span>ACCESS STATUS</span>
          <span></span>
        </div>

        {/* ROWS */}
        {users.map((u, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center py-3 border-t"
          >

            {/* ID */}
            <div>
              <p className="text-xs font-medium">{u.id}</p>
              <p className="text-[10px] text-gray-400">{u.sub}</p>
            </div>

            {/* NAME */}
            <div>
              <p className="text-sm font-semibold">{u.name}</p>
              <p className="text-xs text-gray-400">{u.email}</p>
            </div>

            {/* ROLE */}
            <div>
              <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-md font-medium">
                {u.role}
              </span>
            </div>

            {/* STATUS */}
            <div>
              {u.status === "ACTIVE" ? (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircleIcon fontSize="small" /> ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 text-xs">
                  <CancelIcon fontSize="small" /> SUSPENDED
                </span>
              )}
            </div>

            {/* SETTINGS */}
            <div className="flex justify-end">
              <SettingsIcon className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pendingUsers = [
  {
    name: "Lena Johansson",
    initials: "LJ",
    email: "lena@textlab.se",
    company: "Textlab AB",
    country: "Sweden",
    role: "MANUFACTURER",
    date: "Feb 21, 2026 · 07:42",
  },
  {
    name: "Carlos Ferreira",
    initials: "CF",
    email: "c.ferreira@northlog.pt",
    company: "NorthLog Portugal",
    country: "Portugal",
    role: "LOGISTICS",
    date: "Feb 20, 2026 · 15:10",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    email: "priya@flashwd.de",
    company: "FlashForward GmbH",
    country: "Germany",
    role: "RETAILER",
    date: "Feb 20, 2026 · 09:58",
  },
];

const users = [
  {
    id: "U-001",
    sub: "Stockholm-MF-01",
    name: "Erik Larsson",
    email: "erik@loopi.se",
    role: "MANUFACTURER",
    status: "ACTIVE",
  },
  {
    id: "U-002",
    sub: "Porto-AU-04",
    name: "Maria Silva",
    email: "m.silva@porto.pt",
    role: "AUDITOR",
    status: "ACTIVE",
  },
  {
    id: "U-003",
    sub: "Berlin-LG-08",
    name: "Hans Müller",
    email: "h.muller@berlin.de",
    role: "LOGISTICS",
    status: "SUSPENDED",
  },
];