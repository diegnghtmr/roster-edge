import { useState, useMemo } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { SeasonStandingsPDF } from '@/components/reports/pdf/SeasonStandingsPDF';
import { useSeasonStandingsReport } from '@/api/services/reports/useReportsData';
import { useSeasonsForFilter, useClubsForFilter } from '@/api/services/filters/useFilterOptions';
import { ArrowLeft, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeasonStandingResponse } from '@/interface/IReports';

const tableHeaders: TableColumn[] = [
  { title: 'Pos', key: 'rankingPosition', className: 'w-16' },
  { title: 'Equipo', key: 'teamName' },
  { title: 'PJ', key: 'played', className: 'w-20' },
  { title: 'G', key: 'wins', className: 'w-16' },
  { title: 'E', key: 'draws', className: 'w-16' },
  { title: 'P', key: 'losses', className: 'w-16' },
  { title: 'GF', key: 'goalsFor', className: 'w-20' },
  { title: 'GC', key: 'goalsAgainst', className: 'w-20' },
  { title: 'DG', key: 'goalDifference', className: 'w-20' },
  { title: 'Pts', key: 'points', className: 'w-20' },
];

export const SeasonStandingsReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({});

  // Fetch filter options
  const { options: clubOptions, isLoading: clubsLoading } = useClubsForFilter();
  const { options: seasonOptions, isLoading: seasonsLoading } = useSeasonsForFilter(
    filters.clubId ? Number(filters.clubId) : undefined
  );

  // Dynamic filter fields with loaded options
  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'clubId',
        label: 'Club',
        type: 'select',
        options: clubOptions,
        placeholder: clubsLoading ? 'Cargando...' : 'Seleccionar club',
      },
      {
        key: 'seasonId',
        label: 'Temporada',
        type: 'select',
        options: seasonOptions,
        placeholder: seasonsLoading ? 'Cargando...' : 'Seleccionar temporada',
      },
    ],
    [clubOptions, clubsLoading, seasonOptions, seasonsLoading]
  );

  const { data, isLoading } = useSeasonStandingsReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    // If changing club, clear dependent filters
    if (key === 'clubId') {
      setFilters({ clubId: value });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    // Convert string IDs to numbers for API
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (key.endsWith('Id') && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const standings = (data || []) as SeasonStandingResponse[];

  // Calculate stats
  const totalTeams = standings.length;
  const avgPoints =
    standings.length > 0
      ? (standings.reduce((sum, team) => sum + (team.points || 0), 0) / standings.length).toFixed(1)
      : '0';
  const topScorer =
    standings.length > 0
      ? standings.reduce(
          (max, team) => ((team.goalsFor || 0) > (max.goalsFor || 0) ? team : max),
          standings[0]
        )
      : null;

  const renderRow = (standing: SeasonStandingResponse, index: number) => (
    <tr
      key={`${standing.teamId ?? 'team'}-${standing.seasonId ?? 'season'}-${standing.clubId ?? 'club'}-${index}`}
    >
      <td className="px-4 py-3 text-center font-semibold">{standing.rankingPosition || '-'}</td>
      <td className="px-4 py-3">
        <div>
          <div className="font-medium">{standing.teamName}</div>
          <div className="text-sm text-gray-500">{standing.clubName}</div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">{standing.played || 0}</td>
      <td className="px-4 py-3 text-center text-green-600 font-medium">{standing.wins || 0}</td>
      <td className="px-4 py-3 text-center text-gray-600">{standing.draws || 0}</td>
      <td className="px-4 py-3 text-center text-red-600 font-medium">{standing.losses || 0}</td>
      <td className="px-4 py-3 text-center">{standing.goalsFor || 0}</td>
      <td className="px-4 py-3 text-center">{standing.goalsAgainst || 0}</td>
      <td
        className={`px-4 py-3 text-center font-medium ${
          (standing.goalDifference || 0) > 0
            ? 'text-green-600'
            : (standing.goalDifference || 0) < 0
              ? 'text-red-600'
              : 'text-gray-600'
        }`}
      >
        {standing.goalDifference || 0}
      </td>
      <td className="px-4 py-3 text-center font-bold text-blue-600">{standing.points || 0}</td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Tabla de Posiciones"
        description="Clasificación de equipos por temporada"
        buttons={[
          {
            text: 'Volver',
            icon: <ArrowLeft className="h-4 w-4" />,
            link: '/reports',
            variant: 'outline',
          },
        ]}
      />

      <div className="bg-white w-full shadow-md rounded-lg min-h-screen p-6 space-y-6">
        {/* Filters */}
        <ReportFilters
          fields={filterFields}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Equipos en Competencia"
            value={totalTeams}
            icon={<Trophy className="h-5 w-5" />}
          />
          <StatCard
            title="Promedio de Puntos"
            value={avgPoints}
            subtitle="por equipo"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Máximo Goleador"
            value={topScorer?.goalsFor || 0}
            subtitle={topScorer?.teamName || '-'}
            icon={<Target className="h-5 w-5" />}
          />
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <ExportButton
            document={<SeasonStandingsPDF data={standings} seasonName={standings[0]?.seasonName} />}
            fileName={`tabla-posiciones-${standings[0]?.seasonName || 'reporte'}`}
            disabled={standings.length === 0}
          />
        </div>

        {/* Charts */}
        {!isLoading && standings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Puntos por Equipo (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={standings.slice(0, 10).map((s) => ({
                    nombre: s.teamName || 'Sin nombre',
                    puntos: s.points || 0,
                  }))}
                  xKey="nombre"
                  bars={[{ key: 'puntos', name: 'Puntos', color: '#3b82f6' }]}
                  yAxisLabel="Puntos"
                  height={400}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Victorias por Equipo (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={standings.slice(0, 10).map((s) => ({
                    nombre: s.teamName || 'Sin nombre',
                    victorias: s.wins || 0,
                  }))}
                  xKey="nombre"
                  bars={[{ key: 'victorias', name: 'Victorias', color: '#10b981' }]}
                  yAxisLabel="Victorias"
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <DataTable
            data={standings}
            headers={tableHeaders}
            renderRow={(item, index) => renderRow(item, index)}
            loading={isLoading}
            emptyMessage="No se encontraron datos para la temporada seleccionada"
          />
        </div>
      </div>
    </div>
  );
};
