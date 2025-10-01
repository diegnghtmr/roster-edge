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
import { type Key, memo } from "react";
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

  // Check if a menu item should be active
  const isCurrentPage = (currentPage: string) => {
    return `/${currentPage}` === location.pathname;
  };

  return (
    <Box
      role="presentation"
      className="md:fixed bg-white h-full xl:[height:calc(100%-60px)] z-[9] mt-0 overflow-y-auto no-scrollbar w-60"
    >
      <List>
        {navigationList.map((item: INavigationList, index: Key) => {
          if (item?.childrens.length > 0) {
            return (
              <div className="w-full mb-1" key={"menu-" + index}>
                <Accordion
                  className={clsx("bg-white p-0")}
                  style={{
                    backgroundColor: "inherit",
                    border: 0,
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-gray-900 " />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className="text-primary-900 ">{item.icon}</div>
                    <Typography className="ml-7 text-gray-900 " ml={2}>
                      {item.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="border-t border-slate-400 bg-white px-4 !py-0">
                    {item.childrens.map((children, index) => {
                      return (
                        <div
                          key={"submenu-" + index}
                          className={
                            "hover:bg-red-100 -mx-4 pl-2 bg-gray-200 " +
                            (isCurrentPage(children.path)
                              ? "bg-red-100 border-l-4 border-red-400 "
                              : "")
                          }
                        >
                          <Link to={children.path} key={index}>
                            <ListItem>
                              <div
                                className={
                                  " hover:font-semibold " +
                                  (isCurrentPage(children.path)
                                    ? "text-red-400 font-semibold"
                                    : "text-gray-900 ")
                                }
                              >
                                {children.icon}
                              </div>
                              <ListItemText
                                primary={children.name}
                                className={
                                  "ml-4 " +
                                  (isCurrentPage(children.path)
                                    ? "text-red-400 font-semibold"
                                    : "text-gray-900 ")
                                }
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
                  className={
                    "flex gap-4 new-center w-full py-[12px] px-4 hover:bg-red-100 hover: " +
                    (isCurrentPage(item.path)
                      ? "bg-red-100 border-l-4 border-red-400 "
                      : "")
                  }
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
                    className={
                      isCurrentPage(item.path)
                        ? "text-red-400 font-semibold"
                        : "text-gray-900 "
                    }
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
