import { useState } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";

import QRScanOverlay from "./QRScanOverlay";

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onScan: () => void;
}

export default function QRScannerModal({
  open,
  onClose,
  onScan,
}: Props) {

  const [scanning, setScanning] =
    useState(false);

  if (!open) return null;

  const handleSimulateScan = () => {

    if (scanning) return;

    setScanning(true);

    setTimeout(() => {

      setScanning(false);

      onScan();

    }, 2200);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="
          fixed inset-0
          bg-black/55
          backdrop-blur-md
          z-[120]
        "
      />

      {/* MODAL */}
      <div
        className="
          fixed inset-0
          flex items-center justify-center
          z-[130]
          p-4
        "
      >

        <div
          className="
            w-full max-w-[360px]
            rounded-[34px]
            overflow-hidden
            bg-[#166B2D]
            shadow-[0_35px_100px_rgba(0,0,0,0.45)]
            border border-white/10
          "
        >

          {/* HEADER */}
          <div
            className="
              px-6 pt-6
              flex items-start justify-between
            "
          >

            <div>

              <h2
                className="
                  text-white
                  text-[24px]
                  font-black
                  tracking-tight
                "
              >
                Scan QR Code
              </h2>

              <p
                className="
                  text-[#B7D8BF]
                  text-[10px]
                  tracking-[0.16em]
                  font-black
                  mt-1
                "
              >
                REPAIR UNIT · NODE 12
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                w-10 h-10
                rounded-xl
                hover:bg-white/10
                flex items-center justify-center
                transition-all
              "
            >
              <CloseRoundedIcon
                style={{
                  color: "rgba(255,255,255,0.7)",
                }}
              />
            </button>

          </div>

          {/* SCANNER */}
          <div className="px-5 pt-5">

            <div
              className="
                h-[300px]
                rounded-[30px]
                bg-[#0D4A20]
                border border-white/10
                overflow-hidden
                relative
                flex items-center justify-center
              "
            >

              {/* GLOW */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_65%)]" />

              <QRScanOverlay loading={scanning} />

              {!scanning && (
                <div className="absolute bottom-7 left-0 right-0 flex justify-center">

                  <div
                    className="
                      px-4 py-2
                      rounded-full
                      bg-white/10
                      border border-white/10
                      backdrop-blur-md
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        tracking-[0.16em]
                        font-black
                        text-white/75
                      "
                    >
                      READY TO VERIFY PASSPORT
                    </p>

                  </div>

                </div>
              )}

              {scanning && (
                <div className="absolute bottom-7 left-0 right-0 flex justify-center">

                  <div
                    className="
                      px-4 py-2
                      rounded-full
                      bg-[#22C55E]/15
                      border border-[#22C55E]/20
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        tracking-[0.16em]
                        font-black
                        text-[#4ADE80]
                      "
                    >
                      VERIFYING PASSPORT...
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* BUTTON */}
          <div className="p-5">

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="
                w-full h-[58px]
                rounded-2xl
                bg-white
                text-[#166B2D]
                font-black
                tracking-[0.14em]
                text-sm
                flex items-center justify-center gap-3
                shadow-[0_12px_35px_rgba(0,0,0,0.18)]
                hover:scale-[1.01]
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              {scanning ? (
                <>
                  <div
                    className="
                      w-5 h-5
                      rounded-full
                      border-[3px]
                      border-[#166B2D]/20
                      border-t-[#166B2D]
                      animate-spin
                    "
                  />

                  VERIFYING...
                </>
              ) : (
                <>
                  <QrCodeScannerRoundedIcon
                    style={{
                      fontSize: 20,
                    }}
                  />

                  SIMULATE SCAN
                </>
              )}

            </button>

          </div>

        </div>

      </div>
    </>
  );
}