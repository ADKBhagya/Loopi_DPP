import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import adminMenu from "./menu";

import Overview from "./views/Overview";
import UserManagement from "./views/UserManagement";
import BlockchainNetwork from "./views/BlockchainNetwork";
import SystemConfig from "./views/SystemConfig";

export default function Admin() {
  return (
    <DashboardLayout
      menuItems={adminMenu}
      title="Admin Dashboard"
    >
      <Routes>

        <Route
          path="/"
          element={<Navigate to="overview" />}
        />

        <Route
          path="overview"
          element={<Overview />}
        />

        <Route
          path="users"
          element={<UserManagement />}
        />

        <Route
          path="network"
          element={<BlockchainNetwork />}
        />

        <Route
          path="settings"
          element={<SystemConfig />}
        />

      </Routes>
    </DashboardLayout>
  );
}