import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ICONS */
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";


export default function Topbar({ onOpenExplorer }: any) {
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showGas, setShowGas] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="h-[72px] bg-white border-b fixed left-[210px] right-0 top-0 flex items-center justify-between px-6 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-5">

        <div className="relative">
          <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            placeholder="Search Passport ID, Batch or Batch ID..."
            className="w-[360px] h-10 pl-10 pr-4 rounded-xl border bg-gray-50 text-sm outline-none focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* STATUS */}
        <div className="px-4 py-2 rounded-full bg-green-50 border text-green-600 text-xs font-bold">
          ● MAINNET ONLINE
        </div>

        {/* NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowUser(false);
            }}
            className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <NotificationsNoneOutlinedIcon style={{ fontSize: 20 }} />

            {/* RED DOT */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotif && (
            <NotificationDropdown
              onOpenExplorer={() => {
                onOpenExplorer(); // instead of setShowExplorer
                setShowNotif(false);
              }}
                          />
          )}
        </div>

        {/* USER */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUser(!showUser);
              setShowNotif(false);
            }}
            className="flex items-center gap-3 border rounded-xl px-3 h-11 hover:bg-gray-50"
          >
            <div className="text-right">
              <p className="text-xs font-bold">Kaushanibhagya9</p>
              <p className="text-[10px] text-gray-400">ADMIN</p>
            </div>

            <div className="w-9 h-9 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white">
              <PersonOutlineOutlinedIcon />
            </div>

            <KeyboardArrowDownOutlinedIcon />
          </button>

          {showUser && (
            <UserDropdown
              onIdentityClick={() => {
                setShowIdentityModal(true);
                setShowUser(false);
              }}
              onPrefsClick={() => {
                setShowPrefs(true);
                setShowUser(false);
              }}
              onGasClick={() => {
                setShowGas(true);
                setShowUser(false);
              }}
              onLogoutClick={() => {
                setShowLogoutConfirm(true);
                setShowUser(false);
              }}
            />
          )}
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-20 right-6 ...">
          <CheckCircleIcon />
          Node Synced — Block #8,442,109
        </div>
      )}

      {showIdentityModal && (
        <IdentityControlsModal onClose={() => setShowIdentityModal(false)} />
      )}

      {showPrefs && (
        <SystemPreferencesModal onClose={() => setShowPrefs(false)} />
      )}

      {showGas && (
        <GasCreditsModal onClose={() => setShowGas(false)} />
      )}

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            // clear session (optional)
            localStorage.clear();

            // navigate to login
            navigate("/");

            // close modal
            setShowLogoutConfirm(false);
          }}
        />
      )}

      </header>
  );
}

/* ================= NOTIFICATION DROPDOWN ================= */

function NotificationDropdown({ onOpenExplorer }: any) {
  return (
    <div className="absolute right-0 top-14 w-[340px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50">

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 py-4 border-b">
        <p className="text-sm font-semibold">Blockchain Activity</p>

        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
          3 ALERTS
        </span>
      </div>

      {/* LIST */}
      <div className="px-5 py-3 space-y-5">

        <ActivityItem
          color="green"
          title="Blockchain Confirmation"
          desc="Garment #SE-9821 successfully minted"
          time="2m ago"
        />

        <ActivityItem
          color="yellow"
          title="Audit Required"
          desc="Manufacturer #Sthlm-01 uploaded new certificates"
          time="15m ago"
        />

        <ActivityItem
          color="blue"
          title="System Update"
          desc="Security patch deployed to node #9"
          time="1h ago"
        />
      </div>

      {/* FOOTER */}
      <div
        onClick={onOpenExplorer}
        className="text-center border-t py-3 text-xs text-green-700 font-semibold cursor-pointer hover:bg-gray-50"
      >
        VIEW SECURITY EXPLORER
      </div>
    </div>
  );
}

/* ================= ACTIVITY ITEM ================= */

function ActivityItem({ color, title, desc, time }: any) {
  const colors: any = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
  };

  return (
    <div className="flex justify-between items-start">

      {/* LEFT */}
      <div className="flex gap-3">

        <div className={`w-2.5 h-2.5 mt-2 rounded-full ${colors[color]}`} />

        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {desc}
          </p>
        </div>

      </div>

      {/* TIME */}
      <p className="text-[10px] text-gray-400 whitespace-nowrap">
        {time}
      </p>

    </div>
  );
}

/* ================= USER DROPDOWN ================= */

function UserDropdown({ onIdentityClick, onPrefsClick, onGasClick, onLogoutClick }: any) {
  return (
    <div className="absolute right-0 mt-3 w-[280px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">

      {/* TOP PROFILE */}
      <div className="p-4 border-b">

        <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wide">
          Authenticated Identity
        </p>

        <p className="text-sm font-semibold mt-1 truncate">
          kaushanibhagya9@gmail.com
        </p>

        {/* ACCESS BADGE */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border text-green-700 text-xs font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          LVL 4 ACCESS
        </div>
      </div>

      {/* MENU */}
      <div className="py-2 text-sm">
        <DropdownItem
          icon={<PersonOutlineOutlinedIcon />}
          label="Identity Controls"
          onClick={onIdentityClick}
        />
        <DropdownItem
          icon={<SettingsOutlinedIcon />}
          label="System Prefs"
          onClick={onPrefsClick}
        />
        <DropdownItem
          icon={<BoltOutlinedIcon />}
          label="Gas Credits"
          onClick={onGasClick}
        />
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* LOGOUT */}
      <div className="py-2">
        <div
          onClick={onLogoutClick}
          className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-gray-50"
        >
          <LogoutOutlinedIcon fontSize="small" />
          Log Out
        </div>
      </div>

    </div>
  );
}

function DropdownItem({ icon, label, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-50 hover:text-[#1B5E20]"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

/* ================= IDENTITY CONTROLS MODAL ================= */

function IdentityControlsModal({ onClose }: any) {
  const [tab, setTab] = useState("profile");

  return (
    <>
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[80]" />

      <div className="fixed inset-0 z-[90] flex items-center justify-center">
        <div className="w-[540px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center">
                <PersonOutlineOutlinedIcon fontSize="small" />
              </div>

              <div>
                <p className="text-sm font-bold">Identity Controls</p>
                <p className="text-xs text-gray-400">
                  Manage your blockchain identity
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>
          </div>

          <div className="px-6 border-b flex gap-8 text-xs font-bold text-gray-400">
            <Tab label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
            <Tab label="Security" active={tab === "security"} onClick={() => setTab("security")} />
            <Tab label="Key Pair" active={tab === "key"} onClick={() => setTab("key")} />
          </div>

          <div className="p-6 max-h-[560px] overflow-y-auto">
            {tab === "profile" && <IdentityProfile />}
            {tab === "security" && <IdentitySecurity />}
            {tab === "key" && <IdentityKeyPair />}
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-4">
            <button onClick={onClose} className="text-sm text-gray-500">
              Cancel
            </button>
            <button className="bg-[#1B5E20] text-white px-5 py-2 rounded-xl text-sm font-semibold">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Tab({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 ${
        active
          ? "border-[#1B5E20] text-[#1B5E20]"
          : "border-transparent text-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

function IdentityProfile() {
  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border rounded-xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center relative">
          <PersonOutlineOutlinedIcon />
          <span className="absolute -right-1 -bottom-1 w-5 h-5 bg-white border rounded-full flex items-center justify-center text-gray-500">
            <SettingsOutlinedIcon style={{ fontSize: 12 }} />
          </span>
        </div>

        <div>
          <p className="font-bold text-sm">Kaushanibhagya9</p>
          <p className="text-xs text-gray-400">kaushanibhagya9@gmail.com</p>
          <span className="mt-2 inline-flex px-2 py-1 rounded-md bg-green-50 border text-green-700 text-[10px] font-bold">
            Admin
          </span>
        </div>
      </div>

      <InputRow icon={<PersonOutlineOutlinedIcon />} label="FULL NAME" value="Kaushanibhagya9" />
      <InputRow icon={<MailOutlineOutlinedIcon />} label="EMAIL" value="kaushanibhagya9@gmail.com" />
      <InputRow icon={<PhoneOutlinedIcon />} label="PHONE" value="+46 70 000 0000" />
      <InputRow icon={<BusinessOutlinedIcon />} label="ORGANISATION" value="LOOPI Enterprise" />
    </div>
  );
}

function IdentitySecurity() {
  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold">Change Password</p>

      <PasswordRow label="CURRENT PASSWORD" />
      <PasswordRow label="NEW PASSWORD" />
      <PasswordRow label="CONFIRM PASSWORD" />

      <div className="border-t pt-5">
        <div className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400">TOTP via authenticator app</p>
          </div>

          <div className="w-11 h-6 bg-[#1B5E20] rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">Active Sessions</p>

        <SessionItem name="Chrome · Stockholm, SE" status="Current" sub="Now — Current" />
        <SessionItem name="Safari · Helsinki, FI" status="Revoke" sub="2 hours ago" danger />
      </div>
    </div>
  );
}

function IdentityKeyPair() {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex gap-3">
        <WarningAmberOutlinedIcon className="text-yellow-600" fontSize="small" />
        <p className="text-xs text-yellow-700 font-semibold leading-relaxed">
          Never share your private key. It grants full write access to the blockchain under your identity.
        </p>
      </div>

      <KeyInfo label="PUBLIC KEY" value="0x04a3f9...7e21b8" copy />
      <KeyInfo label="NODE ID" value="LOOPI-STHLM-ADM-01" />
      <KeyInfo label="KEY CREATED" value="Jan 14, 2025 • 09:41 UTC" />
      <KeyInfo label="LAST USED" value="Feb 21, 2026 • 14:22 UTC" />

      <button className="w-full border border-red-200 text-red-500 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50">
        <AutorenewOutlinedIcon fontSize="small" />
        Rotate Key Pair
      </button>
    </div>
  );
}

function InputRow({ icon, label, value }: any) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 tracking-widest mb-2">
        {label}
      </p>
      <div className="h-10 border rounded-lg bg-gray-50 flex items-center gap-3 px-3 text-sm text-gray-600">
        <span className="text-gray-300">{icon}</span>
        {value}
      </div>
    </div>
  );
}

function PasswordRow({ label }: any) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 tracking-widest mb-2">
        {label}
      </p>
      <div className="h-10 border rounded-lg bg-gray-50 flex items-center gap-3 px-3 text-sm text-gray-400">
        <LockOutlinedIcon fontSize="small" />
        <span className="flex-1">••••••••</span>
        <VisibilityOutlinedIcon fontSize="small" />
      </div>
    </div>
  );
}

function SessionItem({ name, sub, status, danger }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <LaptopMacOutlinedIcon className="text-gray-400" fontSize="small" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </div>

      <span
        className={`text-xs font-semibold ${
          danger ? "text-red-500" : "bg-green-50 text-green-700 px-2 py-1 rounded-md"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function KeyInfo({ label, value, copy }: any) {
  return (
    <div className="border-b pb-4">
      <div className="flex justify-between">
        <p className="text-[11px] font-bold text-gray-400 tracking-widest">
          {label}
        </p>
        {copy && (
          <button className="text-blue-600 text-xs font-semibold flex items-center gap-1">
            <ContentCopyOutlinedIcon style={{ fontSize: 13 }} />
            Copy
          </button>
        )}
      </div>
      <p className="text-sm font-semibold mt-2">{value}</p>
    </div>
  );
}

function SystemPreferencesModal({ onClose }: any) {
  const [theme, setTheme] = useState("light");
  const [density, setDensity] = useState("normal");

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[90]">
        <div className="w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center">
                <SettingsOutlinedIcon className="text-white" fontSize="small" />
              </div>

              <div>
                <p className="text-sm font-semibold">System Preferences</p>
                <p className="text-[11px] text-gray-400">
                  UI, language & notification settings
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>
          </div>

          {/* BODY */}
          <div className="px-5 py-4 space-y-5 max-h-[520px] overflow-y-auto">

            {/* APPEARANCE */}
            <Section title="APPEARANCE" />

            <div className="grid grid-cols-3 gap-3">
              <OptionCard
                active={theme === "light"}
                onClick={() => setTheme("light")}
                label="Light"
                icon={LightModeOutlinedIcon}
              />

              <OptionCard
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                label="Dark"
                icon={DarkModeOutlinedIcon}
              />

              <OptionCard
                active={theme === "auto"}
                onClick={() => setTheme("auto")}
                label="Auto"
                icon={DesktopWindowsOutlinedIcon}
              />
            </div>

            {/* DENSITY */}
            <Section title="LAYOUT DENSITY" />

            <div className="grid grid-cols-3 gap-3">
              <Density active={density === "compact"} label="Compact" />
              <Density active={density === "normal"} label="Normal" />
              <Density active={density === "spacious"} label="Spacious" />
            </div>

            {/* LANGUAGE */}
            <Section title="LANGUAGE & REGION" />

            <div className="h-10 border rounded-lg flex items-center gap-2 px-3 text-sm text-gray-500">
              <LanguageOutlinedIcon style={{ fontSize: 18 }} />
              Select language...
            </div>

            {/* NOTIFICATIONS */}
            <Section title="NOTIFICATIONS" />

            <CardGroup>
              <Toggle title="Daily Email Digest" sub="08:00 CET summary" />
              <Divider />
              <Toggle title="Push Alerts" sub="Critical events only" />
              <Divider />
              <Toggle title="Weekly Audit Exports" sub="PDF sent every Monday" disabled />
              <Divider />
              <Toggle title="Block Confirmation Alerts" sub="On every DPP mint" />
            </CardGroup>

            {/* INTERFACE */}
            <Section title="INTERFACE" />

            <CardGroup>
              <Toggle title="Motion & Animations" sub="Reduce for accessibility" />
              <Divider />
              <Toggle title="Inline Tooltips" sub="Hover hints across the UI" />
            </CardGroup>

          </div>

          {/* FOOTER */}
          <div className="px-5 py-3 border-t flex justify-end gap-3">
            <button className="text-sm text-gray-500">Cancel</button>
            <button className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

function Section({ title }: any) {
  return (
    <p className="text-[11px] font-bold text-gray-400 tracking-widest">
      {title}
    </p>
  );
}

function OptionCard({ active, label, icon: Icon, onClick }: any) {
  const iconColor =
    label === "Light"
      ? "#F59E0B" // yellow
      : label === "Dark"
      ? "#3B82F6" // blue (optional)
      : "#6B7280"; // default gray

  return (
    <div
      onClick={onClick}
      className={`h-[72px] flex flex-col items-center justify-center rounded-xl border text-sm cursor-pointer transition ${
        active
          ? "border-[#1B5E20] bg-green-50 text-[#1B5E20]"
          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Icon style={{ fontSize: 20, color: iconColor }} />
      <span className="mt-1 text-xs font-medium">{label}</span>
    </div>
  );
}

function Density({ active, label }: any) {
  return (
    <div
      className={`h-10 flex items-center justify-center rounded-lg border text-sm ${
        active
          ? "border-green-600 bg-green-50 text-green-700"
          : "bg-gray-50 text-gray-500"
      }`}
    >
      {label}
    </div>
  );
}

function CardGroup({ children }: any) {
  return (
    <div className="border rounded-xl bg-gray-50 overflow-hidden">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t" />;
}

function Toggle({ title, sub, disabled }: any) {
  const [on, setOn] = useState(!disabled);

  return (
    <div className="flex justify-between items-center px-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>

      <div
        onClick={() => !disabled && setOn(!on)}
        className={`w-10 h-5 rounded-full relative ${
          on ? "bg-green-600" : "bg-gray-300"
        } ${disabled && "opacity-50"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition ${
            on ? "right-0.5" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );
}

function GasCreditsModal({ onClose }: any) {
  const [amount, setAmount] = useState(500);

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[90]">
        <div className="w-[480px] max-w-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="px-5 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                <BoltOutlinedIcon />
              </div>

              <div>
                <p className="text-sm font-semibold">Gas Credits</p>
                <p className="text-xs text-gray-400">
                  LOOPI Enterprise Wallet
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <CloseOutlinedIcon />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* BALANCE CARD */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-5">
              <p className="text-xs opacity-80 tracking-widest">
                AVAILABLE BALANCE
              </p>

              <p className="text-2xl font-bold mt-1">
                4,285.50 <span className="text-lg font-medium">LOOPI</span>
              </p>

              <div className="border-t border-white/30 mt-4 pt-3 flex justify-between text-xs">
                <div>
                  <p className="opacity-70">THIS MONTH USED</p>
                  <p className="font-semibold">17.50 LOOPI</p>
                </div>

                <div>
                  <p className="opacity-70">WALLET ID</p>
                  <p className="font-semibold">LPIW-STHLM-001</p>
                </div>
              </div>
            </div>

            {/* USAGE */}
            <div>
              <p className="text-xs text-gray-400 font-bold tracking-widest mb-3">
                USAGE BREAKDOWN — FEB 2026
              </p>

              <UsageItem label="DPP Minting" value={8} color="bg-green-600" />
              <UsageItem label="User Provisioning" value={4} color="bg-blue-500" />
              <UsageItem label="Smart Contracts" value={3.5} color="bg-yellow-400" />
              <UsageItem label="Audit Operations" value={2} color="bg-purple-400" />
            </div>

            {/* TOP UP */}
            <div className="border rounded-xl p-3 bg-gray-50">
              <p className="text-sm font-semibold mb-3">Top Up Credits</p>

              <div className="flex gap-2 mb-3">
                {[100, 500, 1000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      amount === v
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}

                <button className="px-4 py-2 rounded-lg border text-sm bg-white text-gray-600">
                  Custom
                </button>
              </div>

              <div className="flex gap-3">
                <input
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />

                <button className="bg-blue-600 text-white px-4 rounded-lg text-sm">
                  Request Invoice
                </button>
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div>
              <p className="text-xs text-gray-400 font-bold tracking-widest mb-3">
                TRANSACTION HISTORY
              </p>

              <div className="border rounded-xl overflow-hidden">
                <TxItem title="DPP Mint — Garment #SE-9821" amount="-0.50" />
                <TxItem title="User Provision — U-004" amount="-1.00" />
                <TxItem title="Top-Up via Invoice" amount="+500.00" positive />
                <TxItem title="Smart Contract Deploy" amount="-12.00" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function UsageItem({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm">{label}</p>

      <div className="flex items-center gap-3">
        <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${value * 10}%` }} />
        </div>

        <p className="text-sm font-semibold w-16 text-right">
          {value.toFixed(2)} LOOPI
        </p>
      </div>
    </div>
  );
}

function TxItem({ title, amount, positive }: any) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b last:border-none">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-400">Feb 2026</p>
      </div>

      <p
        className={`text-sm font-semibold ${
          positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {amount}
      </p>
    </div>
  );
}

function LogoutConfirmModal({ onClose, onConfirm }: any) {
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity"
      />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-[90] px-4">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden animate-[fadeIn_0.2s_ease]">

          {/* HEADER */}
          <div className="px-6 py-4 border-b flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center">
              <LogoutOutlinedIcon fontSize="small" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Confirm Logout
              </p>
              <p className="text-xs text-gray-400">
                You are about to end your session
              </p>
            </div>
          </div>

          {/* BODY */}
          <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
            Are you sure you want to log out from your account?
            <span className="block text-xs text-gray-400 mt-2">
              You will need to sign in again to access your dashboard.
            </span>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">

            {/* CANCEL */}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* CONFIRM */}
            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-[0.97] transition"
            >
              Yes, Log Out
            </button>

          </div>
        </div>
      </div>
    </>
  );
}