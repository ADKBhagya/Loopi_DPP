import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const retailerMenu = [
  {
    label: "Inventory",
    path: "/retailer/inventory",
    icon: <Inventory2OutlinedIcon />,
  },

  {
    label: "Passport Scanner",
    path: "/retailer/passport-scanner",
    icon: <QrCodeScannerOutlinedIcon />,
  },

  {
    label: "Sales Record",
    path: "/retailer/sales-record",
    icon: <ReceiptLongOutlinedIcon />,
  },

  {
    label: "Audit Trail",
    path: "/retailer/audit-trail",
    icon: <HistoryOutlinedIcon />,
  },
];

export default retailerMenu;