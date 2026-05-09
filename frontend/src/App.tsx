import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Loading from "./pages/Loading";

import Admin from "./pages/admin/Admin";
import Manufacturer from "./pages/manufacturer/Manufacturer";
import Logistics from "./pages/logistics/Logistics";
import Auditor from "./pages/auditor/Auditor";
import Authority from "./pages/authority/Authority";
import Retailer from "./pages/retailer/Retailer";
import RepairCenter from "./pages/repaircenter/RepairCenter";
import Recycler from "./pages/recycler/Recycler";

import ConsumerHome from "./pages/consumer/ConsumerHome";
import PublicPassportView from "./pages/consumer/PublicPassportView";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/loading" element={<Loading />} />

      {/* PUBLIC CONSUMER ROUTE */}
      <Route path="/consumer" element={<ConsumerHome />} />
      <Route path="/consumer/passport/:passportId" element={<PublicPassportView />} />

      {/* PROTECTED ROLE ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manufacturer"
        element={
          <ProtectedRoute allowedRoles={["Manufacturer"]}>
            <Manufacturer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logistics"
        element={
          <ProtectedRoute allowedRoles={["Logistics"]}>
            <Logistics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/auditor/*"
        element={
          <ProtectedRoute allowedRoles={["Auditor"]}>
            <Auditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority"
        element={
          <ProtectedRoute allowedRoles={["Authority"]}>
            <Authority />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retailer/*"
        element={
          <ProtectedRoute allowedRoles={["Retailer"]}>
            <Retailer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/repair-center/*"
        element={
          <ProtectedRoute allowedRoles={["Repair Center"]}>
            <RepairCenter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recycler/*"
        element={
          <ProtectedRoute allowedRoles={["Recycler"]}>
            <Recycler />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;