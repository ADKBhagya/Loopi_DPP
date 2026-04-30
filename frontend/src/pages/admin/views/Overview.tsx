import logo from "../../../assets/logo.png";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function Overview() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-[#1B5E20] text-white rounded-xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Enterprise Infrastructure</h2>
          <p className="text-sm text-green-200">
            ● System Operational • Latency: 42ms • Block #8,442,109
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-700 rounded-lg text-sm">
            <SyncOutlinedIcon fontSize="small" />
            Sync Node
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1B5E20] rounded-lg text-sm font-semibold">
            <ShieldOutlinedIcon fontSize="small" />
            Secure Session
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">

        <Stat icon={<PeopleAltOutlinedIcon />} title="Total Users" value="1,284" sub="+12 this week" />

        <Stat icon={<StorageOutlinedIcon />} title="Active Nodes" value="4 / 5" sub="1 offline" />

        <Stat icon={<TimelineOutlinedIcon />} title="Blockchain TXs" value="8,442" sub="+5.2% MTD" />

        <Stat icon={<Inventory2OutlinedIcon />} title="Passports Issued" value="23,910" sub="+318 today" />

      </div>

      {/* ================= ALERT ================= */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="font-semibold text-yellow-800">
            5 self-registrations awaiting your approval
          </p>
          <p className="text-xs text-yellow-600">
            Manufacturer · Logistics · Retailer · Repair Center · Recycler
          </p>
        </div>

        <button className="bg-yellow-400 px-4 py-2 rounded-lg text-sm font-bold">
          Review Now →
        </button>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-3">
              Blockchain Transaction Volume
            </h3>

            <div className="h-40 flex items-center justify-center text-gray-400">
              Chart (Add Recharts later)
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white p-5 rounded-xl border shadow-sm">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Authorized User Access</h3>

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
                </tr>
              </thead>

              <tbody>
                <Row id="U-001" name="Erik Larsson" role="Manufacturer" status="active" />
                <Row id="U-002" name="Maria Silva" role="Auditor" status="active" />
                <Row id="U-003" name="Hans Müller" role="Logistics" status="suspended" />
              </tbody>
            </table>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Security Log */}
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4">Security Event Log</h3>

            {[
              "Login Attempt Failure",
              "Blockchain Sync Failure",
              "New Admin Assigned",
              "Data Export Request",
              "Password Reset Triggered"
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-red-400 pl-3 mb-3">
                <p className="text-sm font-medium">{item}</p>
                <p className="text-xs text-gray-400">2h ago</p>
              </div>
            ))}

          </div>

          {/* Node Status */}
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4">Network Node Status</h3>

            <Node name="Node Stockholm-01" status="Online" />
            <Node name="Node Porto-04" status="Online" />
            <Node name="Node Istanbul-08" status="Syncing" />
            <Node name="Node Berlin-02" status="Offline" />

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ icon, title, value, sub }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 text-[#1B5E20]">
        {icon}
        <p className="text-xs">{title}</p>
      </div>
      <h2 className="text-lg font-bold mt-1">{value}</h2>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function Row({ id, name, role, status }: any) {
  return (
    <tr className="border-t">
      <td>{id}</td>
      <td>{name}</td>
      <td>{role}</td>
      <td className={status === "active" ? "text-green-600" : "text-red-500"}>
        {status === "active" ? "Active" : "Suspended"}
      </td>
    </tr>
  );
}

function Node({ name, status }: any) {
  return (
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm">{name}</p>

      <span className={`text-xs px-2 py-1 rounded ${
        status === "Online" ? "bg-green-100 text-green-700" :
        status === "Syncing" ? "bg-blue-100 text-blue-700" :
        "bg-red-100 text-red-700"
      }`}>
        {status}
      </span>
    </div>
  );
}