import { InternalHeader } from '@/components/layout/InternalHeader';
import { UsersList } from './components';

export const UsersModule = () => {
  return (
    <div className="w-full">
      <InternalHeader title="Usuarios" description="Consulta los usuarios del sistema" />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <UsersList />
      </div>
    </div>
  );
};

export default UsersModule;
