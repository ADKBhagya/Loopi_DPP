import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";

export default function QRScanOverlay({
  loading,
}: any) {

  return (

    <div
      className="
        relative
        h-[280px]
        rounded-[24px]
        border border-[#3B7F4A]
        bg-[#0D4D16]
        overflow-hidden
      "
    >

      {/* CORNERS */}
      <div className="absolute top-4 left-4 w-9 h-9 border-l-4 border-t-4 border-[#52F27C] rounded-tl-2xl" />
      <div className="absolute top-4 right-4 w-9 h-9 border-r-4 border-t-4 border-[#52F27C] rounded-tr-2xl" />
      <div className="absolute bottom-4 left-4 w-9 h-9 border-l-4 border-b-4 border-[#52F27C] rounded-bl-2xl" />
      <div className="absolute bottom-4 right-4 w-9 h-9 border-r-4 border-b-4 border-[#52F27C] rounded-br-2xl" />

      {!loading && (

        <>
          {/* SCAN LINE */}
          <div
            className="
              absolute left-0 right-0 top-1/2
              h-[2px]
              bg-[#52F27C]
              shadow-[0_0_18px_rgba(82,242,124,0.9)]
              animate-pulse
            "
          />

          <div
            className="
              absolute inset-0
              flex items-center justify-center
            "
          >

            <QrCodeScannerRoundedIcon
              style={{
                fontSize: 54,
                color: "rgba(255,255,255,0.15)",
              }}
            />

          </div>
        </>

      )}

      {loading && (

        <div
          className="
            absolute inset-0
            flex flex-col items-center justify-center
          "
        >

          <div
            className="
              w-14 h-14
              rounded-full
              border-[4px]
              border-[#52F27C]/30
              border-t-[#52F27C]
              animate-spin
            "
          />

          <p
            className="
              text-[#52F27C]
              text-[11px]
              tracking-[0.12em]
              font-bold
              mt-5
            "
          >
            QUERYING BLOCKCHAIN...
          </p>

        </div>

      )}

    </div>

  );
}