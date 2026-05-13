import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type Sale = {
  id: string;
  saleId: string;
  passport: string;
  product: string;
  buyer: string;
  price: string;
  net: string;
  tax: string;
  date: string;
  receipt: string;
};

type InventoryItem = {
  id: string;
  passport: string;
  name: string;
  rawPrice?: number;
  status: string;
};

const emptyStats = {
  revenue: 0,
  net: 0,
  tax: 0,
  sales: 0,
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount || 0);

export default function SalesRecord() {
  const [exportModal, setExportModal] = useState(false);
  const [saleModal, setSaleModal] = useState(false);
  const [query, setQuery] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSales = async () => {
    try {
      setLoading(true);
      const [salesData, inventoryData] = await Promise.all([
        apiFetch<any>("/retailer/sales"),
        apiFetch<any>("/retailer/inventory"),
      ]);
      setStats(salesData.stats || emptyStats);
      setSales(salesData.sales || []);
      setInventory(inventoryData.inventory || []);
      setMessage("");
    } catch (error: any) {
      setMessage(error.message || "Failed to load sales records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) =>
      `${sale.saleId} ${sale.passport} ${sale.product} ${sale.buyer} ${sale.receipt}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, sales]);

  const revenueData = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const base = Math.max(stats.revenue / Math.max(months.length, 1), 1);
    return months.map((month, index) => ({
      month,
      value: Math.round(base * (0.6 + index * 0.12)),
    }));
  }, [stats.revenue]);

  const maxValue = Math.max(...revenueData.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5">
        <button
          onClick={() => setSaleModal(true)}
          className="h-[54px] px-6 rounded-2xl bg-[#166B2D] text-white font-bold tracking-[0.12em] text-sm flex items-center gap-3 shadow-[0_10px_30px_rgba(22,107,45,0.25)] w-fit"
        >
          <ReceiptLongOutlinedIcon />
          RECORD SALE
        </button>

        <div className="relative w-full 2xl:w-[320px]">
          <SearchRoundedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sale ID, garment..."
            className="w-full h-[52px] rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-[#166B2D]"
          />
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-[#DDEADF] bg-[#F4FBF6] px-5 py-3 text-sm font-semibold text-[#166B2D]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5">
        <StatCard title="TOTAL REVENUE" value={money(stats.revenue)} icon={<PaymentsOutlinedIcon />} iconBg="#EAF7EE" iconColor="#166B2D" />
        <StatCard title="SALES" value={stats.sales} icon={<SellOutlinedIcon />} iconBg="#F3E8FF" iconColor="#9333EA" />
        <StatCard title="NET AMOUNT" value={money(stats.net)} icon={<TrendingUpRoundedIcon />} iconBg="#EEF4FF" iconColor="#2563EB" />
        <StatCard title="TAX" value={money(stats.tax)} icon={<ReceiptLongOutlinedIcon />} iconBg="#FFF4E6" iconColor="#EA8A00" />
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[30px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-5 border-b border-[#F2F2F2] flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#111827]">Sales Records</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {loading ? "Loading sales from backend..." : "Blockchain-backed receipts"}
            </p>
          </div>
          <button
            onClick={() => setExportModal(true)}
            className="h-10 px-4 rounded-xl border border-[#ECECEC] text-[#166B2D] text-sm font-bold flex items-center gap-2"
          >
            <FileDownloadOutlinedIcon style={{ fontSize: 18 }} />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[1fr_1fr_1.4fr_1.2fr_0.9fr_0.9fr_0.7fr_1fr_1fr] px-6 py-4 border-b border-[#F4F4F4] text-[11px] uppercase tracking-[0.14em] text-[#B4BAC4] font-bold">
              <div>Sale ID</div>
              <div>Passport</div>
              <div>Product</div>
              <div>Buyer</div>
              <div>Price</div>
              <div>Net</div>
              <div>Tax</div>
              <div>Date</div>
              <div>Receipt</div>
            </div>

            {filteredSales.map((sale) => (
              <div key={sale.id} className="grid grid-cols-[1fr_1fr_1.4fr_1.2fr_0.9fr_0.9fr_0.7fr_1fr_1fr] px-6 py-5 border-b border-[#F8F8F8] items-center hover:bg-[#FAFAFA] transition-all text-sm">
                <div className="font-bold text-[#111827]">{sale.saleId}</div>
                <div className="font-bold text-[#166B2D]">{sale.passport}</div>
                <div className="text-[#4B5563]">{sale.product}</div>
                <div className="text-[#4B5563]">{sale.buyer}</div>
                <div className="font-bold text-[#111827]">{sale.price}</div>
                <div>{sale.net}</div>
                <div>{sale.tax}</div>
                <div>{new Date(sale.date).toLocaleDateString()}</div>
                <div>
                  <button className="h-8 px-3 rounded-xl bg-[#EEF7F1] text-[#166B2D] text-[11px] font-bold">
                    {sale.receipt}
                  </button>
                </div>
              </div>
            ))}

            {filteredSales.length === 0 && (
              <div className="px-6 py-10 text-sm text-[#9CA3AF]">No sales records found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[30px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <h2 className="text-[18px] font-bold text-[#111827]">Revenue Trend</h2>
        <div className="h-[180px] mt-6 flex items-end gap-4">
          {revenueData.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full rounded-t-2xl bg-[#166B2D]" style={{ height: `${Math.max((item.value / maxValue) * 150, 8)}px` }} />
              <p className="text-[11px] font-bold text-[#9CA3AF]">{item.month}</p>
            </div>
          ))}
        </div>
      </div>

      {saleModal && (
        <SaleModal
          inventory={inventory}
          onClose={() => setSaleModal(false)}
          onSaved={() => {
            setSaleModal(false);
            loadSales();
          }}
        />
      )}

      {exportModal && (
        <SimpleModal title="Export Sales" onClose={() => setExportModal(false)}>
          <p className="text-sm text-[#6B7280]">Sales are already loaded from the backend and ready for export.</p>
        </SimpleModal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor }: any) {
  return (
    <div className="h-[110px] rounded-[26px] border border-[#ECECEC] bg-white px-5 flex items-center justify-between">
      <div>
        <p className="text-[12px] tracking-[0.14em] text-[#A4AAB5] font-bold">{title}</p>
        <h2 className="text-[22px] leading-none font-bold text-[#111827] mt-3">{value}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}

function SaleModal({ inventory, onClose, onSaved }: any) {
  const availableInventory = inventory.filter((item: InventoryItem) => item.status !== "SOLD");
  const [garmentId, setGarmentId] = useState(availableInventory[0]?.id || "");
  const [buyerName, setBuyerName] = useState("");
  const [salePrice, setSalePrice] = useState(availableInventory[0]?.rawPrice || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selected = availableInventory.find((item: InventoryItem) => item.id === garmentId);

  useEffect(() => {
    if (selected?.rawPrice) setSalePrice(selected.rawPrice);
  }, [selected?.rawPrice]);

  const submit = async () => {
    try {
      setSaving(true);
      setError("");
      await apiFetch("/retailer/sales", {
        method: "POST",
        body: JSON.stringify({
          garmentId,
          buyerName: buyerName || "Consumer",
          salePrice: Number(salePrice),
          taxRate: 19,
          currency: "EUR",
          paymentMethod: "card",
          channel: "store",
        }),
      });
      onSaved();
    } catch (err: any) {
      setError(err.message || "Sale record failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleModal title="Record Retail Sale" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-[11px] tracking-[0.12em] text-[#6B7280] font-bold mb-2">GARMENT</p>
          <select
            value={garmentId}
            onChange={(event) => setGarmentId(event.target.value)}
            className="w-full h-[52px] rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none"
          >
            {availableInventory.map((item: InventoryItem) => (
              <option key={item.id} value={item.id}>
                {item.passport} - {item.name}
              </option>
            ))}
          </select>
        </div>

        <Input label="BUYER NAME" value={buyerName} onChange={setBuyerName} placeholder="Consumer name" />
        <Input label="SALE PRICE" value={salePrice} onChange={setSalePrice} placeholder="89.00" />

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          onClick={submit}
          disabled={saving || !garmentId}
          className="w-full h-[50px] rounded-2xl bg-[#166B2D] text-white font-bold tracking-[0.12em] text-sm disabled:opacity-60"
        >
          {saving ? "SAVING..." : "SAVE SALE"}
        </button>
      </div>
    </SimpleModal>
  );
}

function SimpleModal({ title, children, onClose }: any) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9998]" />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="w-full max-w-[520px] bg-white rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.28)] overflow-hidden">
          <div className="h-[70px] border-b border-[#F0F0F0] px-6 flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#111827]">{title}</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-center">
              <CloseRoundedIcon />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.12em] text-[#6B7280] font-bold mb-2">{label}</p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-[52px] rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-sm outline-none"
      />
    </div>
  );
}
