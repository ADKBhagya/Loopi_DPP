import { useEffect, useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import { apiFetch } from "../../../lib/api";

export default function FleetOverview() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({
    activeVehicles: 0,
    inTransit: 0,
    deliveredToday: 0,
    delayed: 0,
  });
  const [fleet, setFleet] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const fetchOverview = async () => {
    try {
      const data = await apiFetch("/logistics/overview");
      setStats(data.stats || {});
      setFleet(Array.isArray(data.fleet) ? data.fleet : []);
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (error) {
      console.error("LOGISTICS OVERVIEW ERROR:", error);
      setFleet([]);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="bg-[#F4F7FB] min-h-screen">
      <div className="grid grid-cols-4 gap-5">
        <StatCard title="ACTIVE VEHICLES" value={stats.activeVehicles || 0} subtitle="Live logistics nodes" icon={<LocalShippingOutlinedIcon style={{ fontSize: 20 }} />} bg="bg-blue-50" color="text-blue-600" />
        <StatCard title="IN TRANSIT" value={stats.inTransit || 0} subtitle={`${stats.activeRoutes || 0} active routes`} icon={<MonitorHeartOutlinedIcon style={{ fontSize: 20 }} />} bg="bg-orange-50" color="text-orange-500" />
        <StatCard title="DELIVERED TODAY" value={stats.deliveredToday || 0} subtitle="Confirmed records" icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 20 }} />} bg="bg-green-50" color="text-green-600" />
        <StatCard title="DELAYED" value={stats.delayed || 0} subtitle="Action required" icon={<ErrorOutlineOutlinedIcon style={{ fontSize: 20 }} />} bg="bg-red-50" color="text-red-500" />
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[23px] font-semibold text-gray-900">Live Fleet Monitor</h2>
            <p className="text-sm text-gray-400 mt-1">Real-time vehicle status across LOOPI logistics network</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold flex items-center gap-2 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              LIVE
            </div>
            <button onClick={fetchOverview} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <RefreshOutlinedIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {fleet.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400">No fleet records found</div>
        ) : (
          fleet.map((item) => (
            <FleetRow
              key={item.vehicleId}
              expanded={expandedRow === item.vehicleId}
              onToggle={() => setExpandedRow(expandedRow === item.vehicleId ? null : item.vehicleId)}
              vehicle={item.vehicleId}
              status={formatStatus(item.status)}
              statusColor={statusColor(item.status)}
              route={item.route}
              location={item.location}
              progress={`${item.progress || 0}%`}
              progressWidth={`${item.progress || 0}%`}
              load={item.load}
              progressColor={item.status === "delayed" ? "bg-orange-400" : "bg-green-500"}
              garment={item.garment}
              transport={item.transport}
            />
          ))
        )}
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-center gap-2">
          <BoltOutlinedIcon className="text-blue-500" style={{ fontSize: 20 }} />
          <h2 className="text-[23px] font-semibold text-gray-900">Real-time Logistics Events</h2>
        </div>
        <div className="grid grid-cols-4 mt-10 relative">
          <div className="absolute top-[6px] left-0 right-0 h-[1px] bg-gray-200" />
          {(events.length ? events : [{ time: "PENDING", title: "Awaiting logistics events", subtitle: "No shipment activity yet", status: "pending" }]).slice(0, 4).map((event, index) => (
            <EventItem
              key={`${event.title}-${index}`}
              color={event.status === "delayed" ? "bg-orange-400" : event.status === "pending" ? "bg-gray-300" : "bg-green-500"}
              time={event.time}
              title={event.title}
              subtitle={event.subtitle}
              pending={event.status === "pending"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, bg, color }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[14px] font-bold tracking-widest text-gray-400">{title}</p>
        <h1 className="text-[24px] font-bold text-gray-900 mt-2 leading-none">{value}</h1>
        <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
    </div>
  );
}

function FleetRow({ expanded, onToggle, vehicle, status, statusColor, route, location, progress, progressWidth, load, progressColor, garment, transport }: any) {
  return (
    <div className="border-b border-gray-100 last:border-none">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
            <LocalShippingOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-gray-900 text-[15px]">{vehicle}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>{status}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{route}</p>
          </div>
        </div>
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
                <div className={`h-full rounded-full ${progressColor}`} style={{ width: progressWidth }} />
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-widest font-bold text-gray-400">LOAD</p>
              <p className="text-sm font-bold text-gray-700">{load || "N/A"}</p>
            </div>
            <button onClick={onToggle} className="text-gray-400 hover:text-gray-700">
              <KeyboardArrowDownIcon expanded={expanded} />
            </button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-4 gap-4 mt-2">
            <InfoCard title="CURRENT BATCH" value={garment || "N/A"} />
            <InfoCard title="GPS COORDINATES" value={location || "N/A"} />
            <InfoCard title="TRANSPORT MODE" value={transport || "Road"} />
            <InfoCard title="PROGRESS" value={progress} />
          </div>
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

function KeyboardArrowDownIcon({ expanded }: any) {
  return (
    <KeyboardArrowDownOutlinedIcon
      style={{
        fontSize: 20,
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "0.2s ease",
      }}
    />
  );
}

function InfoCard({ title, value }: any) {
  return (
    <div className="bg-[#F7F8FA] border border-gray-100 rounded-2xl p-4">
      <p className="text-[10px] font-bold tracking-widest text-gray-400">{title}</p>
      <p className="text-sm font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function EventItem({ color, time, title, subtitle, pending }: any) {
  return (
    <div className="relative z-10">
      <div className={`w-3 h-3 rounded-full ${color} mb-5`} />
      <p className={`text-sm font-bold ${pending ? "text-gray-300" : "text-green-700"}`}>{time}</p>
      <h3 className={`mt-2 font-bold text-[15px] ${pending ? "text-gray-400" : "text-gray-900"}`}>{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function formatStatus(status: string) {
  return (status || "in_transit").replace(/_/g, " ").toUpperCase();
}

function statusColor(status: string) {
  if (status === "delivered") return "bg-green-100 text-green-700";
  if (status === "delayed") return "bg-red-100 text-red-600";
  return "bg-blue-100 text-blue-700";
}
