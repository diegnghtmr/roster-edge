import { InternalHeader } from '@/components/layout/InternalHeader';
import { Plus, Users } from 'lucide-react';
import { StaffRolesList } from './components/List';
export const StaffRolesModule = () => {
  return (
    <div className="w-full">
      <div className="mb-4"></div>
      <InternalHeader
        title="Roles de Personal"
        description="Gestiona los roles del personal de tu organización"
        buttons={[
          {
            text: 'Personal',
            icon: <Users className="h-4 w-4" />,
            link: '/staff',
            variant: 'outline',
          },
          {
            text: 'Nuevo Rol',
            icon: <Plus className="h-4 w-4" />,
            link: '/staff-roles-create',
            variant: 'default',
          },
        ]}
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <StaffRolesList />
      </div>
    </div>
  );
};
