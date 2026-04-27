import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Logistics from "./pages/Logistics";
import Auditor from "./pages/Auditor";
import Authority from "./pages/Authority";
import Retailer from "./pages/Retailer";
import RepairCenter from "./pages/RepairCenter";
import Recycler from "./pages/Recycler";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
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
      <Route path="/logistics" element={<Logistics />} />
      <Route path="/auditor" element={<Auditor />} />
      <Route path="/authority" element={<Authority />} />
      <Route path="/retailer" element={<Retailer />} />
      <Route path="/repair-center" element={<RepairCenter />} />
      <Route path="/recycler" element={<Recycler />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;