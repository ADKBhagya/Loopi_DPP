import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

type ScanRow = {
  id: string;
  status: string;
  time: string;
  color: string;
  bg: string;
};

export default function PassportScanner() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passportId, setPassportId] = useState("");
  const [recentScans, setRecentScans] = useState<ScanRow[]>([]);
  const [message, setMessage] = useState("");

  const loadAuditScans = async () => {
    try {
      const data = await apiFetch<any>("/retailer/audit-trail");
      const scans = (data.logs || [])
        .filter((log: any) => log.type === "scan")
        .slice(0, 6)
        .map((log: any) => ({
          id: log.passport || "N/A",
          status: "VERIFIED",
          time: new Date(log.date).toLocaleString(),
          color: "#16A34A",
          bg: "#EAF7EE",
        }));
      setRecentScans(scans);
    } catch {
      setRecentScans([]);
    }
  };

  useEffect(() => {
    loadAuditScans();
  }, []);

  const startScan = () => {
    setScannerOpen(true);
    setLoading(false);
    setMessage("");
  };

  const simulateScan = async () => {
    try {
      setLoading(true);
      const input = passportId.trim();
      const data = await apiFetch<any>("/retailer/passport/scan", {
        method: "POST",
        body: JSON.stringify({ passportId: input, scanSource: "passport-scanner" }),
      });

      const scan = data.scan;
      setRecentScans((current) => [
        {
          id: scan.passport,
          status: scan.status || "VERIFIED",
          time: new Date(scan.scannedAt || Date.now()).toLocaleString(),
          color: "#16A34A",
          bg: "#EAF7EE",
        },
        ...current,
      ].slice(0, 6));
      setMessage(`${scan.passport} verified on blockchain`);
      setSuccess(true);
      setScannerOpen(false);
      setPassportId("");
    } catch (error: any) {
      setMessage(error.message || "Passport scan failed");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#ECECEC] rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="h-[320px] flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF7F1] text-[#166B2D] flex items-center justify-center">
            <QrCodeScannerRoundedIcon style={{ fontSize: 30 }} />
          </div>
          <h1 className="text-[24px] font-bold text-[#1B1F28] mt-6">Passport Scanner</h1>
          <p className="max-w-[450px] text-[#9CA3AF] leading-relaxed mt-3">
            Scan any LOOPI garment passport to instantly verify Digital Product Passport authenticity.
          </p>
          <button
            onClick={startScan}
            className="mt-7 h-[46px] px-9 rounded-2xl bg-[#166B2D] text-white text-sm font-bold tracking-[0.14em] flex items-center gap-3 hover:scale-[1.01] transition-all shadow-[0_10px_30px_rgba(22,107,45,0.25)]"
          >
            <QrCodeScannerRoundedIcon />
            OPEN SCANNER
          </button>
          <p className="mt-5 text-[10px] tracking-[0.16em] text-[#B3B8C2] font-bold">BLOCKCHAIN VERIFIED ACCESS</p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-[#DDEADF] bg-[#F4FBF6] px-5 py-3 text-sm font-semibold text-[#166B2D]">
          {message}
        </div>
      )}

      <div className="bg-white border border-[#ECECEC] rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="h-[72px] px-6 border-b border-[#F3F4F6] flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">Recent Scans</h2>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Latest blockchain passport validations</p>
          </div>
          <button
            onClick={loadAuditScans}
            className="w-10 h-10 rounded-2xl border border-[#ECECEC] bg-white flex items-center justify-center hover:bg-[#FAFAFA] transition-all"
          >
            <AutorenewRoundedIcon style={{ fontSize: 18, color: "#9CA3AF" }} />
          </button>
        </div>

        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] px-6 py-3 border-b border-[#F5F5F5] text-[10px] tracking-[0.14em] uppercase text-[#B0B7C3] font-bold">
          <div>Passport</div>
          <div>Status</div>
          <div>Timestamp</div>
          <div className="text-right">Result</div>
        </div>

        <div>
          {recentScans.map((scan, index) => (
            <div key={`${scan.id}-${index}`} className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center px-6 h-[74px] border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F4F7FA] flex items-center justify-center">
                  <Inventory2OutlinedIcon style={{ fontSize: 18, color: "#9CA3AF" }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#111827]">{scan.id}</p>
                  <p className="text-[11px] text-[#A1A7B3] mt-1">LOOPI Passport</p>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center h-7 px-3 rounded-xl text-[10px] font-bold tracking-[0.10em]" style={{ color: scan.color, background: scan.bg }}>
                  {scan.status}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                <AccessTimeRoundedIcon style={{ fontSize: 15 }} />
                {scan.time}
              </div>
              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-xl bg-[#EAF7EE] flex items-center justify-center">
                  <CheckCircleRoundedIcon style={{ color: "#16A34A", fontSize: 20 }} />
                </div>
              </div>
            </div>
          ))}
          {recentScans.length === 0 && (
            <div className="px-6 py-10 text-sm text-[#9CA3AF]">No passport scans recorded yet.</div>
          )}
        </div>
      </div>

      {scannerOpen && (
        <>
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9998]" />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="w-full max-w-[350px] rounded-[30px] overflow-hidden bg-[#166B2D] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="px-6 pt-6 flex items-start justify-between">
                <div>
                  <h2 className="text-white text-[20px] font-bold">Passport Scanner</h2>
                  <p className="text-[#B7D8BF] text-[10px] tracking-[0.12em] font-bold mt-1">RETAIL NODE</p>
                </div>
                <button onClick={() => setScannerOpen(false)} className="text-white/70 hover:text-white">
                  <CloseRoundedIcon />
                </button>
              </div>

              <div className="px-5 pt-5">
                <div className="relative h-[280px] rounded-[24px] border border-[#3B7F4A] bg-[#0D4D16] overflow-hidden">
                  <div className="absolute top-4 left-4 w-9 h-9 border-l-4 border-t-4 border-[#52F27C] rounded-tl-2xl" />
                  <div className="absolute top-4 right-4 w-9 h-9 border-r-4 border-t-4 border-[#52F27C] rounded-tr-2xl" />
                  <div className="absolute bottom-4 left-4 w-9 h-9 border-l-4 border-b-4 border-[#52F27C] rounded-bl-2xl" />
                  <div className="absolute bottom-4 right-4 w-9 h-9 border-r-4 border-b-4 border-[#52F27C] rounded-br-2xl" />
                  {!loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
                      <QrCodeScannerRoundedIcon style={{ fontSize: 54, color: "rgba(255,255,255,0.25)" }} />
                      <input
                        value={passportId}
                        onChange={(event) => setPassportId(event.target.value)}
                        placeholder="Passport ID or Garment ID"
                        className="w-full h-11 rounded-xl border border-white/20 bg-white/95 px-4 text-sm outline-none"
                      />
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full border-[4px] border-[#52F27C]/30 border-t-[#52F27C] animate-spin" />
                      <p className="text-[#52F27C] text-[11px] tracking-[0.12em] font-bold mt-5">QUERYING BLOCKCHAIN...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <button
                  onClick={simulateScan}
                  disabled={loading || !passportId.trim()}
                  className="w-full h-[54px] rounded-2xl bg-white text-[#166B2D] font-bold tracking-[0.12em] text-sm flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <QrCodeScannerRoundedIcon style={{ fontSize: 20 }} />
                  SCAN PASSPORT
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {success && (
        <div className="fixed top-5 right-5 z-[200] min-w-[300px] rounded-2xl border border-[#BFE3C8] bg-[#EEF8F1] shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#DDF5E4] flex items-center justify-center text-[#16A34A]">
            <QrCodeScannerRoundedIcon />
          </div>
          <div>
            <p className="font-bold text-[#166B2D] text-sm">Passport Scan Successful</p>
            <p className="text-[#166B2D] text-xs mt-1">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
