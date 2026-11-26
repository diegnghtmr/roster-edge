import { useState } from 'react';
import { Drawer } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { navigationList } from '../sidebar/constants/navigationList';
import { Topbar } from './topbar/Topbar';

export default function AuthenticatedLayout() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="w-full absolute inset-0">
      {/* Top bar */}
      <Topbar toggleDrawer={toggleDrawer} />

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar navigationList={navigationList} />
      </div>

      {/* Mobile and tablet drawer */}
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
}
