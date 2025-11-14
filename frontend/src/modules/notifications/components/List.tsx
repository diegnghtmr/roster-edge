import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { Notification } from '@/interface/INotification';
import { NotificationItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Mensaje', key: 'message' },
  { title: 'Enviado', key: 'sendDate' },
  { title: 'Clubes', key: 'relatedClubs' },
  { title: 'Eventos', key: 'relatedEvents' },
];

const filters: FilterConfig[] = [
  {
    key: 'message',
    label: 'Mensaje',
    type: 'text',
    placeholder: 'Buscar por mensaje...',
  },
  {
    key: 'sendFrom',
    label: 'Enviado desde',
    type: 'date',
  },
  {
    key: 'sendTo',
    label: 'Enviado hasta',
    type: 'date',
  },
];

export const NotificationsList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const { items: notifications, isLoading } = useResourceList<Notification>({
    resource: ['notifications'],
    queryKey: 'notificationsList',
    keyResults: 'data',
    resourceName: 'notificación',
  });

  // Render function for each row
  const renderRow = (notification: Notification) => (
    <NotificationItemList key={notification.id} notification={notification} />
  );

  return (
    <div
      className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
      role="region"
      aria-label="Lista de notificaciones"
    >
      <DataTable
        data={notifications}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={isLoading}
        emptyMessage="No se encontraron notificaciones"
        className="mt-6"
        aria-label="Tabla de notificaciones"
      />
    </div>
  );
};
