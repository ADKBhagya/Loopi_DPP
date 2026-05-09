import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import recyclerMenu from "./menu";

import Processing from "./views/Processing";
import MaterialBreakdown from "./views/MaterialBreakdown";
import DPPLookup from "./views/DPPLookup";
import LifecycleClose from "./views/LifecycleClose";

export default function Recycler() {
  return (
    <DashboardLayout
      menuItems={recyclerMenu}
      title="Recycler Portal"
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