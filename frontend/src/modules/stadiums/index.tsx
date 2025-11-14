import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus } from 'lucide-react';
import { StadiumsList } from './components/List';

export const StadiumsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Estadios"
        description="Administra los estadios deportivos"
        buttonText="Nuevo Estadio"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/stadiums-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <StadiumsList />
      </div>
    </div>
  );
};

export default StadiumsModule;
