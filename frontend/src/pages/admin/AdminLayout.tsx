import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";
import BlockchainNetwork from "./views/BlockchainNetwork";
import SystemConfig from "./views/SystemConfig";

export default function AdminLayout({ view, setView }: any) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Sidebar view={view} setView={setView} />
      <Topbar />

      <main className="ml-[210px] pt-[72px] px-8 py-6">
        {view === "overview" && <Overview />}
        {view === "users" && <UserManagement />}
        {view === "network" && <BlockchainNetwork />}
        {view === "settings" && <SystemConfig />}
        
      </main>
    </div>
  );
}