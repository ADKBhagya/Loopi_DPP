import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";

export default function QRResultCard({
  show,
}: any) {

  if (!show) return null;

  return (

    <div
      className="
        fixed top-5 right-5
        z-[200]
        min-w-[290px]
        rounded-2xl
        border border-[#BFE3C8]
        bg-[#EEF8F1]
        shadow-[0_15px_40px_rgba(0,0,0,0.12)]
        p-4
        flex items-start gap-4
      "
    >

      <div
        className="
          w-10 h-10 rounded-xl
          bg-[#DDF5E4]
          flex items-center justify-center
          text-[#16A34A]
        "
      >
        <QrCodeScannerRoundedIcon />
      </div>

      <div>

        <p className="font-bold text-[#166B2D] text-sm">
          Passport Scan Successful
        </p>

        <p className="text-[#166B2D] text-xs mt-1">
          GP-9821 verified on blockchain
        </p>

      </div>

    </div>

  );
}