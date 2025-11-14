import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus } from 'lucide-react';
import { SeasonsList } from './components/List';

export const SeasonsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Temporadas"
        description="Administra las temporadas deportivas"
        buttonText="Nueva Temporada"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/seasons-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <SeasonsList />
      </div>
    </div>
  );
};

export default SeasonsModule;
