import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus } from 'lucide-react';
import { MatchdaysList } from './components/List';

export const MatchdaysModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Jornadas"
        description="Administra las jornadas deportivas"
        buttonText="Nueva Jornada"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/matchdays-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <MatchdaysList />
      </div>
    </div>
  );
};

export default MatchdaysModule;
