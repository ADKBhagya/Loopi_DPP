import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLoader from "../components/PageLoader";
// lightweight fallback for toast if react-hot-toast is not installed




export default function SystemConfig() {
  const token = localStorage.getItem("token");

  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchVersions();
  fetchConfig();
}, []);


const fetchConfig = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/system-config",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setConfig(data);
  } catch (err) {
    console.error("Config load failed");
  } finally {
    setLoading(false);
  }
};

  const [versions, setVersions] = useState([]);

const fetchVersions = async () => {
  const res = await fetch(
    "http://localhost:5000/api/admin/system-config/versions",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await res.json();
  setVersions(data);
};

const handleRollback = async (versionId: string) => {
  if (!window.confirm("Are you sure you want to rollback?")) return;

  try {
    await fetch(
      `http://localhost:5000/api/admin/system-config/rollback/${versionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Rollback successful");

    fetchConfig();

  } catch {
    toast.error("Rollback failed");
  }
};

  const handleToggle = (section: string, field: string, value: boolean | number) => {
  setConfig((prev: any) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value,
    },
  }));
};

 const handleSave = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/system-config",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      }
    );

    if (!res.ok) throw new Error();

    toast.success("Configuration Saved", {
      description: "System configuration updated successfully",
      duration: 2500,
    });

  } catch (error) {
    toast.error("Failed to save configuration");
  }
};

const handleReveal = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/system-config/reveal",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    setConfig({
      ...config,
      integrations: data,
    });

    toast.success("Secrets revealed");

  } catch {
    toast.error("Failed to reveal secrets");
  }
};

if (loading || !config) {
  return <PageLoader text="LOADING CONFIGURATION..." />;
}

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
        
          <Toggle
            label="Multi-Factor Authentication"
            desc="Require 2FA for all admin logins"
            enabled={config?.security?.mfa}
            onChange={(v: boolean) => handleToggle("security", "mfa", v)}
          />
          <Toggle label="Session Timeout (30 min)" desc="Auto-logout after inactivity" enabled={config?.security?.sessionTimeout > 0}
onChange={(v: boolean) =>
  handleToggle("security", "sessionTimeout", v ? 30 : 0)
}/>
          <Toggle label="IP Allowlist Enforcement" desc="Restrict access to approved IP ranges" enabled={config?.security?.ipAllowlist} onChange={(v: boolean) => handleToggle("security", "ipAllowlist", v)} />
          <Toggle label="Single Sign-On (SSO)" desc="SAML 2.0 enterprise SSO integration" enabled={config?.security?.sso} onChange={(v: boolean) => handleToggle("security", "sso", v)} />
        </ConfigCard>

        {/* BLOCKCHAIN */}
          <ConfigCard
            icon={<StorageOutlinedIcon />}
            title="Blockchain Parameters"
            subtitle="Node synchronisation & consensus settings"
            color="blue"
          >
            <Toggle label="Auto-Sync on Block Mismatch" desc="Sync when local and remote blocks diverge" enabled={config?.blockchain?.autoSync} onChange={(v: boolean) => handleToggle("blockchain", "autoSync", v)} />
          <Toggle label="Gas Credit Alerts" desc="Alert when wallet drops below 500 LOOPI" enabled={config?.blockchain?.gasAlerts} onChange={(v: boolean) => handleToggle("blockchain", "gasAlerts", v)} />
          <Toggle label="Archive Mode" desc="Store full chain history locally" enabled={config?.blockchain?.archiveMode} onChange={(v: boolean) => handleToggle("blockchain", "archiveMode", v)} />
          <Toggle label="Telemetry Reporting" desc="Send anonymised metrics to LOOPI core" enabled={config?.blockchain?.telemetry} onChange={(v: boolean) => handleToggle("blockchain", "telemetry", v)} />
        </ConfigCard>

        {/* NOTIFICATIONS */}
        <ConfigCard
          icon={<NotificationsNoneOutlinedIcon />}
          title="Notification Settings"
          subtitle="Alerts & event delivery preferences"
          color="yellow"
        >
          <Toggle label="Security Event Alerts" desc="Email on critical security events" enabled={config?.notifications?.securityAlerts} onChange={(v: boolean) => handleToggle("notifications", "securityAlerts", v)} />
          <Toggle label="Node Offline Alerts" desc="Push notification when node goes offline" enabled={config?.notifications?.nodeAlerts}
            onChange={(v: boolean) =>
              handleToggle("notifications", "nodeAlerts", v)
            } />
          <Toggle label="Daily Digest Email" desc="Summary of activity at 08:00 CET" enabled={config?.notifications?.digestEmail}
            onChange={(v: boolean) =>
              handleToggle("notifications", "digestEmail", v)
            } />
          <Toggle label="Audit Trail Exports" desc="Weekly automated PDF export" enabled={config?.notifications?.auditExport}
          onChange={(v: boolean) =>
            handleToggle("notifications", "auditExport", v)
          } />
        </ConfigCard>

        {/* API KEYS */}
          <ConfigCard
            icon={<KeyOutlinedIcon />}
            title="API Keys & Integrations"
            subtitle="External service credentials"
            color="purple"
          >
            <Input
              label="LOOPI CORE API KEY"
              value={config.integrations?.apiKey || ""}
              onChange={(v: string) =>
                setConfig({
                  ...config,
                  integrations: {
                    ...config.integrations,
                    apiKey: v,
                  },
                })
              }
            />
          <Input
            label="BLOCKCHAIN RPC URL"
            value={config.integrations?.rpcUrl || ""}
            onChange={(v: string) =>
              setConfig({
                ...config,
                integrations: {
                  ...config.integrations,
                  rpcUrl: v,
                },
              })
            }
          />

          <Input
            label="WEBHOOK SECRET"
            value={config.integrations?.webhookSecret || ""}
            onChange={(v: string) =>
              setConfig({
                ...config,
                integrations: {
                  ...config.integrations,
                  webhookSecret: v,
                },
              })
            }
          />

          <button onClick={handleReveal} className="text-blue-600 text-xs font-medium mt-2 hover:underline">
            Reveal Keys
          </button>
        </ConfigCard>

      </div>
      
      

    
<div className="mt-6 bg-white rounded-xl border p-4">
  <p className="font-semibold mb-3 text-gray-800">Configuration History</p>

  {versions.map((v: any) => (
    <div
      key={v._id}
      className="flex justify-between items-center border-b py-2 text-sm"
    >
      <div>
        <p className="text-gray-700">
          Changed by <span className="font-medium">{v.changedBy}</span>
        </p>
        <p className="text-gray-400 text-xs">
          {new Date(v.createdAt).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => handleRollback(v._id)}
        className="text-red-600 hover:underline text-xs"
      >
        Rollback
      </button>
    </div>
  ))}
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

 
function Toggle({ label, desc, enabled = false, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] font-medium text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>

      <div
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
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

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 mb-2 tracking-wide">
        {label}
      </p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
      />
    </div>
  );
} 




