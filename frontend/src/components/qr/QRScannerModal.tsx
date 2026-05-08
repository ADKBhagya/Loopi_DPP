import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";

import QRScanOverlay from "./QRScanOverlay";

export default function QRScannerModal({
  open,
  loading,
  onClose,
  onScan,
}: any) {

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="
          fixed inset-0
          bg-black/45
          backdrop-blur-sm
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
            w-full max-w-[350px]
            rounded-[30px]
            overflow-hidden
            bg-[#166B2D]
            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
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
                  text-[20px]
                  font-bold
                "
              >
                Passport Scanner
              </h2>

              <p
                className="
                  text-[#B7D8BF]
                  text-[10px]
                  tracking-[0.12em]
                  font-bold
                  mt-1
                "
              >
                RETAIL NODE · FASHFORWARD GMBH
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                text-white/70
                hover:text-white
              "
            >
              <CloseRoundedIcon />
            </button>

          </div>

          {/* SCANNER */}
          <div className="px-5 pt-5">

            <QRScanOverlay
              loading={loading}
            />

          </div>

          {/* BUTTON */}
          <div className="p-5">

            <button
              onClick={onScan}
              className="
                w-full h-[54px]
                rounded-2xl
                bg-white
                text-[#166B2D]
                font-bold
                tracking-[0.12em]
                text-sm
                flex items-center justify-center gap-3
              "
            >

              <QrCodeScannerRoundedIcon
                style={{ fontSize: 20 }}
              />

              SIMULATE SCAN

            </button>

          </div>

        </div>

      </div>
    </>
  );
}