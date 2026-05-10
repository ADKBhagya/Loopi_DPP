import { ReactNode, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
  menuItems: any[];
  title: string;
}

export default function DashboardLayout({
  children,
  menuItems,
  title,
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
      />

      {/* TOPBAR */}
      <Topbar
        title={title}
        onMenuClick={() => setMobileOpen(true)}
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