/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";
import { type Key, memo, useState } from "react";
import clsx from "clsx";

interface IChildren {
  name: string;
  path: string;
  icon: any;
  permissions: string[];
}
export interface INavigationList {
  name: string;
  path: string;
  icon: any;
  permissions: string[];
  childrens: IChildren[];
}
interface IProps {
  navigationList: INavigationList[];
}

const Sidebar = memo(({ navigationList }: IProps) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Check if a menu item should be active
  const isCurrentPage = (currentPage: string) => {
    return `/${currentPage}` === location.pathname;
  };

  return (
    <Box
      role="presentation"
      className="z-[1] pt-4 md:fixed bg-white h-full xl:[height:calc(100%-65px)] mt-0 overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out shadow-lg"
      style={{
        width: isHovered ? "240px" : "64px",
      }}
      onMouseEnter={() => window.innerWidth >= 1024 && setIsHovered(true)}
      onMouseLeave={() => window.innerWidth >= 1024 && setIsHovered(false)}
    >
      <List>
        {navigationList.map((item: INavigationList, index: Key) => {
          if (item?.childrens.length > 0) {
            return (
              <div className="w-full mb-1" key={"menu-" + index}>
                <Accordion
                  className={clsx("bg-white p-0 transition-all duration-300")}
                  style={{
                    backgroundColor: "inherit",
                    border: 0,
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      isHovered || window.innerWidth < 1024 ? (
                        <ExpandMoreIcon className="text-gray-900 transition-opacity duration-300" />
                      ) : (
                        <div className="w-6 h-6" />
                      )
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="transition-all duration-300"
                  >
                    <div className="text-primary-900 transition-all duration-300">
                      {item.icon}
                    </div>
                    <Typography
                      className={clsx(
                        "ml-7 text-gray-900 transition-all duration-300 whitespace-nowrap",
                        isHovered || window.innerWidth < 1024
                          ? "opacity-100"
                          : "opacity-0 w-0",
                      )}
                      ml={2}
                    >
                      {item.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    className={clsx(
                      "border-t border-slate-400 bg-white px-4 !py-0 transition-all duration-300",
                      isHovered || window.innerWidth < 1024
                        ? "opacity-100 max-h-screen"
                        : "opacity-0 max-h-0 overflow-hidden",
                    )}
                  >
                    {item.childrens.map((children, index) => {
                      return (
                        <div
                          key={"submenu-" + index}
                          className={
                            "hover:bg-red-100 -mx-4 pl-2 bg-gray-200 transition-all duration-300 " +
                            (isCurrentPage(children.path)
                              ? "bg-red-100 border-l-4 border-red-400 "
                              : "")
                          }
                        >
                          <Link to={children.path} key={index}>
                            <ListItem>
                              <div
                                className={
                                  " hover:font-semibold transition-all duration-300 " +
                                  (isCurrentPage(children.path)
                                    ? "text-red-400 font-semibold"
                                    : "text-gray-900 ")
                                }
                              >
                                {children.icon}
                              </div>
                              <ListItemText
                                primary={children.name}
                                className={clsx(
                                  "ml-4 transition-all duration-300 whitespace-nowrap",
                                  isCurrentPage(children.path)
                                    ? "text-red-400 font-semibold"
                                    : "text-gray-900",
                                  isHovered || window.innerWidth < 1024
                                    ? "opacity-100"
                                    : "opacity-0 w-0",
                                )}
                              />
                            </ListItem>
                          </Link>
                        </div>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          } else {
            return (
              <Link to={item.path} key={index}>
                <div
                  className={clsx(
                    "flex gap-4 new-center w-full py-[12px] px-4 hover:bg-red-100 transition-all duration-300",
                    isCurrentPage(item.path)
                      ? "bg-red-100 border-l-4 border-red-400 "
                      : "",
                  )}
                >
                  <div
                    className={
                      isCurrentPage(item.path)
                        ? "text-red-400 font-semibold"
                        : "text-gray-900 "
                    }
                  >
                    {item.icon}
                  </div>
                  <span
                    className={clsx(
                      "transition-all duration-300 whitespace-nowrap",
                      isCurrentPage(item.path)
                        ? "text-red-400 font-semibold"
                        : "text-gray-900",
                      isHovered || window.innerWidth < 1024
                        ? "opacity-100"
                        : "opacity-0 w-0",
                    )}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          }
        })}
      </List>
    </Box>
  );
});

export default Sidebar;
