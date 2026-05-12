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

export default function BlockchainExplorer() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<any[]>([]);
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
      const blockchainStats = await apiFetch<any>("/blockchain/stats");
      const transactions = blockchainStats.latestTransaction
        ? [blockchainStats.latestTransaction]
        : [];

      const formatted =
        transactions.map((tx: any) => ({
          title: tx.transactionType,
          garment:
            tx.metadata?.productName ||
            tx.metadata?.garmentName ||
            tx.metadata?.shipmentId ||
            tx.entityType,

          time: new Date(
            tx.createdAt
          ).toLocaleString(),

          hash: tx.blockchainHash,
          blockNumber: tx.blockNumber,
        }));

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

  return (
    <div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <Stat icon={<TagOutlinedIcon />} value={stats.totalTransactions} label="TOTAL TRANSACTIONS" color="blue" />
        <Stat icon={<Inventory2OutlinedIcon />} value={data.length} label="VISIBLE EVENTS" color="green" />
        <Stat icon={<StorageOutlinedIcon />} value={`#${stats.latestBlock}`} label="LAST BLOCK" color="purple" />
        <Stat icon={<PublicOutlinedIcon />} value={stats.network} label="NETWORK" color="green" />

      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        {/* HEADER */}
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
              placeholder="Search hash or event..."
              className="h-10 w-[220px] pl-10 pr-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[#1B5E20]"
            />
          </div>
        </div>

        {/* ================= LIST ================= */}
        {loading ? (
          <div className="py-14 text-center text-sm text-gray-400">
            Loading blockchain transactions...
          </div>
        ) : apiUnavailable ? (
          <div className="py-14 text-center text-sm text-orange-500">
            Blockchain backend is not deployed in production yet
          </div>
        ) : data.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400">
            No transactions found
          </div>
        ) : data.map((item, i) =>
          i === active ? (
            <ActiveCard key={i} {...item} onClick={() => setActive(i)} />
          ) : (
            <CollapsedItem key={i} {...item} onClick={() => setActive(i)} />
          )
        )}

        {/* FOOT */}
        <div className="mt-6 bg-orange-50 border border-orange-100 text-orange-600 text-xs px-4 py-3 rounded-xl">
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

      <h2 className="text-xl font-bold mt-3">{value}</h2>
      <p className="text-[12px] text-gray-400 font-semibold mt-2">{label}</p>
    </div>
  );
}

function ActiveCard({ title, garment, time, hash, blockNumber, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-400 rounded-2xl p-5 mb-4 cursor-pointer"
    >

      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">

        <div className="flex gap-3">

          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            #
          </div>

          <div>
            <p className="text-[11px] text-gray-400 mb-1">{hash}</p>

            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
                CONFIRMED
              </span>
            </div>

            <p className="font-semibold text-gray-800 mt-1">{title}</p>
            <p className="text-xs text-gray-400">{garment} · {time}</p>
          </div>
        </div>

        <KeyboardArrowDownOutlinedIcon className="text-gray-400" />
      </div>

      {/* HASH BAR */}
      <div className="mt-4 bg-[#0f172a] text-green-400 px-4 py-3 rounded-xl flex justify-between items-center text-sm">
        {hash}
        <ContentCopyOutlinedIcon className="text-gray-400 cursor-pointer" />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Info label="BLOCK HEIGHT" value={blockNumber ? `#${blockNumber}` : "Pending"} />
        <Info label="TIMESTAMP" value={time} />
        <Info label="EVENT TYPE" value={title} />
        <Info label="RECORD" value={garment} />
      </div>

      {/* ACTIONS */}
        <div className="flex gap-3 mt-4">

        <button className="px-4 py-2 bg-blue-50 text-blue-600 text-xs rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-100 transition">
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

function CollapsedItem({ title, time, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center py-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded-xl"
    >

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
          #
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
              CONFIRMED
            </span>
          </div>

          <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
          <p className="text-xs text-gray-400">Feb 20 · 11:24 UTC</p>
        </div>
      </div>

      <KeyboardArrowDownOutlinedIcon className="text-gray-400" />
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
