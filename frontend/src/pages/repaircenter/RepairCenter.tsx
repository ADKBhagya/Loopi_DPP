import { Routes, Route, Navigate } from "react-router-dom";

/* LAYOUT */
import DashboardLayout from "../../components/layout/DashboardLayout";
import repairCenterMenu from "./menu";

/* VIEWS */
import ServiceQueue from "./view/ServiceQueue";
import RepairRecords from "./view/RepairRecords";
import DppLookup from "./view/DppLookup";
import ServiceLogs from "./view/ServiceLogs";

function RepairCenter() {
  return (

    <DashboardLayout
      menuItems={repairCenterMenu}
      title="Repair Center"
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
