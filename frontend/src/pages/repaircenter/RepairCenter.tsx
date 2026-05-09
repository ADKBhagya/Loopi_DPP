import { Routes, Route, Navigate } from "react-router-dom";

/* LAYOUT */
import DashboardLayout from "../../components/layout/DashboardLayout";

/* VIEWS */
import ServiceQueue from "./view/ServiceQueue";
import RepairRecords from "./view/RepairRecords";
import DppLookup from "./view/DppLookup";
import ServiceLogs from "./view/ServiceLogs";

/* ICONS */
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

function RepairCenter() {

  const menuItems = [

    {
      label: "Service Queue",
      path: "/repair-center/service-queue",
      icon: <BuildOutlinedIcon />,
    },

    {
      label: "Repair Records",
      path: "/repair-center/repair-records",
      icon: <Inventory2OutlinedIcon />,
    },

    {
      label: "DPP Lookup",
      path: "/repair-center/dpp-lookup",
      icon: <QrCodeScannerOutlinedIcon />,
    },

    {
      label: "Service Logs",
      path: "/repair-center/service-logs",
      icon: <HistoryOutlinedIcon />,
    },

  ];

  return (

    <DashboardLayout
      menuItems={menuItems}
      title="Repair Center"
    >

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="service-queue" />
          }
        />

        <Route
          path="service-queue"
          element={<ServiceQueue />}
        />

        

        <Route
          path="repair-records"
          element={<RepairRecords />}
        />

        <Route
          path="dpp-lookup"
          element={<DppLookup />}
        />
 
        <Route
          path="service-logs"
          element={<ServiceLogs />}
        />

      </Routes>

    </DashboardLayout>

  );
}

export default RepairCenter;