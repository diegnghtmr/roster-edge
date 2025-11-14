import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { Currency } from '@/interface/ICurrency';
import { CurrencyItemList } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Nombre', key: 'name' },
  { title: 'Símbolo', key: 'symbol' },

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
    key: 'symbol',
    label: 'Símbolo',
    type: 'text',
    placeholder: 'Buscar por símbolo...',
  },
];

export const CurrenciesList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: currencies,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<Currency>({
    resource: ['currencies'],
    queryKey: 'currenciesList',
    keyResults: 'data',
    resourceName: 'moneda',
    deleteSuccessMessage: 'Moneda eliminada exitosamente',
    deleteErrorMessage: 'Error al eliminar la moneda',
  });

  // Render function for each row
  const renderRow = (currency: Currency) => (
    <CurrencyItemList key={currency.id} currency={currency} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de monedas"
      >
        <DataTable
          data={currencies}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron monedas"
          className="mt-6"
          aria-label="Tabla de monedas"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="moneda"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. La moneda será eliminada permanentemente del sistema."
      />
    </>
  );
};
