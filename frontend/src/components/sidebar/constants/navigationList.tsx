import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import BarChartIcon from "@mui/icons-material/BarChart";
import type { INavigationList } from "../Sidebar";

export const navigationList: INavigationList[] = [
  {
    name: "Home",
    path: "dashboard",
    icon: <DashboardIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Users",
    path: "users",
    icon: <PeopleIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Events",
    path: "events",
    icon: <EventIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Teams",
    path: "teams",
    icon: <BarChartIcon />,
    permissions: [],
    childrens: [],
  },
];
