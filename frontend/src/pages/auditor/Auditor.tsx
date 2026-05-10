import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import auditorMenu from "./menu";

import AuditQueue from "./views/AuditQueue";
import ComplianceCheck from "./views/ComplianceCheck";
import AuditTrail from "./views/AuditTrail";
import LifecycleReview from "./views/LifecycleReview";

export default function Auditor() {
  return (
    <DashboardLayout
      menuItems={auditorMenu}
      title="Auditor Dashboard"
    >
      <Routes>

        <Route
          path="/"
          element={<Navigate to="audit-queue" />}
        />

        <Route
          path="audit-queue"
          element={<AuditQueue />}
        />

        <Route
          path="lifecycle-review"
          element={<LifecycleReview />}
        />

        <Route
          path="compliance-check"
          element={<ComplianceCheck />}
        />

        <Route
          path="audit-trail"
          element={<AuditTrail />}
        />

      </Routes>
    </DashboardLayout>
  );
}