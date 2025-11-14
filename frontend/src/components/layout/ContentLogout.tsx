import { memo } from 'react';
import { Button } from '../ui/button';

interface ContentLogoutProps {
  onOpenProfile: () => void;
  onLogout: () => void;
}

const ContentLogout = memo(({ onOpenProfile, onLogout }: ContentLogoutProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button className="text-white cursor-pointer" onClick={onOpenProfile}>
        Ver perfil
      </Button>
      <Button className="text-white cursor-pointer" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
});

export default ContentLogout;
