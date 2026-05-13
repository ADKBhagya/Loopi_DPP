import { useEffect, useState } from "react";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ModalPortal from "../../../components/modals/ModalPortal";
import { apiFetch } from "../../../lib/api";

export default function ProofOfDelivery() {
  const [openExplorer, setOpenExplorer] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await apiFetch<any[]>("/logistics/proof-of-delivery");
        setRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("POD ERROR:", error);
        setRecords([]);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) =>
    [record.id, record.shipment, record.garment, record.recipient, record.hash]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] overflow-hidden">
      <div className="bg-white border border-gray-100 rounded-[32px] h-[410px] flex flex-col items-center justify-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 mt-5">
          <ShieldOutlinedIcon style={{ fontSize: 28 }} />
        </div>
        <h1 className="mt-7 text-[31px] font-bold text-[#111827]">
          Cryptographic Proof of Delivery
        </h1>
        <p className="text-gray-500 text-center mt-4 leading-8 text-[17px] max-w-[700px]">
          Access immutable records and digital signatures for all completed
          shipments in the <span className="font-bold text-[#1B5E20]">LOOPI network.</span>
        </p>
        <button
          onClick={() => setOpenExplorer(true)}
          className="mt-10 h-11 px-10 rounded-2xl bg-[#08152F] text-white text-sm font-bold tracking-[2px] shadow-xl hover:scale-[1.02] transition-all"
        >
          LAUNCH EXPLORER
        </button>
        <p className="mt-8 text-[11px] tracking-[2px] font-bold text-gray-300">
          {records.length} VERIFIED RECORDS AVAILABLE
        </p>
      </div>

      {openExplorer && (
        <ModalPortal>
          <>
            <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-[9998]" />
            <div className="fixed right-0 top-0 h-screen w-[500px] bg-[#F9FAFB] z-[9999] shadow-2xl border-l border-gray-200 flex flex-col">
              <div className="px-6 py-5 border-b border-gray-200 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#08152F] text-white flex items-center justify-center">
                      <ShieldOutlinedIcon style={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[20px] text-gray-900">
                        Proof of Delivery Explorer
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Immutable cryptographic signatures · LOOPI blockchain
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setOpenExplorer(false)} className="text-gray-400 hover:text-gray-700">
                    <CloseOutlinedIcon />
                  </button>
                </div>

                <div className="relative mt-5">
                  <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search POD ID, Shipment, Garment, Recipient..."
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No proof of delivery records found
                  </div>
                ) : (
                  filteredRecords.map((record) => {
                    const active = selectedId === record.id;

                    return (
                      <div
                        key={record.id}
                        className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                          active
                            ? "border-[#D4E7D7] bg-white shadow-sm"
                            : "border-transparent bg-white hover:border-gray-200"
                        }`}
                        onClick={() => setSelectedId(active ? null : record.id)}
                      >
                        <div className="p-4 flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] mt-2" />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-[15px] text-gray-800">
                                  {shortHash(record.hash)}
                                </p>
                                <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold">
                                  VERIFIED
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {record.id} · {record.shipment} ·{" "}
                                <span className="font-bold text-[#1B5E20]">{record.garment}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-[11px] font-bold text-gray-300">
                            {formatTime(record.signedAt)} UTC
                          </p>
                        </div>

                        {active && (
                          <div className="px-4 pb-4">
                            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
                              <InfoBox title="POD REFERENCE" value={record.id} />
                              <InfoBox title="RECIPIENT" value={record.recipient} />
                              <InfoBox title="SIGNED AT" value={formatDate(record.signedAt)} />
                              <InfoBox title="GARMENT ID" value={record.garment} />
                              <div className="col-span-2">
                                <InfoBox title="FULL BLOCKCHAIN HASH" value={record.hash} />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                              <button className="flex-1 h-11 rounded-xl bg-[#08152F] text-white text-xs font-bold tracking-[2px] flex items-center justify-center gap-2">
                                <DownloadOutlinedIcon style={{ fontSize: 18 }} />
                                DOWNLOAD SIGNATURE
                              </button>
                              <button className="w-12 h-11 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center">
                                <OpenInNewOutlinedIcon style={{ fontSize: 18 }} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="h-[70px] border-t border-gray-200 px-5 flex items-center justify-between bg-white">
                <p className="text-sm text-gray-400">
                  {filteredRecords.length} of {records.length} records · All verified
                </p>
                <button className="flex items-center gap-2 text-[#1B5E20] text-xs font-bold tracking-widest">
                  <DownloadOutlinedIcon style={{ fontSize: 18 }} />
                  DOWNLOAD ALL JSON
                </button>
              </div>
            </div>
          </>
        </ModalPortal>
      )}
    </div>
  );
}

function InfoBox({ title, value }: any) {
  return (
    <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">
      <p className="text-[10px] font-bold tracking-[1.5px] text-gray-400">{title}</p>
      <p className="mt-2 text-sm font-bold text-gray-800 break-all">{value}</p>
    </div>
  );
}

function shortHash(value?: string) {
  if (!value) return "Pending hash";
  return value.length > 18 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value;
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function formatTime(value?: string) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
