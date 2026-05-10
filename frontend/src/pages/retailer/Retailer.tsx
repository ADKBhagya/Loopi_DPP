import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import retailerMenu from "./menu";

import Inventory from "./views/Inventory";
import PassportScanner from "./views/PassportScanner";
import Ownership from "./views/Ownership";
import SalesRecord from "./views/SalesRecord";
import AuditTrail from "./views/AuditTrail";

export default function Retailer() {
  return (
    <DashboardLayout
      menuItems={retailerMenu}
      title="Retailer Portal"
    >
      <Routes>

        <Route
          path="/"
          element={<Navigate to="inventory" />}
        />

        <Route
          path="inventory"
          element={<Inventory />}
        />

        <Route
          path="passport-scanner"
          element={<PassportScanner />}
        />

        <Route
          path="ownership"
          element={<Ownership />}
        />

        <Route
          path="sales-record"
          element={<SalesRecord />}
        />

        <Route
          path="audit-trail"
          element={<AuditTrail />}
        />

      </Routes>
    </DashboardLayout>
  );
}