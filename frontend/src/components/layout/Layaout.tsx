import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { Box, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { navigationList } from "../sidebar/constants/navigationList.tsx";
import useUserStore from "../../storage/storeUser.ts";
import type { ILoginUser } from "@/interface/ILogin.ts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ContentLogout from "./ContentLogout.tsx";
import { RosterProfileModal } from "./RosterProfileModal";

const Profile = ({
  image,
  user,
}: {
  image: React.ReactNode;
  user: ILoginUser | null;
}) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-2">
      {image}
      <span className="text-sm font-medium">{user.name}</span>
    </div>
  );
};

export const Layout = () => {
  const { user, clearUser } = useUserStore();
  const [, , removeCookie] = useCookies(["token"]);
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleOpenProfile = () => {
    setIsPopoverOpen(false);
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    setIsPopoverOpen(false);
    clearUser();
    removeCookie("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full absolute inset-0">
      <div className="h-16">
        <Box
          component="section"
          sx={{ p: 2 }}
          className="w-full flex justify-between items-center fixed bg-white z-40 border "
        >
          <div
            className="cursor-pointer block lg:hidden text-gray-900 "
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </div>
          <div className="py-2">
            <img src="roster-logo.jpeg" className="h-[32px]" alt="roster" />
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                {user && (
                  <Profile
                    image={
                      <div className="bg-blue-400 w-[40px] h-[40px] flex justify-center items-center text-white rounded-full uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                    }
                    user={user}
                  />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <ContentLogout 
                onOpenProfile={handleOpenProfile}
                onLogout={handleLogout}
              />
            </PopoverContent>
          </Popover>
        </Box>
      </div>
      <div className="mt-4 p-0 flex bg-gray-100 w-full min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:block">
          <Sidebar navigationList={navigationList} />
        </div>
        <Drawer
          open={open}
          className="fixed lg:hidden"
          onClose={toggleDrawer(false)}
        >
          <Sidebar navigationList={navigationList} />
        </Drawer>
        <div className="w-full p-4 pl-4 lg:pl-64 flex-1">
          <Outlet />
        </div>
      </div>
      
      <RosterProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        onLogout={handleLogout}
      />
    </div>
  );
};
