import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";

const logisticsMenu = [
  {
    label: "Fleet Overview",
    path: "/logistics/overview",
    icon: <LocalShippingOutlinedIcon />,
  },
  {
    label: "Active Shipments",
    path: "/logistics/shipments",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    label: "Proof of Delivery",
    path: "/logistics/proof-of-delivery",
    icon: <VerifiedOutlinedIcon />,
  },
  {
    label: "Emissions Data",
    path: "/logistics/emissions",
    icon: <Co2OutlinedIcon />,
  },
];

export default logisticsMenu;
