import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";

export default function BlockchainNetwork() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-5 flex justify-between items-center mt-6">

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <StorageOutlinedIcon />
          </div>

          <div>
            <p className="text-sm font-semibold">Blockchain Network</p>
            <p className="text-xs text-blue-100">
              Hyperledger Fabric v2.4 — Mainnet
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm">
            Refresh
          </button>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold">
            ● MAINNET ONLINE
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">

        <StatCard icon={<StorageOutlinedIcon />} label="Latest Block" value="8,442,109" />
        <StatCard icon={<AccessTimeOutlinedIcon />} label="Block Time" value="2.4s avg" />
        <StatCard icon={<BoltOutlinedIcon />} label="Gas Used (24h)" value="14.2K" />
        <StatCard icon={<WifiOutlinedIcon />} label="Peer Connections" value="24" />

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-5">

        {/* ================= LEFT TABLE ================= */}
        <div className="col-span-2 bg-white rounded-xl border shadow-sm">

          <div className="p-4 border-b">
            <p className="text-sm font-semibold text-gray-800">Network Nodes</p>
            <p className="text-xs text-gray-400">3 of 5 nodes online</p>
          </div>

          <div className="px-4">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-6 text-[11px] text-gray-400 py-3 border-b">
              <span>NODE</span>
              <span>TYPE</span>
              <span>STATUS</span>
              <span>PING</span>
              <span>LAST BLOCK</span>
              <span>LOAD</span>
            </div>

            {nodes.map((n, i) => (
              <div key={i} className="grid grid-cols-6 items-center py-4 border-b text-sm">

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${n.color}`} />
                  {n.name}
                </div>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                  {n.type}
                </span>

                <StatusBadge status={n.status} />

                <span className="text-xs text-gray-500">{n.ping}</span>
                <span className="text-xs text-gray-500">{n.block}</span>

                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${n.loadColor}`}
                      style={{ width: n.load }}
                    />
                  </div>
                  <span className="text-xs">{n.load}</span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="space-y-5">

          {/* BLOCK PRODUCTION */}
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-sm font-semibold mb-2">Block Production (24h)</p>

            <div className="h-[150px] flex items-end justify-between px-4">
              {[8, 4, 10, 12, 11, 7].map((h, i) => (
                <div
                  key={i}
                  className="w-6 bg-blue-500 rounded"
                  style={{ height: `${h * 10}px` }}
                />
              ))}
            </div>
          </div>

          {/* CHAIN INFO */}
          <div className="bg-white rounded-xl p-4 border shadow-sm space-y-3 text-sm">
            <p className="font-semibold">Chain Information</p>

            <InfoRow label="Chain ID" value="LOOPI-MAIN-01" />
            <InfoRow label="Consensus" value="PBFT / PoA" />
            <InfoRow label="Smart Contract" value="v3.2.1" />
            <InfoRow label="TLS Cert Expiry" value="Aug 12, 2026" />
          </div>

        </div>
      </div>

      {/* ================= BOTTOM CHART ================= */}
      <div className="bg-white rounded-xl p-5 border shadow-sm">
        <p className="text-sm font-semibold mb-3">
          Gas Usage & Transaction Volume
        </p>

        <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
          Chart (Recharts later)
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    ONLINE: "bg-green-100 text-green-600",
    OFFLINE: "bg-red-100 text-red-500",
    SYNCING: "bg-blue-100 text-blue-600",
  };

  return (
    <span className={`text-[10px] px-2 py-1 rounded-md ${map[status]}`}>
      {status}
    </span>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

/* ================= DATA ================= */

const nodes = [
  {
    name: "Node Stockholm-01",
    type: "CORE",
    status: "ONLINE",
    ping: "12ms",
    block: "#8,442,109",
    load: "42%",
    loadColor: "bg-green-500",
    color: "bg-green-500",
  },
  {
    name: "Node Porto-04",
    type: "VALIDATOR",
    status: "ONLINE",
    ping: "38ms",
    block: "#8,442,107",
    load: "61%",
    loadColor: "bg-yellow-400",
    color: "bg-green-500",
  },
  {
    name: "Node Istanbul-08",
    type: "VALIDATOR",
    status: "SYNCING",
    ping: "94ms",
    block: "#8,441,990",
    load: "78%",
    loadColor: "bg-red-500",
    color: "bg-blue-500",
  },
  {
    name: "Node Berlin-02",
    type: "RELAY",
    status: "OFFLINE",
    ping: "-",
    block: "#8,439,210",
    load: "0%",
    loadColor: "bg-gray-300",
    color: "bg-red-500",
  },
];