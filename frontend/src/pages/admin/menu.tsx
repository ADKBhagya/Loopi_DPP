import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const adminMenu = [
  {
    label: "Overview",
    path: "/admin/overview",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: <GroupOutlinedIcon />,
  },
  {
    label: "Blockchain Network",
    path: "/admin/network",
    icon: <HubOutlinedIcon />,
  },
  {
    label: "System Config",
    path: "/admin/settings",
    icon: <SettingsOutlinedIcon />,
  },
];

export default adminMenu;