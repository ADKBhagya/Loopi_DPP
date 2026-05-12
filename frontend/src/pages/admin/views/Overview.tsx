import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProvisionUserModal from "../components/ProvisionUserModal";
import UserModal from "../components/UserModal";

/* ICONS */
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";

export default function Overview() {
  const navigate = useNavigate();
  const ProvisionUserModalComponent = ProvisionUserModal as any;

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProvision, setShowProvision] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [showChartDropdown, setShowChartDropdown] = useState(false);

  const [pendingCountLocal, setPendingCountLocal] = useState(0);
  const [toast, setToast] = useState<any>(null);
  const [showExplorer, setShowExplorer] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    activeNodes: 0,
  });

  const token = localStorage.getItem("token");

  const handleSync = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ================= SINGLE CLEAN FETCH =================
  const fetchStats = async () => {
    try {
      const res = await fetch(`https://loopidpp.online/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStats(data);

      // sync pending count everywhere
      setPendingCountLocal(data.pendingUsers);

    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const [authorizedUsers, setAuthorizedUsers] = useState<any[]>([]);

  useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }
}, [toast]);

  useEffect(() => {
    fetch(`https://loopidpp.online/api/admin/approved-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setAuthorizedUsers(data))
      .catch(err => console.error(err));
  }, []);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchStats();
  }, []);

  // ================= AUTO REFRESH =================
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-[#1B5E20] text-white rounded-xl p-6 flex justify-between items-center shadow mt-6">

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
            <StorageOutlinedIcon />
          </div>

          <div>
            <p className="text-lg font-semibold">Enterprise Infrastructure</p>
            <p className="text-xs text-green-200 mt-1">
              ● System Operational • Latency: 42ms • Block #8,442,109
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSync}
            className="bg-green-700 flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          >
            <SyncOutlinedIcon fontSize="small" />
            Sync Node
          </button>

          <button className="bg-white text-[#1B5E20] flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
            <SecurityOutlinedIcon fontSize="small" />
            Secure Session
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">

        <StatCard
          icon={<PeopleAltOutlinedIcon />}
          title="TOTAL USERS"
          value={stats.totalUsers}
          sub={`${stats.pendingUsers} pending`}
          color="green"
        />

        <StatCard
          icon={<StorageOutlinedIcon />}
          title="ACTIVE NODES"
          value={`${stats.activeNodes} / 5`}
          sub="1 offline"
          color="blue"
        />

        <StatCard
          icon={<BoltOutlinedIcon />}
          title="BLOCKCHAIN TXS"
          value="LIVE"
          sub="Real-time"
          color="orange"
        />

        <StatCard
          icon={<Inventory2OutlinedIcon />}
          title="PASSPORTS ISSUED"
          value={stats.approvedUsers}
          sub="Approved users"
          color="purple"
        />

      </div>

      {/* ================= ALERT ================= */}
      {pendingCountLocal > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4 flex justify-between items-center shadow-sm">

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-yellow-800">
                {pendingCountLocal} self-registrations awaiting your approval
              </p>
              <p className="text-xs text-yellow-600">
                Manufacturer • Logistics • Retailer • Repair Center • Recycler accounts pending
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-yellow-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
          >
            Review Now →
          </button>
        </div>
      )}

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-5">

        {/* LEFT */}
        <div className="col-span-2 space-y-5">

          {/* CHART */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">

            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <TrendingUpOutlinedIcon fontSize="small" />
                Blockchain Transaction Volume
              </p>

              {/* DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowChartDropdown(!showChartDropdown)}
                  className="text-xs border px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  LAST 7 MONTHS
                  <KeyboardArrowDownOutlinedIcon fontSize="small" />
                </button>

                {showChartDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg text-xs overflow-hidden">
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">LAST 7 MONTHS</div>
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">LAST 30 DAYS</div>
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">YEAR TO DATE</div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[220px] bg-gradient-to-b from-green-50 to-white rounded-lg flex items-end px-4 pb-4">
              <div className="w-full h-[2px] bg-green-500 opacity-70 rounded-full" />
            </div>
          </div>

          {/* USER TABLE */}
          <div className="bg-white rounded-xl border shadow-sm">

            {/* HEADER */}
            <div className="p-5 flex justify-between items-center border-b">
              <div>
                <p className="font-semibold text-sm">Authorized User Access</p>
                <p className="text-xs text-gray-400">
                  Node permissions & cryptographic identities
                </p>
              </div>

              <button
                onClick={() => setShowProvision(true)}
                className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                + Provision New User
              </button>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-5 px-5 py-3 text-[11px] text-gray-400 font-semibold uppercase">
              <p>Identity ID</p>
              <p>Full Name</p>
              <p>Enterprise Role</p>
              <p>Access Status</p>
              <p></p>
            </div>

            {/* ROWS */}
            <div className="divide-y">
              {authorizedUsers
              .filter((user) => user.status === "approved") 
              .map((user) => (
                <UserRowNew
                  key={user._id}
                  id={user._id}
                  node="Stockholm-MF-01"
                  name={user.fullName}
                  email={user.email}
                  role={user.role.toUpperCase()}
                  status="ACTIVE"
                  onSelect={setSelectedUser}
                />
            ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* SECURITY */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">

            <div className="flex justify-between mb-4 items-center">
              <div className="flex items-center gap-2">
                <ShieldOutlinedIcon className="text-red-500" fontSize="small" />
                <p className="text-sm font-semibold">Security Event Log</p>
              </div>
              <span className="text-[10px] bg-red-100 text-red-500 px-2 py-1 rounded">
                LIVE
              </span>
            </div>

            <div className="space-y-4">
              <LogItem
                title="Login Attempt Failure"
                desc="u_9812@loopi.io"
                time="2M AGO"
                color="yellow"
              />

              <LogItem
                title="Blockchain Sync Failure"
                desc="Node Stockholm-X2"
                time="15M AGO"
                color="red"
              />

              <LogItem
                title="New Admin Assigned"
                desc="admin_root"
                time="1H AGO"
                color="blue"
              />

              <LogItem
                title="Data Export Request"
                desc="maria@auditor.pt"
                time="3H AGO"
                color="blue"
              />

              <LogItem
                title="Password Reset Triggered"
                desc="hans@berlin.de"
                time="5H AGO"
                color="yellow"
              />
            </div>

            <button
              onClick={() => setShowExplorer(true)}
              className="mt-4 w-full border rounded-lg py-2 text-xs text-gray-500 hover:bg-gray-50 transition"
            >
              VIEW SECURITY EXPLORER
            </button>
          </div>

          {/* NODE STATUS */}
          <div className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DnsOutlinedIcon className="text-blue-500" fontSize="small" />
              <p className="text-sm font-semibold">Network Node Status</p>
            </div>

            <NodeItem name="Node Stockholm-01" role="CORE" status="ONLINE" />
            <NodeItem name="Node Porto-04" role="VALIDATOR" status="ONLINE" />
            <NodeItem name="Node Istanbul-08" role="VALIDATOR" status="SYNCING" />
            <NodeItem name="Node Berlin-02" role="RELAY" status="OFFLINE" />
          </div>

        </div>
      </div>

      {/* ================= TOAST ================= */}
      {showToast && (
        <div className="fixed top-20 right-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <CheckCircleIcon />
          Node Synced — Block #8,442,109
        </div>
      )}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {showProvision && (
        <ProvisionUserModalComponent
          onClose={() => setShowProvision(false)}
          setToast={setToast}
        />
      )}

      {toast && (
        <div
          className={`fixed top-20 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}


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

function UserRowNew({ id, node, name, email, role, status, onSelect }: any) {
  return (
    <div className="grid grid-cols-5 px-5 py-4 items-center text-sm">

      {/* ID */}
      <div>
        <p className="text-xs text-gray-400">{id}</p>
        <p className="text-xs text-gray-400">{node}</p>
      </div>

      {/* NAME */}
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-gray-400">{email}</p>
      </div>

      {/* ROLE */}
      <div>
        <span className="text-[11px] bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {role}
        </span>
      </div>

      {/* STATUS */}
      <div>
        <StatusBadge status={status} />
      </div>

      {/* SETTINGS */}
      <div className="flex justify-end">
        <SettingsIcon
          onClick={() =>
            onSelect({
              id,
              name,
              email,
              role,
              status,
              node,
            })
          }
          className="text-gray-400 cursor-pointer hover:text-black"
        />
      </div>

    </div>
  );
}

function StatusBadge({ status }: any) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        ACTIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      SUSPENDED
    </span>
  );
}

function LogItem({ title, desc, time, color }: any) {
  const colors: any = {
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
  };

  return (
    <div className="flex gap-3 items-start">

      <div className={`w-[3px] h-10 rounded ${colors[color]}`} />

      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
        <p className="text-[10px] text-gray-400 mt-1">{time}</p>
      </div>

    </div>
  );
}

function NodeItem({ name, role, status }: any) {
  const statusStyles: any = {
    ONLINE: "bg-green-100 text-green-700",
    SYNCING: "bg-blue-100 text-blue-600",
    OFFLINE: "bg-red-100 text-red-500",
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 px-4 py-4 rounded-xl">

      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-[10px] text-gray-400 uppercase">{role}</p>
      </div>

      <span className={`text-[11px] px-3 py-1 rounded-full font-semibold ${statusStyles[status]}`}>
        {status}
      </span>

    </div>
  );
}


