import { ReactNode, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
  menuItems: any[];
  title: string;
  walletCredits?: number | string;
  networkLabel?: string;
}

export default function DashboardLayout({
  children,
  menuItems,
  title,
  walletCredits,
  networkLabel,
}: Props) {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="bg-[#F7F8FA] min-h-screen overflow-x-hidden">

      {/* SIDEBAR */}
      <Sidebar
        menuItems={menuItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        walletCredits={walletCredits}
      />

      {/* TOPBAR */}
      <Topbar
        title={title}
        onMenuClick={() => setMobileOpen(true)}
        networkLabel={networkLabel}
        walletCredits={walletCredits}
      />

      {/* CONTENT */}
      <main
        className="
          pt-[72px]
          lg:ml-[210px]
          min-h-screen
        "
      >

        <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>

      </main>

    </div>
  );
}
