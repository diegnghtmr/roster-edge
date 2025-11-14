import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus, Briefcase } from 'lucide-react';
import { StaffList } from './components/List';

export const StaffModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Personal"
        description="Gestiona el personal de tu organización"
        buttons={[
          {
            text: 'Roles',
            icon: <Briefcase className="h-4 w-4" />,
            link: '/staff-roles',
            variant: 'outline',
          },
          {
            text: 'Nuevo Personal',
            icon: <Plus className="h-4 w-4" />,
            link: '/staff-create',
            variant: 'default',
          },
        ]}
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <StaffList />
      </div>
    </div>
  );
};
