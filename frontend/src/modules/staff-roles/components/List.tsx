import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { StaffRole } from '@/interface/IStaffRole';
import { StaffRoleItemList } from './ItemList';

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

export const StaffRolesList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: staffRoles,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<StaffRole>({
    resource: ['staff-roles'],
    queryKey: 'staffRolesList',
    keyResults: 'data',
    resourceName: 'rol de personal',
    deleteSuccessMessage: 'Rol de personal eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el rol de personal',
  });

  // Render function for each row
  const renderRow = (staffRole: StaffRole) => (
    <StaffRoleItemList key={staffRole.id} staffRole={staffRole} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de roles de personal"
      >
        <DataTable
          data={staffRoles}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron roles de personal"
          className="mt-6"
          aria-label="Tabla de roles de personal"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="rol de personal"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El rol de personal será eliminado permanentemente del sistema."
      />
    </>
  );
};
