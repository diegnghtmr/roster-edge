import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { IStadium } from '@/interface/IStadium';
import { StadiumItem } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Capacidad', key: 'capacity' },
  { title: 'Fecha de creación', key: 'createdAt' },
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

export const StadiumsList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: stadiums,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<IStadium>({
    resource: ['stadiums'],
    queryKey: 'stadiumsList',
    keyResults: 'data',
    resourceName: 'estadio',
    deleteSuccessMessage: 'Estadio eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el estadio',
  });

  // Render function for each row
  const renderRow = (stadium: IStadium) => (
    <StadiumItem key={stadium.id} stadium={stadium} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de estadios"
      >
        <DataTable
          data={stadiums}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron estadios"
          className="mt-6"
          aria-label="Tabla de estadios"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="estadio"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El estadio será eliminado permanentemente del sistema."
      />
    </>
  );
};
