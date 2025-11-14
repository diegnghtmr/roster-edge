import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { Staff } from '@/interface/IStaff';
import { StaffItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre completo', key: 'fullName' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Fecha de nacimiento', key: 'birthDate' },
  { title: 'Fecha de contratación', key: 'hireDate' },
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
    key: 'lastName',
    label: 'Apellido',
    type: 'text',
    placeholder: 'Buscar por apellido...',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Buscar por email...',
  },
];

export const StaffList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: staff,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<Staff>({
    resource: ['staff'],
    queryKey: 'staffList',
    keyResults: 'data',
    resourceName: 'miembro del personal',
    deleteSuccessMessage: 'Personal eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el personal',
  });

  // Render function for each row
  const renderRow = (staffMember: Staff) => (
    <StaffItemList key={staffMember.id} staff={staffMember} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de personal"
      >
        <DataTable
          data={staff}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron miembros del personal"
          className="mt-6"
          aria-label="Tabla de personal"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="miembro del personal"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El miembro del personal será eliminado permanentemente del sistema."
      />
    </>
  );
};
