import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar.tsx';
import { Topbar } from './topbar/Topbar';
import { useEffect, useState } from 'react';
import { navigationList } from '../sidebar/constants/navigationList.tsx';
import useUserStore from '../../storage/storeUser.ts';
import { Drawer } from '@mui/material';
import { Spinner } from '@/components/ui/spinner';

export const Layout = () => {
  const status = useUserStore((state) => state.status);
  const restoreSession = useUserStore((state) => state.restoreSession);
  const [open, setOpen] = useState(false);
  const { pathname, search, hash } = useLocation();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (status !== 'restoring') return;
    const controller = new AbortController();
    void restoreSession(controller.signal);
    return () => controller.abort();
  }, [status, restoreSession]);

  if (status === 'restoring') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ returnTo: `${pathname}${search}${hash}` }} />;
  }

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
};
