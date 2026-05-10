import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ICONS */
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

interface Props {
  title?: string;
  onMenuClick?: () => void;
  onOpenExplorer?: () => void;
}

export default function Topbar({
  title,
  onMenuClick,
}: Props) {

  const navigate = useNavigate();

  const [showNotif, setShowNotif] =
    useState(false);

  const [showUser, setShowUser] =
    useState(false);

  const [showIdentityModal, setShowIdentityModal] =
    useState(false);

  const [showPrefs, setShowPrefs] =
    useState(false);

  const [showGas, setShowGas] =
    useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  const [showToast] =
    useState(false);

  const fullName =
    localStorage.getItem("fullName") || "User";

  const role =
    localStorage.getItem("userRole") || "Role";

  return (
    <>
      <header
        className="
          fixed top-0 right-0 left-0 lg:left-[210px]
          h-[72px]
          bg-white border-b border-gray-100
          flex items-center justify-between
          px-4 lg:px-6
          z-40
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* MOBILE MENU */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              w-10 h-10 rounded-xl
              border border-gray-200
              flex items-center justify-center
              text-gray-600
            "
          >
            <MenuOutlinedIcon />
          </button>

          {/* SEARCH */}
          <div className="relative hidden md:block">

            <SearchOutlinedIcon
              className="
                absolute left-3 top-1/2
                -translate-y-1/2 text-gray-400
              "
            />

            <input
              placeholder="Search Passport ID, Batch or Batch ID..."
              className="
                w-[320px] xl:w-[380px]
                h-10
                pl-10 pr-4
                rounded-xl border
                bg-gray-50
                text-sm outline-none
                focus:border-[#1B5E20]
              "
            />

          </div>

          {/* MOBILE TITLE */}
          <h2
            className="
              md:hidden
              text-sm font-bold text-gray-800
            "
          >
            {title}
          </h2>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* STATUS */}
          <div
            className="
              hidden sm:flex
              px-4 py-2
              rounded-full
              bg-green-50 border
              text-green-600
              text-xs font-bold
            "
          >
            ● MAINNET ONLINE
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative">

            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowUser(false);
              }}
              className="
                relative
                w-10 h-10
                rounded-xl border border-gray-200
                flex items-center justify-center
                text-gray-500
                hover:bg-gray-50
              "
            >

              <NotificationsNoneOutlinedIcon
                style={{ fontSize: 20 }}
              />

              <span
                className="
                  absolute top-2 right-2
                  w-2 h-2
                  bg-red-500 rounded-full
                "
              />

            </button>

            {showNotif && (
              <NotificationDropdown />
            )}

          </div>

          {/* USER */}
          <div className="relative">

            <button
              onClick={() => {
                setShowUser(!showUser);
                setShowNotif(false);
              }}
              className="
                flex items-center gap-2 lg:gap-3
                border rounded-xl
                px-2 lg:px-3
                h-11
                hover:bg-gray-50
              "
            >

              {/* USER INFO */}
              <div className="hidden sm:block text-right">

                <p className="text-xs font-bold">
                  {fullName}
                </p>

                <p
                  className="
                    text-[10px]
                    text-gray-400 uppercase
                  "
                >
                  {role}
                </p>

              </div>

              {/* AVATAR */}
              <div
                className="
                  w-9 h-9
                  bg-[#1B5E20]
                  rounded-xl
                  flex items-center justify-center
                  text-white
                "
              >
                <PersonOutlineOutlinedIcon />
              </div>

              <KeyboardArrowDownOutlinedIcon
                className="hidden sm:block"
              />

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

      </header>

      {/* MODALS */}
      {showIdentityModal && (
        <IdentityControlsModal
          onClose={() => setShowIdentityModal(false)}
        />
      )}

      {showPrefs && (
        <SystemPreferencesModal
          onClose={() => setShowPrefs(false)}
        />
      )}

      {showGas && (
        <GasCreditsModal
          onClose={() => setShowGas(false)}
        />
      )}

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            localStorage.clear();
            navigate("/");
          }}
        />
      )}

      {/* TOAST */}
      {showToast && (
        <div
          className="
            fixed top-20 right-6
            bg-white border border-gray-100
            shadow-xl rounded-xl
            px-4 py-3
            flex items-center gap-3
            z-[100]
          "
        >

          <CheckCircleIcon
            className="text-green-500"
          />

          <p className="text-sm font-medium">
            Node Synced — Block #8,442,109
          </p>

        </div>
      )}
    </>
  );
}

/* ================= NOTIFICATION DROPDOWN ================= */

function NotificationDropdown() {
  return (
    <div
      className="
        absolute right-0 top-14
        w-[340px]
        bg-white rounded-2xl
        shadow-xl border border-gray-100
        z-50
      "
    >

      <div
        className="
          flex justify-between items-center
          px-5 py-4 border-b
        "
      >

        <p className="text-sm font-semibold">
          Blockchain Activity
        </p>

        <span
          className="
            text-[10px]
            bg-green-100 text-green-700
            px-2 py-1 rounded-full
            font-semibold
          "
        >
          3 ALERTS
        </span>

      </div>

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
          desc="Manufacturer uploaded certificates"
          time="15m ago"
        />

      </div>

    </div>
  );
}

function ActivityItem({
  color,
  title,
  desc,
  time,
}: any) {

  const colors: any = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
  };

  return (
    <div className="flex justify-between items-start">

      <div className="flex gap-3">

        <div
          className={`
            w-2.5 h-2.5 mt-2 rounded-full
            ${colors[color]}
          `}
        />

        <div>

          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="text-xs text-gray-500 leading-relaxed">
            {desc}
          </p>

        </div>

      </div>

      <p
        className="
          text-[10px]
          text-gray-400 whitespace-nowrap
        "
      >
        {time}
      </p>

    </div>
  );
}

/* ================= USER DROPDOWN ================= */

function UserDropdown({
  onIdentityClick,
  onPrefsClick,
  onGasClick,
  onLogoutClick,
}: any) {

  return (
    <div
      className="
        absolute right-0 mt-3
        w-[280px]
        bg-white border border-gray-100
        rounded-2xl shadow-xl
        z-50 overflow-hidden
      "
    >

      {/* TOP */}
      <div className="p-4 border-b">

        <p
          className="
            text-[11px]
            text-gray-400 uppercase
            font-semibold tracking-wide
          "
        >
          Authenticated Identity
        </p>

        <p className="text-sm font-semibold mt-1 truncate">
          kaushanibhagya9@gmail.com
        </p>

        <div
          className="
            mt-3 inline-flex items-center gap-2
            px-3 py-1 rounded-full
            bg-green-50 border
            text-green-700 text-xs font-semibold
          "
        >

          <span className="w-2 h-2 bg-green-500 rounded-full" />

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

      {/* LOGOUT */}
      <div className="border-t py-2">

        <div
          onClick={onLogoutClick}
          className="
            flex items-center gap-3
            px-4 py-2
            text-sm text-red-500
            cursor-pointer
            hover:bg-gray-50
          "
        >

          <LogoutOutlinedIcon fontSize="small" />

          Log Out

        </div>

      </div>

    </div>
  );
}

/* ================= DROPDOWN ITEM ================= */

function DropdownItem({
  icon,
  label,
  onClick,
}: any) {

  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3
        px-4 py-2
        text-gray-600 cursor-pointer
        hover:bg-gray-50
        hover:text-[#1B5E20]
      "
    >

      {icon}

      <span>{label}</span>

    </div>
  );
}

/* ================= MODALS ================= */

function IdentityControlsModal({ onClose }: any) {
  return (
    <ModalWrapper title="Identity Controls" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Manage blockchain identity controls.
      </p>
    </ModalWrapper>
  );
}

function SystemPreferencesModal({ onClose }: any) {
  return (
    <ModalWrapper title="System Preferences" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Configure your UI and system settings.
      </p>
    </ModalWrapper>
  );
}

function GasCreditsModal({ onClose }: any) {
  return (
    <ModalWrapper title="Gas Credits" onClose={onClose}>
      <div className="space-y-4">

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-600">
            AVAILABLE BALANCE
          </p>

          <p className="text-2xl font-bold mt-1">
            4,285.50 LOOPI
          </p>
        </div>

        <button
          className="
            w-full bg-blue-600 text-white
            rounded-xl py-3 text-sm font-semibold
          "
        >
          Request Invoice
        </button>

      </div>
    </ModalWrapper>
  );
}

function LogoutConfirmModal({
  onClose,
  onConfirm,
}: any) {
  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/40
          backdrop-blur-sm
          z-[80]
        "
      />

      <div
        className="
          fixed inset-0
          flex items-center justify-center
          z-[90]
        "
      >

        <div
          className="
            w-[400px]
            bg-white rounded-2xl
            shadow-2xl overflow-hidden
          "
        >

          <div className="p-6 border-b">

            <h2 className="text-lg font-bold">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to logout?
            </p>

          </div>

          <div className="p-6 flex justify-end gap-3">

            <button
              onClick={onClose}
              className="
                px-4 py-2 border rounded-lg
                text-sm
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="
                px-4 py-2 bg-red-500
                text-white rounded-lg
                text-sm font-semibold
              "
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

function ModalWrapper({
  title,
  onClose,
  children,
}: any) {

  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/40
          backdrop-blur-sm
          z-[80]
        "
      />

      <div
        className="
          fixed inset-0
          flex items-center justify-center
          z-[90]
          px-4
        "
      >

        <div
          className="
            w-full max-w-[520px]
            bg-white rounded-2xl
            shadow-2xl overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              px-5 py-4 border-b
              flex justify-between items-center
            "
          >

            <h2 className="text-lg font-bold">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-lg
                hover:bg-gray-100
                flex items-center justify-center
              "
            >
              <CloseOutlinedIcon />
            </button>

          </div>

          {/* BODY */}
          <div className="p-5">
            {children}
          </div>

        </div>

      </div>
    </>
  );
}