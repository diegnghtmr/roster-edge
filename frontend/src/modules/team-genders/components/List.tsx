import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { TeamGender } from '@/interface/ITeamGender';
import { TeamGenderItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
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

export const TeamGendersList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: teamGenders,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<TeamGender>({
    resource: ['team-genders'],
    queryKey: 'teamGendersList',
    keyResults: 'data',
    resourceName: 'género de equipo',
    deleteSuccessMessage: 'Género de equipo eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el género',
  });

  // Render function for each row
  const renderRow = (teamGender: TeamGender) => (
    <TeamGenderItemList key={teamGender.id} gender={teamGender} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de géneros de equipo"
      >
        <DataTable
          data={teamGenders}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron géneros de equipo"
          className="mt-6"
          aria-label="Tabla de géneros de equipo"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="género de equipo"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El género de equipo será eliminado permanentemente del sistema."
      />
    </>
  );
};
