import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar.tsx';
import { Topbar } from './topbar/Topbar';
import { useEffect, useState } from 'react';
import { navigationList } from '../sidebar/constants/navigationList.tsx';
import useUserStore from '../../storage/storeUser.ts';
import { Drawer } from '@mui/material';

export const Layout = () => {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="w-full absolute inset-0">
      {/* Top bar */}
      <Topbar toggleDrawer={toggleDrawer} />

      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <Sidebar navigationList={navigationList} />
      </div>

      {/* Drawer para móvil/tablet */}
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Sidebar navigationList={navigationList} />
      </Drawer>

      {/* Main container */}
      <main className="mt-4 p-0 flex bg-100-gray w-full">
        <div className="w-full p-8 lg:pl-22 flex-1 transition-all duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
