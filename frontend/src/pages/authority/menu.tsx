import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const authorityMenu = [
  {
    label: "Authority Control",
    path: "/authority/control",
    icon: <GppGoodOutlinedIcon />,
  },
  {
    label: "Compliance Review",
    path: "/authority/compliance-review",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    label: "Sustainability Audit",
    path: "/authority/sustainability-audit",
    icon: <ScienceOutlinedIcon />,
  },
  {
    label: "Public Records",
    path: "/authority/public-records",
    icon: <PublicOutlinedIcon />,
  },
];

export default authorityMenu;
