import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { City } from '@/interface/ICity';
import type { Country } from '@/interface/ICountry';
import useGetList from '@/api/services/getServices/useGetList';
import { CityItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'País', key: 'countryName' },
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

export const CitiesList: React.FC = () => {
  // Main list logic with useResourceList hook
  const {
    items: citiesData,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<City>({
    resource: ['cities'],
    queryKey: 'citiesList',
    keyResults: 'data',
    resourceName: 'ciudad',
    deleteSuccessMessage: 'Ciudad eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la ciudad',
  });

  // Additional fetch for countries to display country names
  const { data: countriesData } = useGetList<Country[]>({
    key: 'citiesCountriesList',
    resource: ['countries'],
    keyResults: 'data',
    enabled: true,
  });

  // Map country IDs to names
  const countryMap = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) {
      return new Map<number, string>();
    }
    return new Map<number, string>(countriesData.map((country) => [country.id, country.name]));
  }, [countriesData]);

  // Enrich cities with country names
  const cities: City[] = React.useMemo(() => {
    if (!citiesData) return [];
    return citiesData.map((city) => ({
      ...city,
      countryName: countryMap.get(city.countryId) ?? city.countryName ?? null,
    }));
  }, [citiesData, countryMap]);

  // Render function for each row
  const renderRow = (city: City) => (
    <CityItemList key={city.id} city={city} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de ciudades"
      >
        <DataTable
          data={cities}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron ciudades"
          className="mt-6"
          aria-label="Tabla de ciudades"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="ciudad"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La ciudad será eliminada permanentemente del sistema."
      />
    </>
  );
};
