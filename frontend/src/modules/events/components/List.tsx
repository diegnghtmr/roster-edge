import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { IEvent } from '@/interface/IEvent';
import { EventItem } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Fecha', key: 'date' },
  { title: 'Acciones', key: 'actions', className: 'w-32' },
];

const filters: FilterConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar por nombre...',
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Buscar por descripción...',
  },
];

export const EventsList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: events,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<IEvent>({
    resource: ['events'],
    queryKey: 'eventsList',
    keyResults: 'data',
    resourceName: 'evento',
    deleteSuccessMessage: 'Evento eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el evento',
  });

  // Render function for each row
  const renderRow = (event: IEvent) => (
    <EventItem key={event.id} event={event} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de eventos"
      >
        <DataTable
          data={events}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron eventos"
          className="mt-6"
          aria-label="Tabla de eventos"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="evento"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El evento será eliminado permanentemente del sistema."
      />
    </>
  );
};
