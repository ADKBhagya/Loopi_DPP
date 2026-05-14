import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { apiFetch } from "../../lib/api";

import recyclerMenu from "./menu";

import Processing from "./views/Processing";
import MaterialBreakdown from "./views/MaterialBreakdown";
import DPPLookup from "./views/DPPLookup";
import LifecycleClose from "./views/LifecycleClose";

export default function Recycler() {
  const [dashboard, setDashboard] = useState<any>({
    stats: {
      walletCredits: 0,
    },
    network: {
      label: "MAINNET ONLINE",
    },
  });

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const [processingResult, lifecycleResult] = await Promise.allSettled([
        apiFetch<any>("/recycler/processing"),
        apiFetch<any>("/recycler/lifecycle-close"),
      ]);

      if (!active) return;

      const processing =
        processingResult.status === "fulfilled"
          ? processingResult.value
          : { items: [], stats: {} };
      const lifecycle =
        lifecycleResult.status === "fulfilled"
          ? lifecycleResult.value
          : { passports: [], logs: [] };

      setDashboard({
        stats: {
          totalProcesses: processing.items?.length || 0,
          activeProcesses: processing.items?.length || 0,
          closedProcesses:
            lifecycle.passports?.filter((item: any) => item.status === "CLOSED").length || 0,
          readyToClose:
            lifecycle.passports?.filter((item: any) => item.status === "READY").length || 0,
          credits: processing.stats?.credits || 0,
          walletCredits: processing.stats?.credits || 0,
          logs: lifecycle.logs?.length || 0,
        },
        network: {
          label: "MAINNET ONLINE",
        },
      });
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout
      menuItems={recyclerMenu}
      title="Recycler Portal"
      walletCredits={dashboard?.stats?.walletCredits ?? dashboard?.stats?.credits ?? 0}
      networkLabel={dashboard?.network?.label || undefined}
    >
      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={<Navigate to="processing" />}
        />

        {/* PROCESSING */}
        <Route
          path="processing"
          element={<Processing />}
        />

       {/* MATERIAL BREAKDOWN */}
        <Route
          path="material-breakdown"
          element={<MaterialBreakdown />}  
        /> 

              {/* DPP LOOKUP */}
        <Route
          path="dpp-lookup"
          element={<DPPLookup />}
        /> 

        {/* LIFECYCLE CLOSE */}
        <Route
          path="lifecycle-close"
          element={<LifecycleClose />} 
        /> 

      </Routes>
    </DashboardLayout>
  );
} 
