import { useState } from "react";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

export default function ProofOfDelivery() {

  const [openExplorer, setOpenExplorer] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const records = [
    {
      id: "POD-2201",
      shipment: "SH-4403",
      garment: "GP-9811",
      hash: "0x7f2a3c...B9C3F1",
      time: "14:22",
      recipient: "Hamburg Warehouse GmbH",
      signedAt: "Mar 18, 2026 · 14:22 UTC",
    },
    {
      id: "POD-2198",
      shipment: "SH-4399",
      garment: "GP-9801",
      hash: "0x3d1c8e...F7A04A",
      time: "09:11",
      recipient: "Berlin Retail Group",
      signedAt: "Mar 16, 2026 · 09:11 UTC",
    },
    {
      id: "POD-2195",
      shipment: "SH-4395",
      garment: "GP-9798",
      hash: "0x9b4e2a...22D18B",
      time: "16:44",
      recipient: "Nordic Textile Hub",
      signedAt: "Mar 14, 2026 · 16:44 UTC",
    },
    {
      id: "POD-2190",
      shipment: "SH-4390",
      garment: "GP-9790",
      hash: "0xA2c701...09F4E2",
      time: "11:05",
      recipient: "Paris Distribution Center",
      signedAt: "Mar 12, 2026 · 11:05 UTC",
    },
  ];

  const selectedRecord = records.find(
    (item) => item.id === selectedId
  );

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] p-8 overflow-hidden">

      {/* CENTER PANEL */}

      <div className="mt-16 bg-white border border-gray-100 rounded-[32px] h-[410px] flex flex-col items-center justify-center shadow-sm">

        <div className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 mt-5">
          <ShieldOutlinedIcon style={{ fontSize: 28 }} />
        </div>

        <h1 className="mt-7 text-[31px] font-bold text-[#111827]">
          Cryptographic Proof of Delivery
        </h1>

        <p className="text-gray-500 text-center mt-4 leading-8 text-[17px] max-w-[700px]">
          Access immutable records and digital signatures for all
          completed shipments in the <span className="font-bold text-[#1B5E20]">LOOPI network.</span>
        </p>

        <button
          onClick={() => setOpenExplorer(true)}
          className="mt-10 h-11 px-10 rounded-2xl bg-[#08152F] text-white text-sm font-bold tracking-[2px] shadow-xl hover:scale-[1.02] transition-all"
        >
          LAUNCH EXPLORER
        </button>

        <p className="mt-8 text-[11px] tracking-[2px] font-bold text-gray-300">
          5 VERIFIED RECORDS AVAILABLE
        </p>
      </div>

      {/* OVERLAY */}

      {openExplorer && (
        <>
          <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-40"></div>

          {/* SIDE PANEL */}

          <div className="fixed right-0 top-0 h-screen w-[500px] bg-[#F9FAFB] z-50 shadow-2xl border-l border-gray-200 flex flex-col">

            {/* HEADER */}

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

                <button
                  onClick={() => setOpenExplorer(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <CloseOutlinedIcon />
                </button>
              </div>

              {/* SEARCH */}

              <div className="relative mt-5">

                <SearchOutlinedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{ fontSize: 18 }}
                />

                <input
                  placeholder="Search POD ID, Shipment, Garment, Recipient..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm outline-none"
                />
              </div>
            </div>

            {/* LIST */}

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

              {records.map((record) => {

                const active = selectedId === record.id;

                return (
                  <div
                    key={record.id}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      active
                        ? "border-[#D4E7D7] bg-white shadow-sm"
                        : "border-transparent bg-white hover:border-gray-200"
                    }`}
                                        onClick={() =>
                    setSelectedId(
                        selectedId === record.id ? null : record.id
                    )
                    }
                  >

                    {/* TOP */}

                    <div className="p-4 flex items-start justify-between">

                      <div className="flex gap-3">

                        <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] mt-2"></div>

                        <div>

                          <div className="flex items-center gap-2 flex-wrap">

                            <p className="font-bold text-[15px] text-gray-800">
                              {record.hash}
                            </p>

                            <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold">
                              VERIFIED
                            </span>
                          </div>

                          <p className="text-sm text-gray-400 mt-1">
                            {record.id} · {record.shipment} ·{" "}
                            <span className="font-bold text-[#1B5E20]">
                              {record.garment}
                            </span>
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-gray-300">
                        {record.time} UTC
                      </p>
                    </div>

                    {/* EXPANDED */}

                    {active && (
                      <div className="px-4 pb-4">

                        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">

                          <InfoBox
                            title="POD REFERENCE"
                            value={record.id}
                          />

                          <InfoBox
                            title="RECIPIENT"
                            value={record.recipient}
                          />

                          <InfoBox
                            title="SIGNED AT"
                            value={record.signedAt}
                          />

                          <InfoBox
                            title="GARMENT ID"
                            value={record.garment}
                          />

                          <div className="col-span-2">
                            <InfoBox
                              title="FULL BLOCKCHAIN HASH"
                              value={record.hash}
                            />
                          </div>
                        </div>

                        {/* BUTTONS */}

                        <div className="flex items-center gap-3 mt-4">

                          <button className="flex-1 h-11 rounded-xl bg-[#08152F] text-white text-xs font-bold tracking-[2px] flex items-center justify-center gap-2">

                            <DownloadOutlinedIcon
                              style={{ fontSize: 18 }}
                            />

                            DOWNLOAD SIGNATURE
                          </button>

                          <button className="w-12 h-11 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center">
                            <OpenInNewOutlinedIcon
                              style={{ fontSize: 18 }}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}

            <div className="h-[70px] border-t border-gray-200 px-5 flex items-center justify-between bg-white">

              <p className="text-sm text-gray-400">
                5 of 5 records · All verified
              </p>

              <button className="flex items-center gap-2 text-[#1B5E20] text-xs font-bold tracking-widest">

                <DownloadOutlinedIcon style={{ fontSize: 18 }} />

                DOWNLOAD ALL JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= INFO BOX ================= */

function InfoBox({ title, value }: any) {
  return (
    <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">

      <p className="text-[10px] font-bold tracking-[1.5px] text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold text-gray-800 break-all">
        {value}
      </p>
    </div>
  );
}