import { VenuesList } from './components/List';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus } from 'lucide-react';

export const VenuesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Sedes"
        description="Gestiona las sedes de tu organización"
        buttonText="Nueva Sede"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/venues-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <VenuesList />
      </div>
    </div>
  );
};
