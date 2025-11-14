import { useState, useMemo } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { PieChartComponent } from '@/components/reports/charts/PieChartComponent';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { RosterProfilePDF } from '@/components/reports/pdf/RosterProfilePDF';
import { useRosterProfileReport } from '@/api/services/reports/useReportsData';
import { useClubsForFilter, useTeamsForFilter } from '@/api/services/filters/useFilterOptions';
import { translatePhysicalState } from '@/utils/translations';
import { ArrowLeft, Users, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TeamRosterProfileResponse } from '@/interface/IReports';

export const RosterProfileReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({
    onlyActiveTeams: true,
    onlyActivePlayers: true,
  });
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({
    onlyActiveTeams: true,
    onlyActivePlayers: true,
  });

  // Fetch filter options
  const { options: clubOptions, isLoading: clubsLoading } = useClubsForFilter();
  const { options: teamOptions, isLoading: teamsLoading } = useTeamsForFilter(
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
        key: 'teamId',
        label: 'Equipo',
        type: 'select',
        options: teamOptions,
        placeholder: teamsLoading ? 'Cargando...' : 'Seleccionar equipo (opcional)',
      },
      {
        key: 'onlyActiveTeams',
        label: 'Solo equipos activos',
        type: 'checkbox',
        placeholder: 'Mostrar solo equipos activos',
      },
      {
        key: 'onlyActivePlayers',
        label: 'Solo jugadores activos',
        type: 'checkbox',
        placeholder: 'Contar solo jugadores activos',
      },
    ],
    [clubOptions, clubsLoading, teamOptions, teamsLoading]
  );

  const { data, isLoading } = useRosterProfileReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    if (key === 'clubId') {
      setFilters({ ...filters, clubId: value, teamId: undefined });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({ onlyActiveTeams: true, onlyActivePlayers: true });
    setAppliedFilters({ onlyActiveTeams: true, onlyActivePlayers: true });
  };

  const handleApplyFilters = () => {
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

  const profiles = (data || []) as TeamRosterProfileResponse[];

  // Calculate stats
  const totalPlayers = profiles.reduce((sum, team) => sum + (team.totalPlayers || 0), 0);
  const totalActive = profiles.reduce((sum, team) => sum + (team.activePlayers || 0), 0);
  const avgAge =
    profiles.length > 0
      ? (profiles.reduce((sum, team) => sum + (team.averageAge || 0), 0) / profiles.length).toFixed(
          1
        )
      : '0';

  // Prepare chart data
  const playersData = profiles.map((team) => ({
    name: team.teamName || 'Sin nombre',
    total: team.totalPlayers || 0,
    activos: team.activePlayers || 0,
  }));

  // Aggregate physical states across all teams
  const physicalStatesMap = new Map<string, number>();
  profiles.forEach((team) => {
    team.physicalStates?.forEach((state) => {
      const translatedName = translatePhysicalState(state.physicalStateName);
      const current = physicalStatesMap.get(translatedName) || 0;
      physicalStatesMap.set(translatedName, current + (state.players || 0));
    });
  });

  const physicalStatesData = Array.from(physicalStatesMap.entries()).map(([name, count]) => ({
    name,
    value: count,
  }));

  return (
    <div className="w-full">
      <InternalHeader
        title="Perfil de Plantilla"
        description="Análisis demográfico y físico de jugadores"
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
            title="Total de Jugadores"
            value={totalPlayers}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Jugadores Activos"
            value={totalActive}
            subtitle={`${totalPlayers > 0 ? ((totalActive / totalPlayers) * 100).toFixed(1) : 0}% del total`}
            icon={<Activity className="h-5 w-5" />}
          />
          <StatCard
            title="Edad Promedio"
            value={`${avgAge} años`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <ExportButton
            document={<RosterProfilePDF data={profiles} />}
            fileName={`perfil-plantilla-${new Date().toISOString().split('T')[0]}`}
            disabled={profiles.length === 0}
          />
        </div>

        {/* Charts */}
        {!isLoading && profiles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Jugadores por Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={playersData}
                  xKey="name"
                  bars={[
                    { key: 'total', name: 'Total', color: '#3b82f6' },
                    { key: 'activos', name: 'Activos', color: '#10b981' },
                  ]}
                />
              </CardContent>
            </Card>

            {physicalStatesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Estado Físico</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartComponent data={physicalStatesData} nameKey="name" valueKey="value" />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Team Details */}
        {!isLoading && profiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalles por Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((team) => (
                <Card key={team.teamId}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {team.teamName}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({team.clubName})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total de jugadores:</span>
                      <span className="font-medium">{team.totalPlayers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jugadores activos:</span>
                      <span className="font-medium text-green-600">{team.activePlayers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Edad promedio:</span>
                      <span className="font-medium">
                        {team.averageAge ? `${team.averageAge.toFixed(1)} años` : '-'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        )}

        {!isLoading && profiles.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">No se encontraron datos con los filtros aplicados</div>
          </div>
        )}
      </div>
    </div>
  );
};
