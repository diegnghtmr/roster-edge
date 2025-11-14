import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus } from 'lucide-react';
import { MatchesList } from './components/List';

export const MatchesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Partidos"
        description="Administra los partidos deportivos"
        buttonText="Nuevo Partido"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/matches-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <MatchesList />
      </div>
    </div>
  );
};

export default MatchesModule;
