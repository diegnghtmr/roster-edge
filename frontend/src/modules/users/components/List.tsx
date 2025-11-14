import React from 'react';
import useGetList from '@/api/services/getServices/useGetList';
import { useResourceList } from '@shared/hooks';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { User } from '@/interface/IUser';
import type { City } from '@/interface/ICity';
import { UserItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Fecha de nacimiento', key: 'birthDate' },
  { title: 'Ciudad', key: 'cityName' },
  { title: 'Activo', key: 'active' },
];

const filters: FilterConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar por nombre...',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Buscar por email...',
  },
  {
    key: 'active',
    label: 'Activo',
    type: 'select',
    options: [
      { key: 'true', value: 'Sí' },
      { key: 'false', value: 'No' },
    ],
  },
];

export const UsersList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const { items: usersData, isLoading } = useResourceList<User>({
    resource: ['users'],
    queryKey: 'usersList',
    keyResults: 'data',
    resourceName: 'usuario',
  });

  // Fetch cities to enrich user data with city names
  const { data: citiesData } = useGetList<City[]>({
    key: 'usersCitiesList',
    resource: ['cities'],
    keyResults: 'data',
    enabled: true,
  });

  const cityMap = React.useMemo(() => {
    if (!citiesData || !Array.isArray(citiesData)) {
      return new Map<number, string>();
    }
    return new Map<number, string>(citiesData.map((city) => [city.id, city.name]));
  }, [citiesData]);

  // Enrich user data with city names
  const users: User[] = React.useMemo(() => {
    return usersData.map((user) => {
      const cityName = user.cityId != null ? (cityMap.get(user.cityId) ?? user.cityName) : null;
      return {
        ...user,
        cityName: cityName ?? null,
      };
    });
  }, [usersData, cityMap]);

  // Render function for each row
  const renderRow = (user: User) => <UserItemList key={user.id} user={user} />;

  return (
    <div
      className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
      role="region"
      aria-label="Lista de usuarios"
    >
      <DataTable
        data={users}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={isLoading}
        emptyMessage="No se encontraron usuarios"
        className="mt-6"
        aria-label="Tabla de usuarios"
      />
    </div>
  );
};
