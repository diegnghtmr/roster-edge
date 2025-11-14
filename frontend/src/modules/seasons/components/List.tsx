import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { ISeason } from '@/interface/ISeason';
import { SeasonItem } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },

  { title: 'Fecha Inicio', key: 'startDate' },
  { title: 'Fecha Fin', key: 'endDate' },

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

export const SeasonsList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: seasons,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<ISeason>({
    resource: ['seasons'],
    queryKey: 'seasonsList',
    keyResults: 'data',
    resourceName: 'temporada',
    deleteSuccessMessage: 'Temporada eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la temporada',
  });

  // Render function for each row
  const renderRow = (season: ISeason) => (
    <SeasonItem key={season.id} season={season} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de temporadas"
      >
        <DataTable
          data={seasons}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron temporadas"
          className="mt-6"
          aria-label="Tabla de temporadas"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="temporada"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La temporada será eliminada permanentemente del sistema."
      />
    </>
  );
};
