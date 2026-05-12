import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import logisticsMenu from "./menu";

import FleetOverview from "./views/FleetOverview";
import ActiveShipments from "./views/ActiveShipments";
import ProofOfDelivery from "./views/ProofOfDelivery";
import EmissionsData from "./views/EmissionsData";

export default function Logistics() {
  return (
    <DashboardLayout
      menuItems={logisticsMenu}
      title="Logistics Dashboard"
    >
      <Routes>
        <Route
          path="/"
          element={<Navigate to="overview" />}
        />

        <Route
          path="overview"
          element={<FleetOverview />}
        />

        <Route
          path="shipments"
          element={<ActiveShipments />}
        />

        <Route
          path="proof-of-delivery"
          element={<ProofOfDelivery />}
        />

        <Route
          path="emissions"
          element={<EmissionsData />}
        />
      </Routes>
    </DashboardLayout>
  );
}
