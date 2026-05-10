import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const recyclerMenu = [
  {
    label: "Processing",
    path: "/recycler/processing",
    icon: <AutorenewRoundedIcon />,
  },

  {
    label: "Material Breakdown",
    path: "/recycler/material-breakdown",
    icon: <ScienceOutlinedIcon />,
  },

  {
    label: "DPP Lookup",
    path: "/recycler/dpp-lookup",
    icon: <TravelExploreOutlinedIcon />,
  },

  {
    label: "Lifecycle Close",
    path: "/recycler/lifecycle-close",
    icon: <TaskAltOutlinedIcon />,
  },
];

export default recyclerMenu;