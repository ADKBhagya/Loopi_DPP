import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Manufacturer from "./pages/manufacturer/Manufacturer";
import Logistics from "./pages/Logistics";
import Auditor from "./pages/Auditor";
import Authority from "./pages/Authority";
import Retailer from "./pages/Retailer";
import RepairCenter from "./pages/RepairCenter";
import Recycler from "./pages/Recycler";
import Admin from "./pages/admin/Admin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Loading from "./pages/Loading";

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
<Route
  path="/logistics"
  element={
    <ProtectedRoute allowedRoles={["Logistics"]}>
      <Logistics />
    </ProtectedRoute>
  }
/>

<Route
  path="/auditor"
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
  path="/retailer"
  element={
    <ProtectedRoute allowedRoles={["Retailer"]}>
      <Retailer />
    </ProtectedRoute>
  }
/>

<Route
  path="/repair-center"
  element={
    <ProtectedRoute allowedRoles={["Repair Center"]}>
      <RepairCenter />
    </ProtectedRoute>
  }
/>

<Route
  path="/recycler"
  element={
    <ProtectedRoute allowedRoles={["Recycler"]}>
      <Recycler />
    </ProtectedRoute>
  }
/>
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/loading" element={<Loading />} />
    </Routes>
  );
}

export default App;