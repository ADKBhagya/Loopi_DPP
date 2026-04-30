import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StorageIcon from "@mui/icons-material/Storage";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import SecurityIcon from "@mui/icons-material/Security";

export default function Overview() {
  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="bg-[#166534] text-white px-6 py-5 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-[16px] font-semibold">Enterprise Infrastructure</h2>
          <p className="text-[12px] text-green-200 mt-1">
            ● System Operational • Latency: 42ms • Block #8,442,109
          </p>
        </div>

        <div className="flex gap-2">
          <button className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg">
            Sync Node
          </button>
          <button className="bg-white text-green-700 text-xs px-4 py-2 rounded-lg">
            Secure Session
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">

        <Stat icon={<PeopleAltIcon />} title="Total Users" value="1,284" sub="+12 this week" />

        <Stat icon={<StorageIcon />} title="Active Nodes" value="4 / 5" sub="1 offline" />

        <Stat icon={<TrendingUpIcon />} title="Blockchain TXs" value="8,442" sub="+5.2% MTD" />

        <Stat icon={<InventoryIcon />} title="Passports Issued" value="23,910" sub="+318 today" />

      </div>

      {/* ALERT */}
      <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl px-4 py-3 flex justify-between items-center">
        <p className="text-[13px] text-gray-700">
          5 self-registrations awaiting your approval
        </p>

        <button className="bg-[#FACC15] text-black text-xs px-4 py-2 rounded-lg">
          Review Now →
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-5">

        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-5">

          {/* CHART */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">
              Blockchain Transaction Volume
            </h3>

            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              Chart (Recharts later)
            </div>
          </div>

          {/* USER TABLE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold">Authorized User Access</h3>
                <p className="text-xs text-gray-400">
                  Node permissions & cryptographic identities
                </p>
              </div>

              <button className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg">
                Add New User
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="text-gray-400 text-[11px] uppercase">
                <tr>
                  <th className="text-left py-2">Identity ID</th>
                  <th className="text-left">Full Name</th>
                  <th className="text-left">Enterprise Role</th>
                  <th className="text-left">Access Status</th>
                </tr>
              </thead>

              <tbody>
                <Row id="U-001" name="Erik Larsson" role="Manufacturer" status="Active" />
                <Row id="U-002" name="Maria Silva" role="Auditor" status="Active" />
                <Row id="U-003" name="Hans Müller" role="Logistics" status="Suspended" />
              </tbody>
            </table>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">

          {/* SECURITY */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <SecurityIcon fontSize="small" />
                Security Event Log
              </h3>

              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md">
                LIVE
              </span>
            </div>

            <div className="space-y-3 text-[12px]">

              <Log color="red" text="Login Attempt Failure" />
              <Log color="red" text="Blockchain Sync Failure" />
              <Log color="blue" text="New Admin Assigned" />
              <Log color="blue" text="Data Export Request" />
              <Log color="yellow" text="Password Reset Triggered" />

            </div>
          </div>

          {/* NODE STATUS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <h3 className="text-sm font-semibold mb-3">
              Network Node Status
            </h3>

            <Node name="Stockholm-01" status="ONLINE" />
            <Node name="Porto-04" status="ONLINE" />
            <Node name="Istanbul-08" status="SYNCING" />
            <Node name="Berlin-02" status="OFFLINE" />

          </div>

        </div>
      </div>
    </div>
  );
}




/* 🔹 COMPONENTS */

function Stat({ icon, title, value, sub }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="bg-gray-100 p-2 rounded-md">{icon}</div>
      <div>
        <p className="text-[11px] text-gray-400">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
        <p className="text-[11px] text-green-500">{sub}</p>
      </div>
    </div>
  );
}

function Row({ id, name, role, status }: any) {
  return (
    <tr className="border-t border-gray-200 text-[13px]">
      <td className="py-3">{id}</td>
      <td>{name}</td>

      <td>
        <span className="px-2 py-1 rounded-full text-[11px] bg-blue-50 text-blue-600">
          {role}
        </span>
      </td>

      <td>
        <span className={`px-2 py-1 rounded-full text-[11px] ${
          status === "Active"
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-500"
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function Log({ color, text }: any) {
  return (
    <div className={`border-l-2 pl-2 border-${color}-400`}>
      {text}
    </div>
  );
}

function Node({ name, status }: any) {
  const styles: any = {
    ONLINE: "bg-green-50 text-green-600",
    SYNCING: "bg-blue-50 text-blue-600",
    OFFLINE: "bg-red-50 text-red-500",
  };

  return (
    <div className="flex justify-between items-center py-2 border-t border-gray-100 text-[12px]">
      <span>{name}</span>
      <span className={`px-2 py-1 rounded-full ${styles[status]}`}>
        {status}
      </span>
    </div>
  );
}