import { useState, useMemo } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { ScoringRankingPDF } from '@/components/reports/pdf/ScoringRankingPDF';
import { useScoringRankingReport } from '@/api/services/reports/useReportsData';
import { useSeasonsForFilter, useClubsForFilter } from '@/api/services/filters/useFilterOptions';
import { ArrowLeft, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScoringRankingResponse } from '@/interface/IReports';

const tableHeaders: TableColumn[] = [
  { title: 'Equipo', key: 'teamName' },
  { title: 'Club', key: 'clubName' },
  { title: 'PJ', key: 'matchesPlayed', className: 'w-20' },
  { title: 'GF', key: 'goalsFor', className: 'w-20' },
  { title: 'GC', key: 'goalsAgainst', className: 'w-20' },
  { title: 'DG', key: 'goalDifference', className: 'w-20' },
  { title: 'GF/PJ', key: 'goalsPerMatch', className: 'w-24' },
  { title: 'GC/PJ', key: 'goalsAgainstPerMatch', className: 'w-24' },
];

export const ScoringRankingReport = () => {
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
        placeholder: clubsLoading ? 'Cargando...' : 'Seleccionar club (opcional)',
      },
      {
        key: 'seasonId',
        label: 'Temporada',
        type: 'select',
        options: seasonOptions,
        placeholder: seasonsLoading ? 'Cargando...' : 'Seleccionar temporada (opcional)',
      },
      {
        key: 'minMatches',
        label: 'Mínimo de partidos',
        type: 'number',
        placeholder: 'Ej: 5 (opcional)',
      },
    ],
    [clubOptions, clubsLoading, seasonOptions, seasonsLoading]
  );

  const { data, isLoading } = useScoringRankingReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    if (key === 'clubId') {
      setFilters({ ...filters, clubId: value, seasonId: undefined });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (key.endsWith('Id') && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else if (key === 'minMatches' && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const rankings = (data || []) as ScoringRankingResponse[];

  // Calculate stats
  const totalGoals = rankings.reduce((sum, team) => sum + (team.goalsFor || 0), 0);
  const topScorer =
    rankings.length > 0
      ? rankings.reduce(
          (max, team) => ((team.goalsFor || 0) > (max.goalsFor || 0) ? team : max),
          rankings[0]
        )
      : null;
  const bestDefense =
    rankings.length > 0
      ? rankings.reduce(
          (min, team) => ((team.goalsAgainst || 0) < (min.goalsAgainst || 0) ? team : min),
          rankings[0]
        )
      : null;

  // Chart data
  const chartData = rankings.slice(0, 10).map((team, index) => ({
    id: `${team.teamId ?? 'team'}-${team.seasonId ?? 'season'}-${team.clubId ?? 'club'}-${index}`,
    name: team.teamName || 'Sin nombre',
    gf: team.goalsFor || 0,
    gc: team.goalsAgainst || 0,
  }));

  const renderRow = (ranking: ScoringRankingResponse, index: number) => (
    <tr
      key={`${ranking.teamId ?? 'team'}-${ranking.seasonId ?? 'season'}-${ranking.clubId ?? 'club'}-${index}`}
    >
      <td className="px-4 py-3">
        <div className="font-medium">{ranking.teamName}</div>
      </td>
      <td className="px-4 py-3 text-gray-600">{ranking.clubName}</td>
      <td className="px-4 py-3 text-center">{ranking.matchesPlayed || 0}</td>
      <td className="px-4 py-3 text-center font-semibold text-green-600">
        {ranking.goalsFor || 0}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-red-600">
        {ranking.goalsAgainst || 0}
      </td>
      <td
        className={`px-4 py-3 text-center font-medium ${
          (ranking.goalDifference || 0) > 0
            ? 'text-green-600'
            : (ranking.goalDifference || 0) < 0
              ? 'text-red-600'
              : 'text-gray-600'
        }`}
      >
        {ranking.goalDifference || 0}
      </td>
      <td className="px-4 py-3 text-center">
        {ranking.goalsPerMatch ? ranking.goalsPerMatch.toFixed(2) : '0.00'}
      </td>
      <td className="px-4 py-3 text-center">
        {ranking.goalsAgainstPerMatch ? ranking.goalsAgainstPerMatch.toFixed(2) : '0.00'}
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Ranking de Goleadores"
        description="Estadísticas de goles a favor y en contra por equipo"
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
        <ReportFilters
          fields={filterFields}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total de Goles"
            value={totalGoals}
            subtitle="en la competencia"
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            title="Mejor Ataque"
            value={topScorer?.goalsFor || 0}
            subtitle={topScorer?.teamName || '-'}
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Mejor Defensa"
            value={bestDefense?.goalsAgainst || 0}
            subtitle={bestDefense?.teamName || '-'}
            trend="down"
            icon={<TrendingDown className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<ScoringRankingPDF data={rankings} seasonName={rankings[0]?.seasonName} />}
            fileName={`ranking-goleadores-${rankings[0]?.seasonName || 'reporte'}`}
            disabled={rankings.length === 0}
          />
        </div>

        {!isLoading && rankings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top 10 - Goles a Favor vs En Contra</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={chartData}
                xKey="name"
                bars={[
                  { key: 'gf', name: 'Goles a Favor', color: '#10b981' },
                  { key: 'gc', name: 'Goles en Contra', color: '#ef4444' },
                ]}
              />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={rankings}
            headers={tableHeaders}
            renderRow={(item, index) => renderRow(item, index)}
            loading={isLoading}
            emptyMessage="No se encontraron datos para los filtros seleccionados"
          />
        </div>
      </div>
    </div>
  );
};
