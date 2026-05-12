import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const manufacturerMenu = [
  {
    label: "Overview",
    path: "/manufacturer/overview",
    icon: <GridViewOutlinedIcon />,
  },
  {
    label: "Shipments",
    path: "/manufacturer/shipments",
    icon: <LocalShippingOutlinedIcon />,
  },
  {
    label: "Certificates",
    path: "/manufacturer/certificates",
    icon: <VerifiedOutlinedIcon />,
  },
  {
    label: "Blockchain Explorer",
    path: "/manufacturer/explorer",
    icon: <AccountTreeOutlinedIcon />,
  },
];

export default manufacturerMenu;
