import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StadiumIcon from "@mui/icons-material/Stadium";
import PlaceIcon from "@mui/icons-material/Place";
import GroupsIcon from "@mui/icons-material/Groups";
import BadgeIcon from "@mui/icons-material/Badge";
import AssessmentIcon from "@mui/icons-material/Assessment";
import type { INavigationList } from "../Sidebar";

export const navigationList: INavigationList[] = [
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
    name: "Equipos",
    path: "teams",
    icon: <GroupsIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Personal",
    path: "staff",
    icon: <BadgeIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Ciudades",
    path: "cities",
    icon: <LocationCityIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Países",
    path: "countries",
    icon: <PublicIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Monedas",
    path: "currencies",
    icon: <AttachMoneyIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Estadios",
    path: "stadiums",
    icon: <StadiumIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Sedes",
    path: "venues",
    icon: <PlaceIcon />,
    permissions: [],
    childrens: [],
  },
  {
    name: "Reportes",
    path: "reports",
    icon: <AssessmentIcon />,
    permissions: [],
    childrens: [],
  },
];
