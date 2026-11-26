import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
import useUserStore, { getSessionToken, rosterApiUrl } from '@/storage/storeUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ContentLogout from '../ContentLogout';
import { RosterProfileModal } from '../RosterProfileModal';

interface TopbarProps {
  toggleDrawer: (newOpen: boolean) => () => void;
}

async function revokeSession(token: string) {
  try {
    const response = await fetch(rosterApiUrl('/roster/logout/'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok && response.status !== 401) throw new Error('Logout request failed');
  } catch {
    toast.warning('Sesión cerrada en este navegador. No se pudo confirmar el cierre en el servidor.');
  }
}

export const Topbar = ({ toggleDrawer }: TopbarProps) => {
  const { user, clearUser } = useUserStore();
  const queryClient = useQueryClient();
  const [, , removeCookie] = useCookies(['token']);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenProfile = () => {
    setIsPopoverOpen(false);
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    const token = getSessionToken();
    setIsPopoverOpen(false);
    clearUser();
    removeCookie('token', { path: '/' });
    queryClient.clear();
    void navigate('/login', { replace: true });
    if (token) void revokeSession(token);
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
              <img src={`${import.meta.env.BASE_URL}roster-logo.webp`} className="h-[46px]" alt="roster" />
            </div>
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button type="button" aria-label="Menú de perfil" className="cursor-pointer flex items-center gap-2">
                {user && (
                  <span className="bg-red-400 w-[40px] h-[40px] flex justify-center items-center text-white rounded-full uppercase">
                    {user.name.slice(0, 2)}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <ContentLogout onOpenProfile={handleOpenProfile} onLogout={handleLogout} />
            </PopoverContent>
          </Popover>
        </Box>
      </div>
      {isProfileOpen && user && (
        <RosterProfileModal
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          onLogout={handleLogout}
          profile={user}
        />
      )}
    </>
  );
};
