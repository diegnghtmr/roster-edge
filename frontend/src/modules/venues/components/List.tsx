import React from 'react';
import useGetList from '@/api/services/getServices/useGetList';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import { VenueItemList } from './ItemList';
import type { IVenueResponse } from '@/interface/IVenue';
import type { City } from '@/interface/ICity';
import type { Club } from '@/interface/IClub';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Ciudad', key: 'cityId' },
  { title: 'Club', key: 'clubId' },
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

export const VenuesList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: venues,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<IVenueResponse>({
    resource: ['venues'],
    queryKey: 'venuesList',
    keyResults: 'data',
    resourceName: 'sede',
    deleteSuccessMessage: 'Sede eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la sede',
  });

  // Fetch cities for display names
  const { data: cities = [] } = useGetList<City[]>({
    key: 'cities',
    resource: ['cities'],
    keyResults: 'data',
    enabled: true,
  });

  // Fetch clubs for display names
  const { data: clubs = [] } = useGetList<Club[]>({
    key: 'clubs',
    resource: ['clubs'],
    keyResults: 'data',
    enabled: true,
  });

  // Render function for each row
  const renderRow = (venue: IVenueResponse) => (
    <VenueItemList
      key={venue.id}
      venue={venue}
      onDelete={handleDelete}
      cities={cities}
      clubs={clubs}
    />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de sedes"
      >
        <DataTable
          data={venues}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron sedes"
          className="mt-6"
          aria-label="Tabla de sedes"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="sede"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La sede será eliminada permanentemente del sistema."
      />
    </>
  );
};
