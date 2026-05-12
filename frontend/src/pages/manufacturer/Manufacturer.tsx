import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import manufacturerMenu from "./menu";

import Dashboard from "./views/Dashboard";
import Shipments from "./views/Shipments";
import Certificates from "./views/Certificates";
import BlockchainExplorer from "./views/BlockchainExplorer";

export default function Manufacturer() {
  return (
    <DashboardLayout
      menuItems={manufacturerMenu}
      title="Manufacturer Dashboard"
    >
      <Routes>
        <Route
          path="/"
          element={<Navigate to="overview" />}
        />

        <Route
          path="overview"
          element={<Dashboard />}
        />

        <Route
          path="shipments"
          element={<Shipments />}
        />

        <Route
          path="certificates"
          element={<Certificates />}
        />

        <Route
          path="explorer"
          element={<BlockchainExplorer />}
        />
      </Routes>
    </DashboardLayout>
  );
}
