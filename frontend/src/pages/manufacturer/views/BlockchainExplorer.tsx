import { useState, useEffect } from "react";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { apiFetch } from "../../../lib/api";

const passportIdFor = (garment: any) => {
  const id = garment?._id || garment;

  if (!id) {
    return "N/A";
  }

  return `GP-${String(id).slice(-6).toUpperCase()}`;
};

export default function BlockchainExplorer() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalTransactions: 0,
    latestBlock: "-",
    network: "LOOPI MAINNET",
    status: "UNAVAILABLE",
  });
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setApiUnavailable(false);

        const [blockchainStats, transactions] = await Promise.all([
          apiFetch<any>("/blockchain/stats"),
          apiFetch<any[]>("/blockchain/transactions"),
        ]);

        const formatted = transactions.map((tx: any) => {
          const garmentId = tx.metadata?.passportId || passportIdFor(tx.garmentId);

          return {
            title: tx.transactionType,
            status: tx.status || "CONFIRMED",
            garmentId,
            garmentMongoId: tx.garmentId?._id || tx.garmentId || "",
            garment:
              tx.garmentId?.productName ||
              tx.metadata?.productName ||
              tx.metadata?.garmentName ||
              tx.metadata?.shipmentId ||
              tx.entityType,
            actor: tx.performedBy?.fullName || tx.performedRole || "System",
            time: new Date(tx.createdAt).toLocaleString(),
            hash: tx.blockchainHash,
            blockNumber: tx.blockNumber,
            explorerUrl: tx.explorerUrl,
          };
        });

        setData(formatted);
        setStats(blockchainStats);
      } catch (error) {
        console.error(error);
        setApiUnavailable(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const visibleData = data.filter((item) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [
      item.title,
      item.garment,
      item.garmentId,
      item.garmentMongoId,
      item.hash,
      item.actor,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat icon={<TagOutlinedIcon />} value={stats.totalTransactions} label="TOTAL TRANSACTIONS" color="blue" />
        <Stat icon={<Inventory2OutlinedIcon />} value={visibleData.length} label="VISIBLE EVENTS" color="green" />
        <Stat icon={<StorageOutlinedIcon />} value={`#${stats.latestBlock}`} label="LAST BLOCK" color="purple" />
        <Stat icon={<PublicOutlinedIcon />} value={stats.network} label="NETWORK" color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <StorageOutlinedIcon />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Blockchain Explorer
              </h2>
              <p className="text-xs text-gray-400">
                Immutable on-chain transaction log
              </p>
            </div>
          </div>

          <div className="relative">
            <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setActive(0);
              }}
              placeholder="Search hash, event, or garment ID..."
              className="h-10 w-[260px] pl-10 pr-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#1B5E20]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-14 text-center text-sm text-gray-400">
            Loading blockchain transactions...
          </div>
        ) : apiUnavailable ? (
          <div className="py-14 text-center text-sm text-red-500">
            Blockchain backend is not deployed in production yet
          </div>
        ) : visibleData.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400">
            No transactions found
          </div>
        ) : (
          visibleData.map((item, i) =>
            i === active ? (
              <ActiveCard key={`${item.hash}-${i}`} {...item} onClick={() => setActive(i)} />
            ) : (
              <CollapsedItem key={`${item.hash}-${i}`} {...item} onClick={() => setActive(i)} />
            )
          )
        )}

        <div className="mt-6 bg-green-50 border border-green-100 text-green-700 text-xs px-4 py-3 rounded-xl">
          All records are immutable and stored on the decentralized LOOPI blockchain protocol.
          Verification ensures zero-trust authenticity for all sustainability claims.
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, color }: any) {
  const styles: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles[color]}`}>
        {icon}
      </div>

      <h2 className="text-xl font-bold mt-3 truncate">{value}</h2>
      <p className="text-[12px] text-gray-400 font-semibold mt-2">{label}</p>
    </div>
  );
}

function ActiveCard({
  title,
  garmentId,
  garmentMongoId,
  garment,
  actor,
  time,
  hash,
  blockNumber,
  explorerUrl,
  status,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-400 rounded-2xl p-5 mb-4 cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            #
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 mb-1 break-all">{hash}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
                {status}
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold">
                {garmentId}
              </span>
            </div>

            <p className="font-semibold text-gray-800 mt-1">{title}</p>
            <p className="text-xs text-gray-400">{garment} - {time}</p>
          </div>
        </div>

        <KeyboardArrowDownOutlinedIcon className="text-gray-400" />
      </div>

      <div className="mt-4 bg-[#0f172a] text-green-400 px-4 py-3 rounded-xl flex justify-between items-center gap-3 text-sm">
        <span className="break-all">{hash}</span>
        <ContentCopyOutlinedIcon className="text-gray-400 cursor-pointer shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Info label="BLOCK HEIGHT" value={blockNumber ? `#${blockNumber}` : "Pending"} />
        <Info label="TIMESTAMP" value={time} />
        <Info label="EVENT TYPE" value={title} />
        <Info label="GARMENT ID" value={garmentId} />
        <Info label="GARMENT RECORD ID" value={garmentMongoId || "N/A"} />
        <Info label="RECORD" value={garment} />
        <Info label="ACTOR" value={actor} />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (explorerUrl) {
              window.open(explorerUrl, "_blank", "noopener,noreferrer");
            }
          }}
          className="px-4 py-2 bg-blue-50 text-blue-600 text-xs rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-100 transition disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!explorerUrl}
        >
          <OpenInNewOutlinedIcon style={{ fontSize: 16 }} />
          View on LOOPI Explorer
        </button>

        <button className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
          <DownloadOutlinedIcon style={{ fontSize: 16 }} />
          Export
        </button>
      </div>
    </div>
  );
}

function CollapsedItem({ title, time, garmentId, garment, status, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center py-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded-xl"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
          #
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
              {status}
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold">
              {garmentId}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
          <p className="text-xs text-gray-400 truncate">{garment} - {time}</p>
        </div>
      </div>

      <KeyboardArrowDownOutlinedIcon className="text-gray-400" />
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 min-w-0">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800 break-words">{value}</p>
    </div>
  );
}
