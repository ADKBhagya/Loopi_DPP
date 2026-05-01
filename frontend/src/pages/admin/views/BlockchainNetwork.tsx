import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import { useState } from "react";


export default function BlockchainNetwork() {
  return (
    <div className="space-y-6 py-5">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl px-6 py-5 flex justify-between items-center shadow">

        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <StorageOutlinedIcon />
          </div>

          <div>
            <p className="text-[15px] font-semibold">Blockchain Network</p>
            <p className="text-xs text-blue-100">
              Hyperledger Fabric v2.4 — Mainnet
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition">
            Refresh
          </button>

          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            MAINNET ONLINE
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-5">

        <StatCard
          icon={<StorageOutlinedIcon />}
          label="LATEST BLOCK"
          value="8,442,109"
          bg="bg-blue-100"
          color="text-blue-600"
        />

        <StatCard
          icon={<AccessTimeOutlinedIcon />}
          label="BLOCK TIME"
          value="2.4s avg"
          bg="bg-green-100"
          color="text-green-700"
        />

        <StatCard
          icon={<BoltOutlinedIcon />}
          label="GAS USED (24H)"
          value="14.2K"
          extra="+8.1%"
          bg="bg-orange-100"
          color="text-orange-600"
        />

        <StatCard
          icon={<WifiOutlinedIcon />}
          label="PEER CONNECTIONS"
          value="24"
          bg="bg-purple-100"
          color="text-purple-600"
        />

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-6">

        {/* ================= TABLE ================= */}
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm">

          <div className="px-5 py-4 border-b">
            <p className="text-sm font-semibold text-gray-800">Network Nodes</p>
            <p className="text-xs text-gray-400">3 of 5 nodes online</p>
          </div>

          <div className="px-5">

            {/* HEADER */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] text-[11px] text-gray-400 py-3 border-b tracking-wide uppercase">
              <span>NODE</span>
              <span>TYPE</span>
              <span>STATUS</span>
              <span>PING</span>
              <span>LAST BLOCK</span>
              <span>LOAD</span>
            </div>

            {nodes.map((n, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] items-center py-5 border-b last:border-none text-sm"
              >

                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${n.color}`} />
                  {n.name}
                </div>

                <span className="inline-flex items-center justify-center text-[10px] px-2.5 py-[2px] rounded-md bg-gray-100 text-gray-500 font-semibold w-fit">
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

        {/* ================= RIGHT ================= */}
        <div className="space-y-5">

          {/* BLOCK CHART */}
          <BlockChart />

          {/* CHAIN INFO */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 shadow-sm p-5">

            {/* TITLE */}
            <p className="text-sm font-semibold text-gray-800 mb-4">
              Chain Information
            </p>

            {/* CONTENT */}
            <div className="space-y-4">

              <InfoRow label="Chain ID" value="LOOPI-MAIN-01" />
              <InfoRow label="Consensus" value="PBFT / PoA" />
              <InfoRow label="Smart Contract" value="v3.2.1" />
              <InfoRow label="TLS Cert Expiry" value="Aug 12, 2026" />

            </div>

          </div>

        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">

        <div className="flex justify-between mb-4">
          <p className="text-sm font-semibold">
            Gas Usage & Transaction Volume
          </p>

          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Transactions
            </span>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Gas
            </span>
          </div>
        </div>

        {/* FAKE SMOOTH CURVE (visual only) */}
        <div className="h-[200px] flex items-center justify-center text-gray-300">
          Chart (Recharts / Chart.js next)
        </div>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, label, value, extra, bg, color }: any) {
  return (
    <div className="bg-white border rounded-2xl p-4 flex items-center gap-4 shadow-sm">

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-[10px] text-gray-400 font-semibold tracking-wide">
          {label}
        </p>

        <p className="text-lg font-semibold text-gray-800">{value}</p>

        {extra && (
          <p className="text-xs text-green-600 font-medium">↑ {extra}</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    ONLINE: "bg-green-100 text-green-700",
    OFFLINE: "bg-red-100 text-red-500",
    SYNCING: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="w-fit">
      <span
        className={`inline-flex items-center justify-center text-[10px] px-3 py-[2px] rounded-full font-semibold tracking-wide ${map[status]}`}
      >
        {status}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">

      <span className="text-[13px] text-gray-400">
        {label}
      </span>

      <span className="text-[13px] font-medium text-gray-800">
        {value}
      </span>

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

function BlockChart() {
  const data = [
    { time: "00", value: 10 },
    { time: "04", value: 6 },
    { time: "08", value: 24 },
    { time: "12", value: 30 },
    { time: "16", value: 28 },
    { time: "20", value: 16 },
  ];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm relative">
      <p className="text-sm font-semibold mb-4">Block Production (24h)</p>

      <div className="h-[170px] flex items-end justify-between px-4 relative">

        {data.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center relative"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* HOVER BACKGROUND */}
            {hoverIndex === i && (
              <div className="absolute -top-6 w-10 h-[180px] bg-gray-100 rounded-lg z-0 transition" />
            )}

            {/* BAR */}
            <div
              className="w-6 bg-blue-500 rounded-md z-10 transition-all duration-200"
              style={{ height: `${d.value * 4}px` }}
            />

            {/* X LABEL */}
            <span className="text-[10px] text-gray-400 mt-2 z-10">
              {d.time}
            </span>

            {/* TOOLTIP */}
            {hoverIndex === i && (
              <div className="absolute -top-16 bg-white border shadow-md rounded-lg px-3 py-2 text-xs z-20">
                <p className="text-gray-500">{d.time}</p>
                <p className="text-blue-600 font-semibold">
                  Blocks: {d.value}
                </p>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}