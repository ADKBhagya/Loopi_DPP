import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

/* OUTLINED ICONS */
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TokenOutlinedIcon from "@mui/icons-material/TokenOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

type TabKey =
  | "overview"
  | "owned"
  | "resale"
  | "repairs"
  | "recycling"
  | "reports";

const ownedItems = [
  {
    id: "GP-9822",
    name: "Organic Cotton Hoodie",
    brand: "LOOPI Apparel",
    status: "In Use",
    score: "87/100",
    material: "Organic Cotton",
    lastActivity: "Verified on Mar 22, 2026",
  },
  {
    id: "RB-7731",
    name: "Recycled Wool Blazer",
    brand: "LOOPI Heritage",
    status: "Repair Ready",
    score: "88/100",
    material: "Recycled Wool",
    lastActivity: "Repair record updated",
  },
  {
    id: "DJ-2041",
    name: "Recycled Denim Jacket",
    brand: "Loop Denim",
    status: "Resale Eligible",
    score: "82/100",
    material: "Recycled Denim",
    lastActivity: "Ownership verified",
  },
];

const resaleListings = [
  {
    id: "RS-1001",
    product: "Organic Cotton Hoodie",
    passport: "GP-9822",
    condition: "Excellent",
    price: "€42",
    status: "Published",
    views: "128",
  },
  {
    id: "RS-1002",
    product: "Recycled Denim Jacket",
    passport: "DJ-2041",
    condition: "Good",
    price: "€55",
    status: "Draft",
    views: "0",
  },
];

const repairRequests = [
  {
    id: "RP-4481",
    product: "Recycled Wool Blazer",
    passport: "RB-7731",
    type: "Stitching Repair",
    center: "Green Stitch Repair Hub",
    date: "2026-05-18",
    status: "Scheduled",
  },
  {
    id: "RP-4310",
    product: "Organic Cotton Hoodie",
    passport: "GP-9822",
    type: "Zip / Button Repair",
    center: "Circular Textile Care",
    date: "2026-04-28",
    status: "Completed",
  },
];

const recyclingRequests = [
  {
    id: "RC-7710",
    product: "Linen Summer Shirt",
    passport: "LS-7710",
    method: "Drop-off",
    center: "LOOPI Circular Hub",
    date: "2026-05-25",
    status: "Pending Drop-off",
    credits: "250",
  },
];

const issueReports = [
  {
    id: "IR-9011",
    product: "Organic Cotton Hoodie",
    passport: "GP-9822",
    issue: "Incorrect Material Data",
    status: "Under Review",
    date: "2026-05-02",
  },
];

export default function ConsumerMyClothes() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [search, setSearch] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const filteredOwnedItems = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return ownedItems;

    return ownedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword)
    );
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("fullName");
    sessionStorage.removeItem("pendingConsumerAction");
    sessionStorage.removeItem("consumerReturnPath");
    navigate("/consumer");
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#102A1A]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#DDE8DF] shadow-[0_8px_30px_rgba(15,61,30,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 rounded-xl bg-[#062414] flex items-center justify-center p-1 shadow-sm">
              <img
                src={logo}
                alt="LOOPI"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-sm font-black tracking-wide">LOOPI</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#1B5E20] font-bold">
                My Clothes
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/consumer")}
              className="h-10 px-4 rounded-full border border-[#1B5E20] text-[#1B5E20] text-sm font-black hover:bg-[#E8F5E9] transition"
            >
              Consumer Portal
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="h-10 px-4 rounded-full bg-[#062414] text-white text-sm font-black flex items-center gap-2 hover:bg-[#0F3D1E] transition"
            >
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </button>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="md:hidden h-10 w-10 rounded-xl bg-[#062414] text-white flex items-center justify-center"
          >
            <LogoutOutlinedIcon fontSize="small" />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#062414] via-[#0B2E17] to-[#1B5E20] text-white px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.18em]">
              <WorkspacePremiumOutlinedIcon fontSize="small" />
              Consumer Account Dashboard
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-5">
              My Clothes
            </h2>

            <p className="text-white/75 mt-4 max-w-2xl leading-relaxed">
              Manage your verified garments, resale listings, repair history,
              recycling requests, issue reports, and eco credits from one private
              consumer dashboard.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/consumer")}
                className="h-12 px-6 rounded-xl bg-white text-[#1B5E20] font-black hover:bg-[#F1F8F4] transition"
              >
                Verify Another Product
              </button>

              <button
                onClick={() => setActiveTab("owned")}
                className="h-12 px-6 rounded-xl border border-white/30 text-white font-black hover:bg-white/10 transition"
              >
                View Owned Items
              </button>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/10 border border-white/20 p-6">
            <p className="text-white/70 text-sm font-bold">Eco Credit Balance</p>
            <h3 className="text-4xl font-black mt-2">265 Credits</h3>
            <p className="text-white/60 text-sm mt-2">
              Earned from repairs, resale participation, and recycling actions.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <HeroMini label="Owned Items" value="3" />
              <HeroMini label="Open Requests" value="3" />
              <HeroMini label="Listings" value="2" />
              <HeroMini label="Reports" value="1" />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <SummaryCard
            icon={<Inventory2OutlinedIcon />}
            label="Owned Clothes"
            value="3"
            tone="green"
          />
          <SummaryCard
            icon={<StorefrontOutlinedIcon />}
            label="Resale Listings"
            value="2"
            tone="green"
          />
          <SummaryCard
            icon={<BuildOutlinedIcon />}
            label="Repair Requests"
            value="2"
            tone="blue"
          />
          <SummaryCard
            icon={<RecyclingOutlinedIcon />}
            label="Recycling"
            value="1"
            tone="green"
          />
          <SummaryCard
            icon={<ReportProblemOutlinedIcon />}
            label="Reports"
            value="1"
            tone="amber"
          />
          <SummaryCard
            icon={<TokenOutlinedIcon />}
            label="Eco Credits"
            value="265"
            tone="green"
          />
        </div>

        {/* FILTER BAR */}
        <div className="mt-8 bg-white rounded-[24px] border border-[#DDE8DF] p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <TabButton
                label="Overview"
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              />
              <TabButton
                label="Owned Items"
                active={activeTab === "owned"}
                onClick={() => setActiveTab("owned")}
              />
              <TabButton
                label="Resale"
                active={activeTab === "resale"}
                onClick={() => setActiveTab("resale")}
              />
              <TabButton
                label="Repairs"
                active={activeTab === "repairs"}
                onClick={() => setActiveTab("repairs")}
              />
              <TabButton
                label="Recycling"
                active={activeTab === "recycling"}
                onClick={() => setActiveTab("recycling")}
              />
              <TabButton
                label="Reports"
                active={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
              />
            </div>

            <div className="relative w-full lg:w-80">
              <SearchOutlinedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clothes or passport ID..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#DDE8DF] bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <OverviewPanel
              onOwned={() => setActiveTab("owned")}
              onResale={() => setActiveTab("resale")}
              onRepairs={() => setActiveTab("repairs")}
              onRecycle={() => setActiveTab("recycling")}
            />
          )}

          {activeTab === "owned" && (
            <OwnedItemsPanel items={filteredOwnedItems} navigate={navigate} />
          )}

          {activeTab === "resale" && (
            <ResalePanel listings={resaleListings} />
          )}

          {activeTab === "repairs" && (
            <RepairPanel repairs={repairRequests} />
          )}

          {activeTab === "recycling" && (
            <RecyclingPanel requests={recyclingRequests} />
          )}

          {activeTab === "reports" && <ReportsPanel reports={issueReports} />}
        </div>
      </main>

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black/45 p-4 flex items-center justify-center">
          <div className="bg-white rounded-[28px] max-w-md w-full p-7 shadow-2xl relative">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>

            <div className="h-14 w-14 rounded-2xl bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center">
              <LogoutOutlinedIcon />
            </div>

            <h3 className="text-2xl font-black mt-5">Logout?</h3>

            <p className="text-[#6B7280] mt-3 leading-relaxed">
              You will return to the public Consumer portal. Protected actions
              like resale, repair, recycling, and issue reporting will require
              login again.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="h-12 rounded-xl border border-[#DDE8DF] font-black hover:bg-[#F8FAFC] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* PANELS */

function OverviewPanel({
  onOwned,
  onResale,
  onRepairs,
  onRecycle,
}: {
  onOwned: () => void;
  onResale: () => void;
  onRepairs: () => void;
  onRecycle: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-[28px] border border-[#DDE8DF] p-6 shadow-sm">
          <h3 className="text-2xl font-black">Account Activity</h3>
          <p className="text-[#6B7280] mt-2">
            Latest circular fashion actions linked to your consumer account.
          </p>

          <div className="mt-6 space-y-4">
            <ActivityItem
              icon={<VerifiedOutlinedIcon />}
              title="Ownership verified"
              text="Organic Cotton Hoodie was added to your clothes."
              time="Today"
              tone="green"
            />
            <ActivityItem
              icon={<BuildOutlinedIcon />}
              title="Repair request scheduled"
              text="Green Stitch Repair Hub accepted your blazer repair."
              time="Yesterday"
              tone="blue"
            />
            <ActivityItem
              icon={<RecyclingOutlinedIcon />}
              title="Recycling request pending"
              text="Drop-off request waiting for product handover."
              time="2 days ago"
              tone="green"
            />
            <ActivityItem
              icon={<ReportProblemOutlinedIcon />}
              title="Issue report under review"
              text="Material data report is being checked."
              time="3 days ago"
              tone="amber"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <QuickActionCard
            icon={<Inventory2OutlinedIcon />}
            title="Owned Clothes"
            text="View products linked to your account."
            onClick={onOwned}
          />
          <QuickActionCard
            icon={<StorefrontOutlinedIcon />}
            title="Resale Listings"
            text="Track published and draft resale listings."
            onClick={onResale}
          />
          <QuickActionCard
            icon={<BuildOutlinedIcon />}
            title="Repair Requests"
            text="Monitor service status and repair history."
            onClick={onRepairs}
          />
          <QuickActionCard
            icon={<RecyclingOutlinedIcon />}
            title="Recycling Requests"
            text="Track circular recovery and credit rewards."
            onClick={onRecycle}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#1B5E20] text-white rounded-[28px] p-6 shadow-sm">
          <SpaOutlinedIcon sx={{ fontSize: 42 }} />
          <h3 className="text-2xl font-black mt-4">Circular Impact</h3>
          <p className="text-white/70 mt-2">
            Your verified circular actions help extend product lifetime and
            reduce textile waste.
          </p>

          <div className="mt-6 space-y-4">
            <ImpactRow label="Repairs Completed" value="1" />
            <ImpactRow label="Items Resold" value="1" />
            <ImpactRow label="Recycling Credits" value="250" />
            <ImpactRow label="Estimated CO₂e Avoided" value="8.6 kg" />
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-[#DDE8DF] p-6 shadow-sm">
          <h3 className="font-black text-xl">Next Recommended Action</h3>
          <p className="text-[#6B7280] text-sm mt-2">
            Your recycled wool blazer is repair-ready. Completing the repair can
            increase resale value.
          </p>

          <button
            onClick={onRepairs}
            className="mt-5 w-full h-12 rounded-xl bg-[#1B5E20] text-white font-black hover:bg-[#0F3D1E] transition"
          >
            View Repair Requests
          </button>
        </div>
      </div>
    </div>
  );
}

function OwnedItemsPanel({
  items,
  navigate,
}: {
  items: typeof ownedItems;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div>
      <SectionHeading
        title="Owned Clothes"
        text="Products linked to your consumer account through verified passports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[28px] border border-[#DDE8DF] overflow-hidden shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-52 bg-gradient-to-br from-[#E8F5E9] to-[#CFE8D2] flex items-center justify-center">
              <Inventory2OutlinedIcon
                sx={{ fontSize: 76 }}
                className="text-[#1B5E20]"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{item.name}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">{item.brand}</p>
                </div>

                <StatusBadge status={item.status} />
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <DataRow label="Passport ID" value={item.id} />
                <DataRow label="Material" value={item.material} />
                <DataRow label="Eco Score" value={item.score} />
                <DataRow label="Last Activity" value={item.lastActivity} />
              </div>

              <button
                onClick={() => navigate(`/consumer/passport/${item.id}`)}
                className="mt-5 w-full h-11 rounded-xl bg-[#1B5E20] text-white font-black flex items-center justify-center gap-2 hover:bg-[#0F3D1E] transition"
              >
                View Passport
                <OpenInNewOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState
          icon={<Inventory2OutlinedIcon />}
          title="No clothes found"
          text="Try searching another passport ID or product name."
        />
      )}
    </div>
  );
}

function ResalePanel({ listings }: { listings: typeof resaleListings }) {
  return (
    <div>
      <SectionHeading
        title="Resale Listings"
        text="Track verified resale listings created from your product passports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {listings.map((item) => (
          <RecordCard
            key={item.id}
            icon={<StorefrontOutlinedIcon />}
            title={item.product}
            subtitle={`Listing ID: ${item.id}`}
            status={item.status}
            rows={[
              ["Passport", item.passport],
              ["Condition", item.condition],
              ["Price", item.price],
              ["Views", item.views],
            ]}
          />
        ))}
      </div>
    </div>
  );
}

function RepairPanel({ repairs }: { repairs: typeof repairRequests }) {
  return (
    <div>
      <SectionHeading
        title="Repair Requests"
        text="View your repair bookings and completed repair service history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {repairs.map((item) => (
          <RecordCard
            key={item.id}
            icon={<BuildOutlinedIcon />}
            title={item.product}
            subtitle={`Repair ID: ${item.id}`}
            status={item.status}
            rows={[
              ["Passport", item.passport],
              ["Repair Type", item.type],
              ["Repair Center", item.center],
              ["Date", item.date],
            ]}
          />
        ))}
      </div>
    </div>
  );
}

function RecyclingPanel({
  requests,
}: {
  requests: typeof recyclingRequests;
}) {
  return (
    <div>
      <SectionHeading
        title="Recycling Requests"
        text="Track end-of-life processing, partner handover, and eco credits."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {requests.map((item) => (
          <RecordCard
            key={item.id}
            icon={<RecyclingOutlinedIcon />}
            title={item.product}
            subtitle={`Recycling ID: ${item.id}`}
            status={item.status}
            rows={[
              ["Passport", item.passport],
              ["Method", item.method],
              ["Center", item.center],
              ["Preferred Date", item.date],
              ["Credits", item.credits],
            ]}
          />
        ))}
      </div>
    </div>
  );
}

function ReportsPanel({ reports }: { reports: typeof issueReports }) {
  return (
    <div>
      <SectionHeading
        title="Issue Reports"
        text="Reports you submitted for product passport data quality review."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {reports.map((item) => (
          <RecordCard
            key={item.id}
            icon={<ReportProblemOutlinedIcon />}
            title={item.product}
            subtitle={`Report ID: ${item.id}`}
            status={item.status}
            rows={[
              ["Passport", item.passport],
              ["Issue Type", item.issue],
              ["Reported Date", item.date],
            ]}
          />
        ))}
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function HeroMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
      <p className="text-white/60 text-xs font-bold">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "blue" | "amber";
}) {
  const toneClass =
    tone === "green"
      ? "text-[#1B5E20] bg-[#F1F8F4] border-[#CFE8D2]"
      : tone === "blue"
      ? "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]"
      : "text-[#92400E] bg-[#FFF8DC] border-[#F59E0B]/30";

  return (
    <div className="bg-white rounded-[22px] border border-[#DDE8DF] p-5 shadow-sm">
      <div
        className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${toneClass}`}
      >
        {icon}
      </div>

      <p className="text-sm text-[#6B7280] font-bold mt-4">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-4 rounded-xl text-sm font-black whitespace-nowrap transition ${
        active
          ? "bg-[#1B5E20] text-white"
          : "bg-[#F8FAFC] text-[#475569] hover:bg-[#E8F5E9] hover:text-[#1B5E20]"
      }`}
    >
      {label}
    </button>
  );
}

function SectionHeading({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-[#6B7280] mt-2">{text}</p>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  text,
  time,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  time: string;
  tone: "green" | "blue" | "amber";
}) {
  const toneClass =
    tone === "green"
      ? "bg-[#F1F8F4] text-[#1B5E20]"
      : tone === "blue"
      ? "bg-[#EFF6FF] text-[#2563EB]"
      : "bg-[#FFF8DC] text-[#92400E]";

  return (
    <div className="flex items-start gap-4">
      <div
        className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${toneClass}`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h4 className="font-black">{title}</h4>
          <span className="text-xs text-[#94A3B8] font-bold">{time}</span>
        </div>
        <p className="text-sm text-[#6B7280] mt-1">{text}</p>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-[24px] border border-[#DDE8DF] p-6 shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-[0_8px_20px_rgba(27,94,32,0.08)]">
        {icon}
      </div>

      <h4 className="font-black mt-5">{title}</h4>
      <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{text}</p>

      <p className="text-xs font-black text-[#1B5E20] mt-4 flex items-center gap-1">
        Open
        <KeyboardArrowRightOutlinedIcon fontSize="small" />
      </p>
    </button>
  );
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0">
      <span className="text-white/65 text-sm">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const isGreen =
    normalized.includes("completed") ||
    normalized.includes("published") ||
    normalized.includes("eligible") ||
    normalized.includes("use");

  const isAmber =
    normalized.includes("pending") ||
    normalized.includes("draft") ||
    normalized.includes("review");

  const className = isGreen
    ? "bg-[#E8F5E9] text-[#1B5E20] border-[#CFE8D2]"
    : isAmber
    ? "bg-[#FFF8DC] text-[#92400E] border-[#F59E0B]/30"
    : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";

  return (
    <span
      className={`px-3 py-1 rounded-full border text-[10px] font-black whitespace-nowrap ${className}`}
    >
      {status}
    </span>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#EEF2F0] pb-2 last:border-b-0">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}

function RecordCard({
  icon,
  title,
  subtitle,
  status,
  rows,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: string;
  rows: string[][];
}) {
  return (
    <div className="bg-white rounded-[28px] border border-[#DDE8DF] p-6 shadow-sm hover:shadow-[0_18px_45px_rgba(15,61,30,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl border border-[#1B5E20]/20 bg-white text-[#1B5E20] flex items-center justify-center shadow-[0_8px_20px_rgba(27,94,32,0.08)]">
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <DataRow key={label} label={label} value={value} />
        ))}
      </div>

      <button className="mt-5 w-full h-11 rounded-xl border border-[#1B5E20] text-[#1B5E20] font-black hover:bg-[#E8F5E9] transition flex items-center justify-center gap-2">
        View Details
        <OpenInNewOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-[28px] border border-[#DDE8DF] p-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-[#F1F8F4] text-[#1B5E20] flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-xl font-black mt-5">{title}</h3>
      <p className="text-[#6B7280] mt-2">{text}</p>
    </div>
  );
}