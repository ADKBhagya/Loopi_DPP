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

    const loadDashboardSummary = async () => {
      const [queueResult, recordsResult, logsResult] = await Promise.allSettled([
        apiFetch<any>("/repair-center/queue"),
        apiFetch<any>("/repair-center/records"),
        apiFetch<any>("/repair-center/logs"),
      ]);

      if (!active) return;

      const queue =
        queueResult.status === "fulfilled" ? queueResult.value : { jobs: [], stats: {} };
      const records =
        recordsResult.status === "fulfilled" ? recordsResult.value : { records: [] };
      const logs = logsResult.status === "fulfilled" ? logsResult.value : { logs: [] };

      const recordRows = records.records || [];
      const queueRows = queue.jobs || [];
      const allServices = [...recordRows, ...queueRows];

      setDashboard({
        stats: {
          totalServices:
            queue.stats?.totalServices || recordRows.length || queueRows.length || 0,
          completed: recordRows.filter((record: any) => record.status === "COMPLETED").length,
          inProgress:
            queue.stats?.inProgress ||
            allServices.filter((record: any) => record.status === "IN PROGRESS").length,
          queued:
            queue.stats?.queued ||
            allServices.filter((record: any) => record.status === "QUEUED").length,
          logs: logs.logs?.length || 0,
          walletCredits: queue.stats?.walletCredits || 0,
        },
        network: {
          label: "MAINNET ONLINE",
        },
      });
    };

    loadDashboardSummary();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout
      menuItems={repairCenterMenu}
      title="Repair Center"
      walletCredits={dashboard?.stats?.walletCredits ?? 0}
      networkLabel={dashboard?.network?.label || undefined}
    >
      <Routes>
        <Route path="/" element={<Navigate to="service-queue" />} />
        <Route path="service-queue" element={<ServiceQueue />} />
        <Route path="repair-records" element={<RepairRecords />} />
        <Route path="dpp-lookup" element={<DppLookup />} />
        <Route path="service-logs" element={<ServiceLogs />} />
      </Routes>
    </DashboardLayout>
  );
}

export default RepairCenter;
