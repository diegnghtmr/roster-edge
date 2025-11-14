import React from 'react';
import { useResourceList } from '@shared/hooks';
import { DeleteConfirmDialog } from '@shared/components';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import type { FilterConfig } from '@/components/table/SearchComponent';
import type { IMatchSummary } from '@/interface/IMatchSummary';
import { MatchItem } from './ItemList';

const headers: TableColumn[] = [
  { title: 'ID', key: 'id', className: 'w-16' },
  { title: 'Fecha', key: 'date' },
  { title: 'Horario', key: 'time' },
  { title: 'Local', key: 'homeTeam' },
  { title: 'Visitante', key: 'awayTeam' },
  { title: 'Acciones', key: 'actions', className: 'w-32' },
];

const filters: FilterConfig[] = [
  {
    key: 'dateFrom',
    label: 'Fecha desde',
    type: 'date',
  },
  {
    key: 'dateTo',
    label: 'Fecha hasta',
    type: 'date',
  },
];

export const MatchesList: React.FC = () => {
  // All duplicate logic extracted to reusable hook
  const {
    items: matches,
    isLoading,
    itemToDelete,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useResourceList<IMatchSummary>({
    resource: ['matches', 'schedule'],
    deleteResource: ['matches'],
    queryKey: 'matchesList',
    keyResults: 'data',
    resourceName: 'partido',
    deleteSuccessMessage: 'Partido eliminado exitosamente',
    deleteErrorMessage: 'Error al eliminar el partido',
  });

  // Render function for each row
  const renderRow = (match: IMatchSummary) => (
    <MatchItem key={match.id} match={match} onDelete={handleDelete} />
  );

  return (
    <>
      <div
        className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4"
        role="region"
        aria-label="Lista de partidos"
      >
        <DataTable
          data={matches}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron partidos"
          className="mt-6"
          aria-label="Tabla de partidos"
        />
      </div>

      <DeleteConfirmDialog
        isOpen={itemToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        resourceName="partido"
        isDeleting={isDeleting}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. El partido será eliminado permanentemente del sistema."
      />
    </>
  );
};
