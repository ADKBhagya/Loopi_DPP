import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import authorityMenu from "./menu";

import AuthorityControl from "./views/AuthorityControl";
import ComplianceReview from "./views/ComplianceReview";
import SustainabilityAudit from "./views/SustainabilityAudit";
import PublicRecords from "./views/PublicRecords";

export default function Authority() {
  return (
    <DashboardLayout
      menuItems={authorityMenu}
      title="Authority Dashboard"
    >
      <Routes>
        <Route
          path="/"
          element={<Navigate to="control" />}
        />

        <Route
          path="control"
          element={<AuthorityControl />}
        />

        <Route
          path="compliance-review"
          element={<ComplianceReview />}
        />

        <Route
          path="sustainability-audit"
          element={<SustainabilityAudit />}
        />

        <Route
          path="public-records"
          element={<PublicRecords />}
        />
      </Routes>
    </DashboardLayout>
  );
}
