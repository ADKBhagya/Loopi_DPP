import { useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import WifiTetheringOutlinedIcon from "@mui/icons-material/WifiTetheringOutlined";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";

export default function FleetOverview() {

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  return (
    <div className="p-8 bg-[#F4F7FB] min-h-screen">

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-4 gap-5 mt-16">

        <StatCard
          title="ACTIVE VEHICLES"
          value="12"
          subtitle="10 in motion"
          icon={<LocalShippingOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-blue-50"
          color="text-blue-600"
        />

        <StatCard
          title="IN TRANSIT"
          value="24"
          subtitle="→ 8 EU hubs"
          icon={<MonitorHeartOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-orange-50"
          color="text-orange-500"
        />

        <StatCard
          title="DELIVERED TODAY"
          value="18"
          subtitle="↑ 6 since 6 AM"
          icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-green-50"
          color="text-green-600"
        />

        <StatCard
          title="DELAYED"
          value="3"
          subtitle="Action required"
          icon={<ErrorOutlineOutlinedIcon style={{ fontSize: 20 }} />}
          bg="bg-red-50"
          color="text-red-500"
        />
      </div>

      {/* ================= LIVE FLEET ================= */}

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

          <div>
            <h2 className="text-[23px] font-semibold text-gray-900">
              Live Fleet Monitor
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Real-time vehicle status across LOOPI logistics network
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold flex items-center gap-2 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              LIVE
            </div>

            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <RefreshOutlinedIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* LIST */}
        <div>

          <FleetRow
            expanded={expandedRow === "FL-STK-01"}
            onToggle={() =>
                setExpandedRow(
                expandedRow === "FL-STK-01" ? null : "FL-STK-01"
                )
            }
            icon={
              <LocalShippingOutlinedIcon
                style={{ fontSize: 20 }}
              />
            }
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            vehicle="FL-STK-01"
            status="IN TRANSIT"
            statusColor="bg-blue-100 text-blue-700"
            route="Stockholm → Hamburg · Driver: A. Lindqvist"
            location="Malmö, SE"
            progress="62%"
            progressWidth="62%"
            load="3/4 pallets"
            progressColor="bg-green-500"
          />

          <FleetRow
            expanded={expandedRow === "FL-AMS-02"}
            onToggle={() =>
                setExpandedRow(
                expandedRow === "FL-AMS-02" ? null : "FL-AMS-02"
                )
            }
            icon={
              <LocalShippingOutlinedIcon
                style={{ fontSize: 20 }}
              />
            }
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            vehicle="FL-AMS-02"
            status="IN TRANSIT"
            statusColor="bg-blue-100 text-blue-700"
            route="Amsterdam → Paris · Driver: L. de Vries"
            location="Brussels, BE"
            progress="81%"
            progressWidth="81%"
            load="2/4 pallets"
            progressColor="bg-green-500"
          />

          <FleetRow
            expanded={expandedRow === "FL-PRT-03"}
            onToggle={() =>
                setExpandedRow(
                expandedRow === "FL-PRT-03" ? null : "FL-PRT-03"
                )
            }
            icon={<NearMeOutlinedIcon style={{ fontSize: 20 }} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            vehicle="FL-PRT-03"
            status="DELIVERED"
            statusColor="bg-green-100 text-green-700"
            route="Porto → London · Driver: M. Costa"
            location="London, UK"
            progress="44%"
            progressWidth="44%"
            load="Full"
            progressColor="bg-orange-400"
          />

          <FleetRow
            expanded={expandedRow === "FL-IST-04"}
            onToggle={() =>
                setExpandedRow(
                expandedRow === "FL-IST-04" ? null : "FL-IST-04"
                )
            }
            icon={
              <WifiTetheringOutlinedIcon
                style={{ fontSize: 20 }}
              />
            }
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
            vehicle="FL-IST-04"
            status="DELAYED"
            statusColor="bg-red-100 text-red-600"
            route="Istanbul → Berlin · Driver: D. Yılmaz"
            location="Vienna, AT"
            progress="28%"
            progressWidth="28%"
            load="1/6 units"
            progressColor="bg-orange-400"
          />
        </div>
      </div>

      {/* ================= EVENTS ================= */}

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm p-6">

        <div className="flex items-center gap-2">

          <BoltOutlinedIcon
            className="text-blue-500"
            style={{ fontSize: 20 }}
          />

          <h2 className="text-[23px] font-semibold text-gray-900">
            Real-time Logistics Events
          </h2>
        </div>

        <div className="grid grid-cols-4 mt-10 relative">

          <div className="absolute top-[6px] left-0 right-0 h-[1px] bg-gray-200"></div>

          <EventItem
            color="bg-green-500"
            time="08:42"
            title="Stockholm Departure"
            subtitle="GP-9823 loaded on FL-STK-01"
          />

          <EventItem
            color="bg-green-500"
            time="13:15"
            title="Customs Clearance SE/DK"
            subtitle="Export documents verified"
          />

          <EventItem
            color="bg-blue-500"
            time="16:30"
            title="Current: Malmö"
            subtitle="ETA Hamburg: 6 hrs"
          />

          <EventItem
            color="bg-gray-300"
            time="PENDING"
            title="Warehouse Arrival"
            subtitle="Final confirmation needed"
            pending
          />
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
  color,
}: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">

      <div>
        <p className="text-[14px] font-bold tracking-widest text-gray-400">
          {title}
        </p>

        <h1 className="text-[24px] font-bold text-gray-900 mt-2 leading-none">
          {value}
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          {subtitle}
        </p>
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}

/* ================= FLEET ROW ================= */

function FleetRow({
  expanded,
  onToggle,
  icon,
  iconBg,
  iconColor,
  vehicle,
  status,
  statusColor,
  route,
  location,
  progress,
  progressWidth,
  load,
  progressColor,
}: any) {


  return (
    <div className="border-b border-gray-100 last:border-none">

      {/* MAIN ROW */}
      <div className="flex items-center justify-between px-6 py-5">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg} ${iconColor}`}
          >
            {icon}
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h3 className="font-bold text-gray-900 text-[15px]">
                {vehicle}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColor}`}
              >
                {status}
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {route}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-10">

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <LocationOnOutlinedIcon style={{ fontSize: 16 }} />
            {location}
          </div>

          <div className="flex items-center gap-3">

            <div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>{progress}</span>
              </div>

              <div className="w-28 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${progressColor}`}
                  style={{ width: progressWidth }}
                ></div>
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-widest font-bold text-gray-400">
                LOAD
              </p>

              <p className="text-sm font-bold text-gray-700">
                {load}
              </p>
            </div>

            {/* EXPAND BUTTON */}
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-700"
            >
              <KeyboardArrowDownOutlinedIcon
                style={{
                  fontSize: 20,
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s ease",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* EXPANDED SECTION */}
      {expanded && (
        <div className="px-6 pb-6">

          <div className="grid grid-cols-4 gap-4 mt-2">

            <InfoCard
              title="CURRENT BATCH"
              value="GP-9823"
            />

            <InfoCard
              title="GPS COORDINATES"
              value="55.6°N"
            />

            <InfoCard
              title="TRANSPORT MODE"
              value="Road"
            />

            <InfoCard
              title="FUEL LEVEL"
              value={progress}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-5">

            <button className="px-5 h-10 rounded-xl bg-[#1B5E20] text-white text-xs font-bold flex items-center gap-2 hover:opacity-90">
            <SensorsRoundedIcon style={{ fontSize: 15 }} />
            PING VEHICLE
            </button>

            <button className="px-5 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold flex items-center gap-2 hover:bg-gray-50">
              <LocationOnOutlinedIcon style={{ fontSize: 15 }} />
              VIEW ROUTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({ title, value }: any) {
  return (
    <div className="bg-[#F7F8FA] border border-gray-100 rounded-2xl p-4">

      <p className="text-[10px] font-bold tracking-widest text-gray-400">
        {title}
      </p>

      <p className="text-sm font-bold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
}

/* ================= EVENT ================= */

function EventItem({
  color,
  time,
  title,
  subtitle,
  pending,
}: any) {
  return (
    <div className="relative z-10">

      <div className={`w-3 h-3 rounded-full ${color} mb-5`}></div>

      <p className={`text-sm font-bold ${pending ? "text-gray-300" : "text-green-700"}`}>
        {time}
      </p>

      <h3 className={`mt-2 font-bold text-[15px] ${pending ? "text-gray-400" : "text-gray-900"}`}>
        {title}
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}