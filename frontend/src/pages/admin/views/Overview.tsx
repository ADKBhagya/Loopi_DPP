import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function Overview() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-[#1B5E20] text-white rounded-xl p-6 flex justify-between items-center">

        <div>
          <p className="text-lg font-semibold">Enterprise Infrastructure</p>
          <p className="text-xs text-green-200 mt-1">
            ● System Operational • Latency: 42ms • Block #8,442,109
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-green-700 px-4 py-2 rounded-lg text-sm">
            Sync Node
          </button>
          <button className="bg-white text-[#1B5E20] px-4 py-2 rounded-lg text-sm font-semibold">
            Secure Session
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">

        <StatCard
          icon={<PeopleAltOutlinedIcon />}
          title="TOTAL USERS"
          value="1,284"
          sub="+12 this week"
          color="green"
        />

        <StatCard
          icon={<StorageOutlinedIcon />}
          title="ACTIVE NODES"
          value="4 / 5"
          sub="1 offline"
          color="blue"
        />

        <StatCard
          icon={<BoltOutlinedIcon />}
          title="BLOCKCHAIN TXS"
          value="8,442"
          sub="+5.2% MTD"
          color="orange"
        />

        <StatCard
          icon={<Inventory2OutlinedIcon />}
          title="PASSPORTS ISSUED"
          value="23,910"
          sub="+318 today"
          color="purple"
        />

      </div>

      {/* ================= ALERT ================= */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex justify-between items-center">

        <div>
          <p className="text-sm font-semibold text-yellow-800">
            5 self-registrations awaiting your approval
          </p>
          <p className="text-xs text-yellow-600">
            Manufacturer • Logistics • Retailer • Repair Center • Recycler accounts pending
          </p>
        </div>

        <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm">
          Review Now →
        </button>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-5">

        {/* LEFT */}
        <div className="col-span-2 space-y-5">

          {/* CHART */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <p className="text-sm font-semibold mb-3">
              Blockchain Transaction Volume
            </p>

            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
              Chart (Recharts later)
            </div>
          </div>

          {/* USER TABLE */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">

            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">Authorized User Access</p>
                <p className="text-xs text-gray-400">
                  Node permissions & cryptographic identities
                </p>
              </div>

              <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm">
                Add New User
              </button>
            </div>

            <div className="space-y-4">
              <UserRow id="U-001" name="Erik Larsson" role="MANUFACTURER" status="ACTIVE" />
              <UserRow id="U-002" name="Maria Silva" role="AUDITOR" status="ACTIVE" />
              <UserRow id="U-003" name="Hans Müller" role="LOGISTICS" status="SUSPENDED" />
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* SECURITY */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <p className="text-sm font-semibold mb-4">Security Event Log</p>

            <div className="space-y-4">
              <LogItem title="Login Attempt Failure" time="2m ago" color="red" />
              <LogItem title="Blockchain Sync Failure" time="15m ago" color="yellow" />
              <LogItem title="New Admin Assigned" time="1h ago" color="blue" />
              <LogItem title="Data Export Request" time="3h ago" color="blue" />
              <LogItem title="Password Reset Triggered" time="5h ago" color="yellow" />
            </div>

            <button className="mt-4 w-full border rounded-lg py-2 text-xs text-gray-500">
              VIEW SECURITY EXPLORER
            </button>
          </div>

          {/* NODE STATUS */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <p className="text-sm font-semibold mb-4">Network Node Status</p>

            <NodeItem name="Node Stockholm-01" status="ONLINE" />
            <NodeItem name="Node Porto-04" status="ONLINE" />
            <NodeItem name="Node Istanbul-08" status="SYNCING" />
            <NodeItem name="Node Berlin-02" status="OFFLINE" />
          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, title, value, sub, color }: any) {
  const colors: any = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>

      <div>
        <p className="text-[11px] text-gray-400 font-semibold">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-xs text-green-500">{sub}</p>
      </div>
    </div>
  );
}

function UserRow({ id, name, role, status }: any) {
  return (
    <div className="flex justify-between items-center border-t pt-3">

      <div className="flex gap-4 items-center">
        <div>
          <p className="text-xs text-gray-400">{id}</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>

        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {role}
        </span>
      </div>

      <StatusBadge status={status} />

    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    ACTIVE: "bg-green-100 text-green-600",
    SUSPENDED: "bg-red-100 text-red-500",
    ONLINE: "bg-green-100 text-green-600",
    OFFLINE: "bg-red-100 text-red-500",
    SYNCING: "bg-blue-100 text-blue-600",
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

function LogItem({ title, time, color }: any) {
  const colors: any = {
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
  };

  return (
    <div className="flex gap-3 items-start">
      <div className={`w-1 h-6 rounded ${colors[color]}`} />
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function NodeItem({ name, status }: any) {
  return (
    <div className="flex justify-between items-center border-t py-3 text-sm">

      <p>{name}</p>

      <StatusBadge status={status} />
    </div>
  );
}