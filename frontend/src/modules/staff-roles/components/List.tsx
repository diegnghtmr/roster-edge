import { useSearchParams } from 'react-router-dom';
import useGetList from '@/api/services/getServices/useGetList';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { StaffRole } from '@/interface/IStaffRole';
import { StaffRoleItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Fecha de creación', key: 'createdAt' },
];

const filters: FilterConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar por nombre...',
  },
];

export function StaffRolesList() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useGetList<StaffRole[]>({
    resource: ['staff-roles'],
    key: ['staffRolesList', searchParams.toString()],
    keyResults: 'data',
    params: searchParams,
  });

  return (
    <div
      className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
      role="region"
      aria-label="Lista de roles de personal"
    >
      <DataTable
        data={Array.isArray(data) ? data : []}
        headers={headers}
        filters={filters}
        renderRow={(staffRole) => <StaffRoleItemList key={staffRole.id} staffRole={staffRole} />}
        loading={isLoading}
        emptyMessage="No se encontraron roles de personal"
        className="mt-6"
        aria-label="Tabla de roles de personal"
      />
    </div>
  );
}
