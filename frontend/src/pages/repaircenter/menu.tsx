import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const repairCenterMenu = [
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

export default repairCenterMenu;
