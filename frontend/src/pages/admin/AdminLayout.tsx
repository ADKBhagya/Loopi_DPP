import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";
import BlockchainNetwork from "./views/BlockchainNetwork";
import SystemConfig from "./views/SystemConfig";
import SecurityExplorer from "./components/SecurityExplorer";

export default function AdminLayout({ view, setView }: any) {

  // GLOBAL STATE FOR SECURITY EXPLORER
  const [showExplorer, setShowExplorer] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const OverviewComponent: any = Overview;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      <Sidebar
        view={view}
        setView={setView}
        pendingCount={pendingCount}
      />

      <Topbar onOpenExplorer={() => setShowExplorer(true)} />

      <main className="ml-[210px] pt-[72px] px-8 py-6">

        {view === "overview" && (
          <OverviewComponent
            setView={setView}
            onOpenExplorer={() => setShowExplorer(true)}
            setPendingCount={setPendingCount}
          />
        )}

        {view === "users" && (
          <UserManagement setPendingCount={setPendingCount} />
        )}
        {view === "network" && <BlockchainNetwork />}
        {view === "settings" && <SystemConfig />}
        
      </main>
      
      {showExplorer && (
        <SecurityExplorer onClose={() => setShowExplorer(false)} />
      )}

    </div>
  );
}