import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { IMatchday } from '@/interface/IMatchday';
import { MatchdayItem } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Acciones', key: 'actions', className: 'w-32' },
];

const filters: FilterConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar por nombre...',
  },
];

export const MatchdaysList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: matchdays,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<IMatchday>({
    resource: ['matchdays'],
    queryKey: 'matchdaysList',
    keyResults: 'data',
    resourceName: 'jornada',
    deleteSuccessMessage: 'Jornada eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la jornada',
  });

  // Render function for each row
  const renderRow = (matchday: IMatchday) => (
    <MatchdayItem key={matchday.id} matchday={matchday} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de jornadas"
      >
        <DataTable
          data={matchdays}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron jornadas"
          className="mt-6"
          aria-label="Tabla de jornadas"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="jornada"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La jornada será eliminada permanentemente del sistema."
      />
    </>
  );
};
