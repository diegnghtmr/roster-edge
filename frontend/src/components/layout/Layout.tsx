import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.tsx";
import { Topbar } from "./topbar/Topbar";
import { useEffect, useState } from "react";
import { navigationList } from "../sidebar/constants/navigationList.tsx";
import useUserStore from "../../storage/storeUser.ts";

export const Layout = () => {
  const { user } = useUserStore();
  const [, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full absolute inset-0">
      {/* Top bar */}
      <Topbar toggleDrawer={toggleDrawer} />

      {/* Sidebar */}
      <Sidebar navigationList={navigationList} />

      {/* Main container */}
      <main className="mt-4 p-0 flex bg-100-gray w-full">
        <div className="w-full p-4 pl-4 lg:pl-64 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
