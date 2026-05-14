import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";

/* LAYOUT */
import DashboardLayout from "../../components/layout/DashboardLayout";
import repairCenterMenu from "./menu";

/* VIEWS */
import ServiceQueue from "./view/ServiceQueue";
import RepairRecords from "./view/RepairRecords";
import DppLookup from "./view/DppLookup";
import ServiceLogs from "./view/ServiceLogs";

function RepairCenter() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    apiFetch<any>("/repair-center/dashboard")
      .then(setDashboard)
      .catch((error) => {
        console.error("Failed to load repair center dashboard summary", error);
      });
  }, []);

  return (

    <DashboardLayout
      menuItems={repairCenterMenu}
      title="Repair Center"
      walletCredits={dashboard?.stats?.walletCredits ?? 0}
      networkLabel={
        dashboard?.network?.label
          ? `● ${dashboard.network.label}`
          : undefined
      }
    >

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="service-queue" />
          }
        />

        <Route
          path="service-queue"
          element={<ServiceQueue />}
        />

        

        <Route
          path="repair-records"
          element={<RepairRecords />}
        />

        <Route
          path="dpp-lookup"
          element={<DppLookup />}
        />
 
        <Route
          path="service-logs"
          element={<ServiceLogs />}
        />

      </Routes>

    </DashboardLayout>

  );
}

export default RepairCenter;
