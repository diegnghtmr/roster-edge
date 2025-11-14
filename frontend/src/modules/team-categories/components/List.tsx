import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { TeamCategory } from '@/interface/ITeamCategory';
import { TeamCategoryItemList } from './ItemList';

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

export const TeamCategoriesList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: teamCategories,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<TeamCategory>({
    resource: ['team-categories'],
    queryKey: 'teamCategoriesList',
    keyResults: 'data',
    resourceName: 'categoría de equipo',
    deleteSuccessMessage: 'Categoría de equipo eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la categoría',
  });

  // Render function for each row
  const renderRow = (teamCategory: TeamCategory) => (
    <TeamCategoryItemList
      key={teamCategory.id}
      teamCategory={teamCategory}
      onDelete={handleDelete}
    />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de categorías de equipo"
      >
        <DataTable
          data={teamCategories}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron categorías de equipo"
          className="mt-6"
          aria-label="Tabla de categorías de equipo"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="categoría de equipo"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La categoría de equipo será eliminada permanentemente del sistema."
      />
    </>
  );
};
