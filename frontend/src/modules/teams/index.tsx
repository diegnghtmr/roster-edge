import { TeamsList } from './components/List';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus, Tag, User } from 'lucide-react';

export const TeamsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Equipos"
        description="Gestiona los equipos de tu organización"
        buttons={[
          {
            text: 'Categorías',
            icon: <Tag className="h-4 w-4" />,
            link: '/team-categories',
            variant: 'outline',
          },
          {
            text: 'Géneros',
            icon: <User className="h-4 w-4" />,
            link: '/team-genders',
            variant: 'outline',
          },
          {
            text: 'Nuevo Equipo',
            icon: <Plus className="h-4 w-4" />,
            link: '/teams-create',
            variant: 'default',
          },
        ]}
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamsList />
      </div>
    </div>
  );
};
