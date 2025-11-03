import { Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useUserStore from "@/storage/storeUser";
import type { ILoginUser } from "@/interface/ILogin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ContentLogout from "../ContentLogout";
import { RosterProfileModal } from "../RosterProfileModal";

interface TopbarProps {
  toggleDrawer: (newOpen: boolean) => () => void;
}

const Profile = ({
  image,
  user,
}: {
  image: React.ReactNode;
  user: ILoginUser | null;
}) => {
  if (!user) return null;

  return <div className="flex items-center gap-2">{image}</div>;
};

export const Topbar = ({ toggleDrawer }: TopbarProps) => {
  const { user, clearUser } = useUserStore();
  const [, , removeCookie] = useCookies(["token"]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const navigate = useNavigate();

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
    <>
      <div className="h-16">
        <Box
          component="section"
          sx={{ p: 2 }}
          className="w-full flex justify-between items-center fixed bg-white z-40 border"
        >
          <div
            className="cursor-pointer block lg:hidden text-gray-900"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </div>
          <div className="flex items-center gap-6">
            <div className="py-2">
              <img src="roster-logo.webp" className="h-[46px]" alt="roster" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-600 flex items-center gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <HomeOutlinedIcon className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-600 flex items-center gap-2"
              onClick={() => navigate("/contact")}
            >
              <ContactMailOutlinedIcon className="h-4 w-4" />
              Contacto
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-600 flex items-center gap-2"
              onClick={() => navigate("/support")}
            >
              <SupportOutlinedIcon className="h-4 w-4" />
              Soporte Técnico
            </Button>
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                {user && (
                  <Profile
                    image={
                      <div className="bg-red-400 w-[40px] h-[40px] flex justify-center items-center text-white rounded-full uppercase">
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
      <RosterProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        onLogout={handleLogout}
      />
    </>
  );
};
