import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../components/ui/TableContainer";
import { apiFetch } from "../../../lib/api";
import { downloadJsonFile } from "../../../lib/download";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import OpacityOutlinedIcon from "@mui/icons-material/OpacityOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";

const emptyStats = {
  pendingReviews: 0,
  activeAudits: 0,
  approvedMonth: 0,
  rejectedMonth: 0,
};

export default function AuditQueue() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [openReview, setOpenReview] = useState(false);
  const [audits, setAudits] = useState<any[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadQueue = () => {
    apiFetch<any>("/auditor/queue")
      .then((data) => {
        setAudits(data.audits || []);
        setStats(data.stats || emptyStats);
        setApiError("");
      })
      .catch((error) => {
        setApiError(error instanceof Error ? error.message : "Failed to load audit queue");
      });
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const filteredAudits = useMemo(() => {
    const query = search.toLowerCase();
    return audits.filter((audit) => {
      const matchesFilter = selectedFilter === "ALL" || audit.status === selectedFilter;
      const matchesSearch =
        !query ||
        audit.id?.toLowerCase().includes(query) ||
        audit.garment?.toLowerCase().includes(query) ||
        audit.manufacturer?.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [audits, search, selectedFilter]);

  const openAudit = (audit: any) => {
    setSelectedAudit(audit);
    setNotes("");
    setOpenReview(true);
  };

  const recordDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedAudit || saving) return;
    setSaving(true);
    try {
      await apiFetch(`/auditor/queue/${selectedAudit.id}`, {
        method: "PATCH",
        body: JSON.stringify({ decision, notes }),
      });
      setOpenReview(false);
      setSelectedAudit(null);
      loadQueue();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to update audit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {openReview && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />}

      <div className="space-y-6">
        {apiError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="PENDING REVIEWS" value={stats.pendingReviews} icon={<AccessTimeOutlinedIcon style={{ fontSize: 22 }} />} bg="bg-yellow-50" color="text-yellow-500" />
          <StatCard title="ACTIVE AUDITS" value={stats.activeAudits} icon={<MonitorHeartOutlinedIcon style={{ fontSize: 22 }} />} bg="bg-blue-50" color="text-blue-500" />
          <StatCard title="APPROVED (MO)" value={stats.approvedMonth} icon={<CheckCircleOutlineOutlinedIcon style={{ fontSize: 22 }} />} bg="bg-green-50" color="text-green-500" />
          <StatCard title="REJECTED (MO)" value={stats.rejectedMonth} icon={<HighlightOffOutlinedIcon style={{ fontSize: 22 }} />} bg="bg-red-50" color="text-red-500" />
        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col xl:flex-row gap-4 justify-between xl:items-start">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">Audit Verification Queue</h2>
              <p className="text-sm text-gray-400 mt-1">Verify sustainability claims and blockchain documentation</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {["ALL", "PENDING", "IN PROGRESS", "COMPLETED", "REJECTED"].map((filter) => (
                <FilterBtn key={filter} label={filter} active={selectedFilter === filter} onClick={() => setSelectedFilter(filter)} />
              ))}

              <div className="relative">
                <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ID, garment, manufacturer"
                  className="w-full sm:w-[230px] h-10 pl-10 pr-4 border rounded-xl text-sm outline-none bg-gray-50"
                />
              </div>
            </div>
          </div>

          <TableContainer>
            <table className="min-w-[1100px] w-full">
              <thead>
                <tr className="border-t border-b bg-gray-50/70">
                  {["AUDIT REF", "GARMENT ID", "MANUFACTURER", "AUDIT TYPE", "PRIORITY", "STATUS", "DATE", "ACTION"].map((heading) => (
                    <th key={heading} className={`px-6 py-5 text-[11px] tracking-widest text-gray-400 ${heading === "ACTION" ? "text-right" : "text-left"}`}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} className="border-b last:border-b-0 hover:bg-gray-50/40 transition">
                    <td className="px-6 py-6 text-sm font-bold text-gray-900">{audit.id}</td>
                    <td className="px-6 py-6 text-sm font-bold text-[#2563EB]">{audit.garment}</td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-semibold">{audit.manufacturer}</p>
                      <p className="text-xs text-gray-400 mt-1">{audit.company}</p>
                    </td>
                    <td className="px-6 py-6 text-sm font-semibold text-gray-800">{audit.type}</td>
                    <td className="px-6 py-6"><PriorityBadge priority={audit.priority} /></td>
                    <td className="px-6 py-6"><StatusBadge status={audit.status} /></td>
                    <td className="px-6 py-6 text-sm text-gray-500">{audit.date}</td>
                    <td className="px-6 py-6 text-right">
                      <button onClick={() => openAudit(audit)} className="h-9 px-5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold inline-flex items-center gap-2">
                        <RemoveRedEyeOutlinedIcon style={{ fontSize: 16 }} />
                        REVIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>

          <div className="px-6 py-4 flex justify-between items-center">
            <p className="text-xs text-gray-400">{filteredAudits.length} audits shown</p>
            <button
              onClick={() => downloadJsonFile("auditor-queue.json", filteredAudits)}
              className="flex items-center gap-2 text-[#166534] text-xs font-bold"
            >
              <DownloadOutlinedIcon style={{ fontSize: 16 }} />
              EXPORT
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[590px] bg-white z-[90] shadow-[-10px_0_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-y-auto ${openReview ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 py-5 border-b flex justify-between items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 text-[11px] font-bold">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              IN REVIEW SESSION
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center">
                <FileCopyOutlinedIcon />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">Audit: {selectedAudit?.id || "AUDIT"}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Garment: <span className="text-[#166534] font-semibold ml-1">{selectedAudit?.garment || "Passport"}</span> · {selectedAudit?.type || "Review"}
                </p>
              </div>
            </div>
          </div>

          <button onClick={() => setOpenReview(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <CloseOutlinedIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Section title="AUDIT OVERVIEW">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="MANUFACTURER" value={selectedAudit?.manufacturer || "Manufacturer"} />
              <InfoCard label="SUBMITTED BY" value={selectedAudit?.submittedBy || selectedAudit?.company || "Participant"} />
              <InfoCard label="PRIORITY" value={selectedAudit?.priority || "Medium"} />
              <InfoCard label="SUBMITTED" value={selectedAudit?.date || "Pending"} />
            </div>
          </Section>

          <Section title="EMISSIONS & SUSTAINABILITY">
            <MetricCard icon={<EnergySavingsLeafOutlinedIcon />} title="Carbon Footprint" value={selectedAudit?.emissions?.carbon || "Not declared"} green />
            <MetricCard icon={<OpacityOutlinedIcon />} title="Water Consumption" value={selectedAudit?.emissions?.water || "Not declared"} blue />
          </Section>

          <Section title="COMPLIANCE CERTIFICATES">
            {(selectedAudit?.certificates?.length ? selectedAudit.certificates : [{ title: "No certificate attached", sub: "Awaiting manufacturer upload", status: "PENDING" }]).map((certificate: any, index: number) => (
              <CertificateCard key={`${certificate.title}-${index}`} title={certificate.title} sub={certificate.sub} status={certificate.status} warning={certificate.status !== "VERIFIED"} />
            ))}
          </Section>

          <Section title="AUDITOR NOTES">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add your review notes here..."
              className="w-full h-[120px] border rounded-2xl bg-gray-50 p-4 text-sm outline-none resize-none"
            />
          </Section>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-4 z-20">
          <button onClick={() => recordDecision("REJECTED")} disabled={saving} className="flex-1 h-14 rounded-2xl border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 disabled:opacity-60">
            REJECT AUDIT
          </button>
          <button onClick={() => recordDecision("APPROVED")} disabled={saving} className="flex-1 h-14 rounded-2xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm disabled:opacity-60">
            {saving ? "SAVING..." : "FINALISE & APPROVE"}
          </button>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, border, bg, color }: any) {
  return (
    <div className={`bg-white rounded-[24px] border ${border} px-6 py-6 flex justify-between items-center shadow-sm`}>
      <div>
        <p className="text-[11px] tracking-widest text-gray-400 font-bold">{title}</p>
        <h2 className="text-[24px] font-bold text-gray-900 mt-2">{value}</h2>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`h-9 px-4 rounded-xl text-xs font-bold transition ${active ? "bg-[#0F172A] text-white" : "border bg-white text-gray-500 hover:bg-gray-50"}`}>
      {label}
    </button>
  );
}

function PriorityBadge({ priority }: any) {
  const styles: any = {
    HIGH: "bg-red-50 text-red-500 border border-red-200",
    MEDIUM: "bg-orange-50 text-orange-500 border border-orange-200",
    LOW: "bg-blue-50 text-blue-500 border border-blue-200",
  };

  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${styles[priority] || styles.MEDIUM}`}>{priority}</span>;
}

function StatusBadge({ status }: any) {
  const styles: any = {
    PENDING: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    "IN PROGRESS": "bg-blue-50 text-blue-600 border border-blue-200",
    COMPLETED: "bg-green-50 text-green-600 border border-green-200",
    REJECTED: "bg-red-50 text-red-500 border border-red-200",
  };

  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${styles[status] || styles.PENDING}`}>• {status}</span>;
}

function Section({ title, children }: any) {
  return (
    <div className="bg-gray-50 rounded-[28px] p-5">
      <p className="text-[11px] tracking-widest text-gray-400 font-bold mb-5">{title}</p>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: any) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <p className="text-[11px] tracking-widest text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function MetricCard({ icon, title, value, green }: any) {
  return (
    <div className={`rounded-2xl border p-5 flex items-center justify-between mb-4 last:mb-0 ${green ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
      <div className="flex items-center gap-3">
        <div className={green ? "text-green-600" : "text-blue-500"}>{icon}</div>
        <p className="font-semibold text-gray-800">{title}</p>
      </div>
      <p className={`font-bold text-lg ${green ? "text-green-600" : "text-blue-500"}`}>{value}</p>
    </div>
  );
}

function CertificateCard({ title, sub, status, warning }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 mb-4 last:mb-0 flex justify-between items-center">
      <div className="flex items-start gap-4">
        <div className="text-gray-400"><FileCopyOutlinedIcon /></div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${warning ? "bg-yellow-50 text-yellow-600 border border-yellow-200" : "bg-green-50 text-green-600 border border-green-200"}`}>{status}</span>
        <button className="text-gray-300 hover:text-gray-600"><OpenInNewOutlinedIcon style={{ fontSize: 18 }} /></button>
      </div>
    </div>
  );
}
