import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { useEffect, useState } from "react";

export default function SystemConfig() {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    fetch("/api/admin/system-config")
      .then(res => res.json())
      .then(data => setConfig(data));
  }, []);

  const handleSave = async () => {
    await fetch("/api/admin/system-config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(config)
    });

    alert("Saved successfully");
  };

  return (
    <div className="space-y-6 py-5">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-2xl px-6 py-5 flex justify-between items-center shadow">

        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <SettingsOutlinedIcon />
          </div>

          <div>
            <p className="text-[15px] font-semibold">System Configuration</p>
            <p className="text-xs text-gray-300">
              Global node parameters, security protocols & integrations
            </p>
          </div>
        </div>

        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-xl text-sm font-semibold">
          Save Changes
        </button>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 gap-6">

        {/* AUTH */}
        <ConfigCard
          icon={<LockOutlinedIcon />}
          title="Authentication Protocols"
          subtitle="Identity & access management"
          color="green"
        >
        
          <Toggle label="Multi-Factor Authentication" desc="Require 2FA for all admin logins" enabled />
          <Toggle label="Session Timeout (30 min)" desc="Auto-logout after inactivity" enabled />
          <Toggle label="IP Allowlist Enforcement" desc="Restrict access to approved IP ranges" />
          <Toggle label="Single Sign-On (SSO)" desc="SAML 2.0 enterprise SSO integration" />
        </ConfigCard>

        {/* BLOCKCHAIN */}
          <ConfigCard
            icon={<StorageOutlinedIcon />}
            title="Blockchain Parameters"
            subtitle="Node synchronisation & consensus settings"
            color="blue"
          >
            <Toggle label="Auto-Sync on Block Mismatch" desc="Sync when local and remote blocks diverge" enabled />
          <Toggle label="Gas Credit Alerts" desc="Alert when wallet drops below 500 LOOPI" enabled />
          <Toggle label="Archive Mode" desc="Store full chain history locally" />
          <Toggle label="Telemetry Reporting" desc="Send anonymised metrics to LOOPI core" enabled />
        </ConfigCard>

        {/* NOTIFICATIONS */}
        <ConfigCard
          icon={<NotificationsNoneOutlinedIcon />}
          title="Notification Settings"
          subtitle="Alerts & event delivery preferences"
          color="yellow"
        >
          <Toggle label="Security Event Alerts" desc="Email on critical security events" enabled />
          <Toggle label="Node Offline Alerts" desc="Push notification when node goes offline" enabled />
          <Toggle label="Daily Digest Email" desc="Summary of activity at 08:00 CET" />
          <Toggle label="Audit Trail Exports" desc="Weekly automated PDF export" />
        </ConfigCard>

        {/* API KEYS */}
          <ConfigCard
            icon={<KeyOutlinedIcon />}
            title="API Keys & Integrations"
            subtitle="External service credentials"
            color="purple"
          >
            <Input label="LOOPI CORE API KEY" value="••••••••••••••••••••••••" />
          <Input label="BLOCKCHAIN RPC URL" value="••••••••••••••••••••••••" />
          <Input label="WEBHOOK SECRET" value="••••••••••••••••••••••••" />

          <button className="text-blue-600 text-xs font-medium mt-2 hover:underline">
            Reveal Keys
          </button>
        </ConfigCard>

      </div>
    </div>
  );
}


function ConfigCard({ icon, title, subtitle, children, color }: any) {

  const colorMap: any = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 shadow-sm">

      <div className="flex items-center gap-3 mb-5">
        {/* ICON BOX */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, desc, enabled = false }: any) {
  return (
    <div className="flex items-center justify-between">

      <div>
        <p className="text-[13px] font-medium text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>

      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-green-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>

    </div>
  );
}

function Input({ label, value }: any) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 mb-2 tracking-wide">
        {label}
      </p>

      <input
        value={value}
        readOnly
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
      />
    </div>
  );
}