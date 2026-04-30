import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";

export default function SystemConfig() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-xl p-5 flex justify-between items-center mt-6 ">

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <SettingsOutlinedIcon />
          </div>

          <div>
            <p className="font-semibold">System Configuration</p>
            <p className="text-xs text-gray-300">
              Global node parameters, security protocols & integrations
            </p>
          </div>
        </div>

        <button className="bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
          Save Changes
        </button>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 gap-6">

        {/* AUTH */}
        <ConfigCard icon={<LockOutlinedIcon />} title="Authentication Protocols">
          <Toggle label="Multi-Factor Authentication" desc="Require 2FA for all admin logins" />
          <Toggle label="Session Timeout (30 min)" desc="Auto-logout after inactivity" enabled />
          <Toggle label="IP Allowlist Enforcement" desc="Restrict access to approved IP ranges" />
          <Toggle label="Single Sign-On (SSO)" desc="SAML 2.0 enterprise SSO integration" />
        </ConfigCard>

        {/* BLOCKCHAIN */}
        <ConfigCard icon={<StorageOutlinedIcon />} title="Blockchain Parameters">
          <Toggle label="Auto-Sync on Block Mismatch" enabled />
          <Toggle label="Gas Credit Alerts" enabled />
          <Toggle label="Archive Mode" />
          <Toggle label="Telemetry Reporting" enabled />
        </ConfigCard>

        {/* NOTIFICATIONS */}
        <ConfigCard icon={<NotificationsNoneOutlinedIcon />} title="Notification Settings">
          <Toggle label="Security Event Alerts" enabled />
          <Toggle label="Node Offline Alerts" enabled />
          <Toggle label="Daily Digest Email" />
          <Toggle label="Audit Trail Exports" />
        </ConfigCard>

        {/* API KEYS */}
        <ConfigCard icon={<KeyOutlinedIcon />} title="API Keys & Integrations">

          <Input label="Loopi Core API Key" value="sk-lp-****************3a8f" />
          <Input label="Blockchain RPC URL" value="https://rpc.loopi.net/mainnet" />
          <Input label="Webhook Secret" value="whsec-*************d92c" />

          <button className="text-blue-600 text-xs mt-2">Reveal Keys</button>

        </ConfigCard>

      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">

        <p className="text-red-600 font-semibold mb-1">Danger Zone</p>
        <p className="text-xs text-red-400 mb-4">
          Irreversible system actions
        </p>

        <div className="grid grid-cols-3 gap-4">

          <DangerCard
            title="Purge Audit Cache"
            desc="Clear temporary audit logs cache"
          />

          <DangerCard
            title="Rotate API Keys"
            desc="Invalidate and regenerate all keys"
          />

          <DangerCard
            title="Factory Reset Node"
            desc="Wipe node config to default state"
          />

        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function ConfigCard({ icon, title, children }: any) {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-400">
            Identity & access management
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, desc, enabled = false }: any) {
  return (
    <div className="flex justify-between items-center">

      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-gray-400">{desc}</p>}
      </div>

      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          enabled ? "bg-green-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform ${
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
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <input
        value={value}
        readOnly
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
      />
    </div>
  );
}

function DangerCard({ title, desc }: any) {
  return (
    <div className="bg-white border border-red-200 rounded-lg p-4 hover:bg-red-50 cursor-pointer transition">
      <p className="text-red-600 font-semibold text-sm">{title}</p>
      <p className="text-xs text-red-400 mt-1">{desc}</p>
    </div>
  );
}