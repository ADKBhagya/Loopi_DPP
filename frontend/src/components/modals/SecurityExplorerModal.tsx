import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { createPortal } from "react-dom";

interface Props {
  onClose: () => void;
}

export default function SecurityExplorerModal({
  onClose,
}: Props) {

  const logs = [
    {
      type: "BLOCK CONFIRMED",
      hash: "0x7A3F...91BC",
      node: "NODE-04",
      time: "2 mins ago",
      color: "green",
    },
    {
      type: "AUDIT SIGNED",
      hash: "0x5C91...AA12",
      node: "NODE-02",
      time: "12 mins ago",
      color: "blue",
    },
    {
      type: "SMART CONTRACT UPDATE",
      hash: "0xAB21...9FF1",
      node: "NODE-09",
      time: "1 hour ago",
      color: "yellow",
    },
    {
      type: "VALIDATION COMPLETE",
      hash: "0x11AC...77DE",
      node: "NODE-01",
      time: "3 hours ago",
      color: "purple",
    },
    {
      type: "DPP NFT MINTED",
      hash: "0x8FF1...BC92",
      node: "NODE-11",
      time: "5 hours ago",
      color: "green",
    },
    {
      type: "CONSENSUS VERIFIED",
      hash: "0x3DA2...FE11",
      node: "NODE-07",
      time: "7 hours ago",
      color: "blue",
    },
  ];

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/50 backdrop-blur-sm
          z-[90]
        "
      />

      {/* MODAL */}
      <div
        className="
          fixed inset-0
          z-[100]
          flex items-center justify-center
          px-4
        "
      >

        <div
          className="
            w-full max-w-[780px]
            bg-white rounded-3xl
            shadow-[0_20px_80px_rgba(0,0,0,0.25)]
            overflow-hidden
            animate-[fadeIn_0.2s_ease]
          "
        >

          {/* HEADER */}
          <div
            className="
              px-4 sm:px-6 py-5 border-b
              flex items-center justify-between
            "
          >

            <div>

              <p className="text-lg font-bold text-gray-900">
                Security Explorer
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Real-time blockchain monitoring & validation
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                w-10 h-10 rounded-xl
                hover:bg-gray-100
                flex items-center justify-center
                transition
              "
            >
              <CloseOutlinedIcon />
            </button>

          </div>

          {/* NETWORK STATUS */}
          <div
            className="
              px-6 py-5
              border-b
              bg-gradient-to-r
              from-[#F8FBF8]
              to-[#F3F8FF]
            "
          >

            <div
              className="
                grid grid-cols-2 md:grid-cols-4
                gap-4
              "
            >

              <ExplorerStat
                label="ACTIVE NODES"
                value="12"
                color="green"
              />

              <ExplorerStat
                label="BLOCK HEIGHT"
                value="#8,442,109"
                color="blue"
              />

              <ExplorerStat
                label="TX VERIFIED"
                value="18,442"
                color="yellow"
              />

              <ExplorerStat
                label="NETWORK"
                value="ONLINE"
                color="purple"
              />

            </div>

          </div>

          {/* LIVE FEED */}
          <div
            className="
              px-6 py-5
              max-h-[500px]
              overflow-y-auto
            "
          >

            {/* TITLE */}
            <div className="flex items-center justify-between mb-5">

              <p
                className="
                  text-[11px]
                  font-bold tracking-widest
                  text-gray-400
                "
              >
                LIVE BLOCKCHAIN EVENTS
              </p>

              <div
                className="
                  px-3 py-1 rounded-full
                  bg-green-50 border
                  text-green-700
                  text-[10px] font-bold
                "
              >
                LIVE STREAM
              </div>

            </div>

            {/* LOGS */}
            <div className="space-y-4">

              {logs.map((log, index) => (
                <ExplorerLogCard
                  key={index}
                  {...log}
                />
              ))}

            </div>

          </div>

          {/* FOOTER */}
          <div
            className="
              px-6 py-4 border-t
              bg-gray-50
              flex items-center justify-between
            "
          >

            <div>

              <p className="text-sm font-semibold text-gray-800">
                LOOPI MAINNET
              </p>

              <p className="text-xs text-gray-400">
                Last synced 4 seconds ago
              </p>

            </div>

            <button
              className="
                px-5 py-2 rounded-xl
                bg-[#1B5E20]
                text-white text-sm font-semibold
                hover:opacity-90
                transition
              "
            >
              OPEN FULL EXPLORER
            </button>

          </div>

        </div>

      </div>
    </>
    ,
    document.body
  );
}

/* ================= STAT CARD ================= */

function ExplorerStat({
  label,
  value,
  color,
}: any) {

  const colors: any = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    purple: "bg-purple-500",
  };

  return (
    <div
      className="
        bg-white border rounded-2xl
        p-4 shadow-sm
      "
    >

      <div className="flex items-center gap-2">

        <div
          className={`
            w-2.5 h-2.5 rounded-full
            ${colors[color]}
          `}
        />

        <p
          className="
            text-[10px]
            font-bold tracking-widest
            text-gray-400
          "
        >
          {label}
        </p>

      </div>

      <p className="text-lg font-bold mt-3 text-gray-900">
        {value}
      </p>

    </div>
  );
}

/* ================= LOG CARD ================= */

function ExplorerLogCard({
  type,
  hash,
  node,
  time,
  color,
}: any) {

  const colors: any = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    purple: "bg-purple-500",
  };

  return (
    <div
      className="
        border rounded-2xl
        p-5
        hover:border-[#1B5E20]
        hover:shadow-md
        transition-all
        bg-white
      "
    >

      <div className="flex justify-between items-start">

        {/* LEFT */}
        <div className="flex gap-4">

          <div
            className={`
              w-3 h-3 rounded-full mt-1
              ${colors[color]}
            `}
          />

          <div>

            <p className="font-semibold text-sm text-gray-900">
              {type}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              HASH: {hash}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">

              <span
                className="
                  px-2 py-1 rounded-md
                  bg-gray-100 text-gray-600
                  text-[10px] font-semibold
                "
              >
                {node}
              </span>

              <span
                className="
                  px-2 py-1 rounded-md
                  bg-green-50 text-green-700
                  text-[10px] font-semibold
                "
              >
                VERIFIED
              </span>

              <span
                className="
                  px-2 py-1 rounded-md
                  bg-blue-50 text-blue-700
                  text-[10px] font-semibold
                "
              >
                BLOCKCHAIN
              </span>

            </div>

          </div>

        </div>

        {/* TIME */}
        <p className="text-xs text-gray-400 whitespace-nowrap">
          {time}
        </p>

      </div>

    </div>
  );
}
