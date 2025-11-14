import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { Team } from '@/interface/ITeam';
import { TeamItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Mascota', key: 'mascot' },
  { title: 'Fundación', key: 'foundation' },
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
  {
    key: 'mascot',
    label: 'Mascota',
    type: 'text',
    placeholder: 'Buscar por mascota...',
  },
];

export const TeamsList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: teams,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<Team>({
    resource: ['teams'],
    queryKey: 'teamsList',
    keyResults: 'data',
    resourceName: 'equipo',
    deleteSuccessMessage: 'Equipo eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el equipo',
  });

  // Render function for each row
  const renderRow = (team: Team) => (
    <TeamItemList key={team.id} team={team} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de equipos"
      >
        <DataTable
          data={teams}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron equipos"
          className="mt-6"
          aria-label="Tabla de equipos"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="equipo"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El equipo será eliminado permanentemente del sistema."
      />
    </>
  );
};
