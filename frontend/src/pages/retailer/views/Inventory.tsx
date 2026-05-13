import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

type InventoryItem = {
  id: string;
  passport: string;
  name: string;
  brand: string;
  material: string;
  grade: string;
  price: string;
  rawPrice?: number;
  status: string;
  owner: string;
  received?: string | null;
};

type InventoryResponse = {
  stats: {
    total: number;
    inStore: number;
    inTransit: number;
    sold: number;
  };
  inventory: InventoryItem[];
};

const emptyStats = {
  total: 0,
  inStore: 0,
  inTransit: 0,
  sold: 0,
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "Pending";

export default function Inventory() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [stats, setStats] = useState(emptyStats);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [transferModal, setTransferModal] = useState<InventoryItem | null>(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<InventoryResponse>("/retailer/inventory");
      setStats(data.stats || emptyStats);
      setInventory(data.inventory || []);
      setMessage(null);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to load retailer inventory" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const isActive = item.status !== "SOLD";
      const matchesFilter =
        filter === "all" ||
        (filter === "store" && item.status === "IN STORE");

      const text = `${item.passport} ${item.id} ${item.name} ${item.brand}`.toLowerCase();
      return isActive && matchesFilter && text.includes(query.toLowerCase());
    });
  }, [filter, inventory, query]);

  return (
    <div className="space-y-6">


      {message && (
        <div
          className={`rounded-2xl border px-5 py-3 text-sm font-semibold ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="IN STORE" value={stats.inStore} icon={<Inventory2OutlinedIcon />} iconBg="#DDEADF" iconColor="#166B2D" />
        <Card title="SOLD TOTAL" value={stats.sold} icon={<ShoppingCartOutlinedIcon />} iconBg="#F3E4FF" iconColor="#9333EA" />
        <Card title="ALL TRACKED" value={stats.total} icon={<CategoryOutlinedIcon />} iconBg="#FEEDD1" iconColor="#EA8A00" />
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 border-b border-[#F2F2F2]">
          <div>
            <h2 className="text-[28px] font-bold text-[#1B1F28]">Active Inventory</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {loading ? "Loading retailer inventory..." : "Manage product passports and ownership transfers"}
            </p>
            <p className="text-[11px] text-[#A0A6B2] mt-1">
              Grade is calculated from certificates: A+ for 2+ verified, A for 1 verified, B+ for submitted.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterBtn active={filter === "all"} label="All" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "store"} label="In Store" onClick={() => setFilter("store")} />
            <div className="relative w-full sm:w-[280px]">
              <SearchRoundedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Product ID, name, brand..."
                className="w-full h-10 rounded-xl border border-[#ECECEC] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#166B2D] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-max">
            <div className="grid grid-cols-[1fr_1.7fr_1.4fr_0.7fr_1fr_1.4fr_1fr_1fr] px-6 py-4 border-b border-[#F4F4F4] text-[11px] uppercase tracking-[0.14em] text-[#B4BAC4] font-bold">
              <div>Product ID</div>
              <div>Name & Brand</div>
              <div>Material</div>
              <div>Grade</div>
              <div>Status</div>
              <div>Owner</div>
              <div>Received</div>
              <div>Actions</div>
            </div>

            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_1.7fr_1.4fr_0.7fr_1fr_1.4fr_1fr_1fr] px-6 py-5 border-b border-[#F8F8F8] items-center hover:bg-[#FAFAFA] transition-all"
              >
                <div>
                  <p className="font-bold text-[#1B1F28]">{item.passport}</p>
                </div>
                <div>
                  <p className="font-bold text-[#1B1F28]">{item.name}</p>
                  <p className="text-sm text-[#A0A6B2] mt-1">{item.brand}</p>
                </div>
                <div className="text-sm text-[#6B7280]">{item.material}</div>
                <div><Grade grade={item.grade} /></div>
                <div><Status status={item.status} /></div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <PersonOutlineOutlinedIcon style={{ fontSize: 16 }} />
                  {item.owner}
                </div>
                <div className="text-sm text-[#9CA3AF]">{formatDate(item.received)}</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="w-9 h-9 rounded-xl border border-[#ECECEC] flex items-center justify-center hover:bg-[#F8F8F8] transition-all"
                  >
                    <RemoveRedEyeOutlinedIcon style={{ fontSize: 18 }} />
                  </button>
                  {item.status !== "SOLD" && (
                    <button
                      onClick={() => setTransferModal(item)}
                      className="h-9 px-4 rounded-xl bg-[#EEF5EF] border border-[#DDEADF] text-[#166B2D] text-[12px] font-bold tracking-[0.12em] hover:bg-[#E3F0E5] transition-all"
                    >
                      TRANSFER
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-[#A0A6B2]">
            {filteredInventory.length} items - All passports blockchain-tracked
          </p>
          <button className="flex items-center gap-2 text-[#166B2D] text-sm font-bold tracking-[0.12em] uppercase">
            <FileDownloadOutlinedIcon style={{ fontSize: 18 }} />
            Export
          </button>
        </div>
      </div>

      {selectedProduct && (
        <PassportDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onTransfer={() => {
            setSelectedProduct(null);
            setTransferModal(selectedProduct);
          }}
        />
      )}

      {transferModal && (
        <TransferOwnershipModal
          product={transferModal}
          onClose={() => setTransferModal(null)}
          onSaved={() => {
            setTransferModal(null);
            loadInventory();
          }}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div>
      <p className="text-[15px] tracking-[0.14em] text-[#A4AAB5] font-bold">{label}</p>
      <p className="text-[24px] leading-none font-bold text-[#1B1F28] mt-1">{value}</p>
    </div>
  );
}

function Card({ title, value, icon, iconBg, iconColor }: any) {
  return (
    <div className="h-[110px] rounded-[26px] border border-[#ECECEC] bg-white px-5 flex items-center justify-between">
      <div>
        <p className="text-[15px] tracking-[0.14em] text-[#A4AAB5] font-bold">{title}</p>
        <h2 className="text-[24px] leading-none font-bold text-[#1B1F28] mt-2">{value}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}

function FilterBtn({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-4 rounded-xl text-sm font-semibold border transition-all ${
        active ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-[#ECECEC]"
      }`}
    >
      {label}
    </button>
  );
}

function Grade({ grade }: any) {
  const styles: any = {
    "A+": "bg-[#E8F7EC] text-[#16A34A]",
    A: "bg-[#E8EEFF] text-[#2563EB]",
    "B+": "bg-[#FFF2DF] text-[#EA8A00]",
    Pending: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <div className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${styles[grade] || styles.Pending}`}>
      {grade}
    </div>
  );
}

function Status({ status }: any) {
  const styles: any = {
    "IN STORE": "bg-[#E8F7EC] text-[#16A34A]",
    SOLD: "bg-[#F3F4F6] text-[#6B7280]",
    "IN TRANSIT": "bg-[#E8EEFF] text-[#2563EB]",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] ${styles[status] || styles["IN STORE"]}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </div>
  );
}

function PassportDrawer({ product, onClose, onTransfer }: any) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[9998]" />
      <div className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white z-[9999] shadow-[0_0_60px_rgba(0,0,0,0.25)] overflow-y-auto">
        <div className="h-[70px] border-b border-[#F0F0F0] px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#166B2D] text-white flex items-center justify-center">
              <CategoryOutlinedIcon />
            </div>
            <div>
              <p className="font-bold text-[#1B1F28]">Digital Product Passport</p>
              <p className="text-xs text-[#9CA3AF]">{product.passport}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-center">
            <CloseRoundedIcon />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-[28px] border border-[#E7ECE8] bg-[#F2F7F3] p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <CategoryOutlinedIcon style={{ color: "#166B2D", fontSize: 28 }} />
            </div>
            <h2 className="text-[24px] leading-tight font-bold text-[#1B1F28] mt-5">{product.name}</h2>
            <p className="text-[#9CA3AF] mt-2">{product.brand}</p>
            <div className="flex justify-center gap-2 mt-5">
              <div className="h-8 px-3 rounded-lg bg-[#E7F7EC] text-[#16A34A] text-xs font-bold flex items-center">
                Grade {product.grade}
              </div>
              <div className="h-8 px-3 rounded-lg bg-[#EAF5EC] text-[#166B2D] text-xs font-bold flex items-center">
                LOOPI Verified
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ECECEC] p-4">
            <p className="text-[11px] tracking-[0.14em] text-[#A4AAB5] font-bold mb-4">PRODUCT DETAILS</p>
            <div className="grid grid-cols-2 gap-3">
              <DetailCard label="PASSPORT ID" value={product.passport} />
              <DetailCard label="PRICE" value={product.price} />
              <DetailCard label="MATERIAL" value={product.material} />
              <DetailCard label="STATUS" value={product.status} />
              <DetailCard label="RECEIVED" value={formatDate(product.received)} />
              <DetailCard label="OWNER" value={product.owner} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onTransfer}
              className="flex-1 h-[50px] rounded-2xl bg-[#166B2D] text-white font-bold tracking-[0.14em] text-sm hover:opacity-90 transition-all"
            >
              TRANSFER OWNERSHIP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailCard({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-[#F7F7F7] border border-[#EFEFEF] p-4">
      <div className="flex items-center gap-2">
        <div className="text-[#9CA3AF]"><VerifiedRoundedIcon style={{ fontSize: 16 }} /></div>
        <p className="text-[10px] tracking-[0.12em] text-[#A4AAB5] font-bold">{label}</p>
      </div>
      <p className="text-[12px] font-bold text-[#1B1F28] mt-3 leading-snug">{value}</p>
    </div>
  );
}

export function TransferOwnershipModal({ product, onClose, onSaved }: any) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [salePrice, setSalePrice] = useState(product.rawPrice || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setSaving(true);
      setError("");

      if (!buyerName.trim()) {
        setError("Enter buyer name so ownership can be saved");
        setSaving(false);
        return;
      }

      if (!buyerPhone.trim()) {
        setError("Enter consumer phone number so ownership can be saved");
        setSaving(false);
        return;
      }

      await apiFetch("/retailer/ownership/transfer", {
        method: "POST",
        body: JSON.stringify({
          garmentId: product.id,
          toName: buyerName,
          toPhone: buyerPhone,
          toRole: "Consumer",
          amount: Number(salePrice) || product.rawPrice || 0,
          transferType: "sale",
          notes: "Retail ownership transfer",
        }),
      });
      onSaved();
    } catch (err: any) {
      setError(err.message || "Transfer failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[9998]" />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="w-full max-w-[560px] bg-white rounded-[28px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
          <div className="h-[70px] border-b border-[#F0F0F0] px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center">
                <SwapHorizRoundedIcon />
              </div>
              <div>
                <p className="text-[20px] font-bold text-[#1B1F28]">Transfer Ownership</p>
                <p className="text-[11px] tracking-[0.12em] text-[#2563EB] font-bold mt-1">
                  {product.passport} - {product.name.toUpperCase()}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-center">
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="p-6">
            <div className="h-[76px] rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.12em] text-[#A4AAB5] font-bold">PRODUCT</p>
                <p className="font-bold text-[#1B1F28] mt-1">{product.passport} - {product.name}</p>
              </div>
              <p className="font-bold text-[#166B2D]">{product.price}</p>
            </div>

            <div className="space-y-5 mt-6">
              <Input label="CONSUMER PHONE NUMBER" value={buyerPhone} onChange={setBuyerPhone} placeholder="+94 77 123 4567" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="SALE PRICE" value={salePrice} onChange={setSalePrice} placeholder="129.00" />
                <Input label="BUYER NAME" value={buyerName} onChange={setBuyerName} placeholder="Consumer full name" />
              </div>
            </div>

            {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
          </div>

          <div className="h-[84px] bg-[#FAFAFA] border-t border-[#F0F0F0] px-6 flex items-center justify-end gap-4">
            <button onClick={onClose} className="text-[#6B7280] font-medium">Cancel</button>
            <button
              onClick={submit}
              disabled={saving}
              className="h-[48px] px-7 rounded-2xl bg-[#2563EB] text-white font-bold tracking-[0.12em] text-sm shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:opacity-90 transition-all disabled:opacity-60"
            >
              {saving ? "SAVING..." : "FINALISE TRANSFER"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ label, placeholder, value, onChange }: any) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.12em] text-[#6B7280] font-bold mb-3">{label}</p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-[56px] rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none focus:border-[#2563EB]"
      />
    </div>
  );
}
