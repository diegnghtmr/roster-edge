import { InternalHeader } from '@/components/layout/InternalHeader';
import { NotificationsList } from './components/List';

export const NotificationsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Notificaciones"
        description="Consulta las notificaciones del sistema"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationsModule;
