import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const auditorMenu = [
  {
    label: "Audit Queue",
    path: "/auditor/audit-queue",
    icon: <DashboardOutlinedIcon />,
  },
    {
    label: "Lifecycle Review",
    path: "/auditor/lifecycle-review",
    icon: <HistoryOutlinedIcon />,
  },
  {
    label: "Compliance Check",
    path: "/auditor/compliance-check",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    label: "Audit Trail",
    path: "/auditor/audit-trail",
    icon: <VerifiedOutlinedIcon />,
  },
];

export default auditorMenu;