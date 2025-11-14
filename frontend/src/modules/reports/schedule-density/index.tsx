import { useState, useMemo } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { LineChartComponent } from '@/components/reports/charts/LineChartComponent';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { ScheduleDensityPDF } from '@/components/reports/pdf/ScheduleDensityPDF';
import { useScheduleDensityReport } from '@/api/services/reports/useReportsData';
import { useSeasonsForFilter, useTeamsForFilter } from '@/api/services/filters/useFilterOptions';
import { ArrowLeft, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScheduleDensityResponse } from '@/interface/IReports';

const tableHeaders: TableColumn[] = [
  { title: 'Fecha', key: 'matchDate' },
  { title: 'Dias Descanso', key: 'restDays', className: 'w-32' },
  { title: 'Ultimos 7d', key: 'matchesLastSevenDays', className: 'w-28' },
  { title: 'Proximos 7d', key: 'matchesNextSevenDays', className: 'w-28' },
  { title: 'Duracion (min)', key: 'matchDurationMinutes', className: 'w-28' },
  { title: 'Estado', key: 'belowRestThreshold', className: 'w-24' },
];

const parseNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseBoolean = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'si'
    );
  }
  return false;
};

const normalizeDateValue = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return undefined;
};

const formatDateLabel = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const ScheduleDensityReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({});

  const { options: teamOptions, isLoading: teamsLoading } = useTeamsForFilter();
  const { options: seasonOptions, isLoading: seasonsLoading } = useSeasonsForFilter();

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'teamId',
        label: 'Equipo (Requerido)',
        type: 'select',
        options: teamOptions,
        placeholder: teamsLoading ? 'Cargando...' : 'Seleccionar equipo',
      },
      {
        key: 'seasonId',
        label: 'Temporada',
        type: 'select',
        options: seasonOptions,
        placeholder: seasonsLoading ? 'Cargando...' : 'Seleccionar temporada (opcional)',
      },
      {
        key: 'fromDate',
        label: 'Desde',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'toDate',
        label: 'Hasta',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'alertThresholdDays',
        label: 'Umbral de descanso (dias)',
        type: 'number',
        placeholder: 'Ej: 3 (opcional, default: 3)',
      },
    ],
    [teamOptions, teamsLoading, seasonOptions, seasonsLoading]
  );

  const selectedTeamId = useMemo(() => {
    if (typeof appliedFilters.teamId === 'number') {
      return appliedFilters.teamId;
    }
    if (typeof appliedFilters.teamId === 'string' && appliedFilters.teamId.trim() !== '') {
      const parsed = Number(appliedFilters.teamId);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, [appliedFilters.teamId]);

  const shouldFetch = selectedTeamId !== undefined;
  const { data, isLoading } = useScheduleDensityReport(appliedFilters, shouldFetch);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return;
      }
      if (key.endsWith('Id') && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else if (key === 'alertThresholdDays' && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const density = useMemo<ScheduleDensityResponse[]>(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    const normalized = data.map((item) => {
      const raw = item as Record<string, unknown>;
      return {
        teamId: parseNumber(raw.teamId ?? raw['team_id']),
        teamName:
          typeof (raw.teamName ?? raw['team_name']) === 'string'
            ? String(raw.teamName ?? raw['team_name'])
            : undefined,
        seasonId: parseNumber(raw.seasonId ?? raw['season_id']),
        seasonName:
          typeof (raw.seasonName ?? raw['season_name']) === 'string'
            ? String(raw.seasonName ?? raw['season_name'])
            : undefined,
        matchId: parseNumber(raw.matchId ?? raw['match_id']),
        matchDate: normalizeDateValue(raw.matchDate ?? raw['match_date']),
        restDays: parseNumber(raw.restDays ?? raw['rest_days']),
        matchesLastSevenDays: parseNumber(raw.matchesLastSevenDays ?? raw['matches_last_seven']),
        matchesNextSevenDays: parseNumber(raw.matchesNextSevenDays ?? raw['matches_next_seven']),
        matchDurationMinutes: parseNumber(
          raw.matchDurationMinutes ?? raw['match_duration_minutes'] ?? raw['duration_minutes']
        ),
        belowRestThreshold: parseBoolean(raw.belowRestThreshold ?? raw['below_rest_threshold']),
      };
    });

    const filtered = selectedTeamId
      ? normalized.filter((item) => item.teamId === selectedTeamId)
      : normalized;

    return filtered.sort((a, b) => {
      if (!a.matchDate || !b.matchDate) {
        return 0;
      }
      return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
    });
  }, [data, selectedTeamId]);

  const matchesWithLowRest = useMemo(
    () => density.filter((match) => match.belowRestThreshold).length,
    [density]
  );

  const avgRestDays = useMemo(() => {
    if (density.length === 0) {
      return '0.0';
    }
    const total = density.reduce((sum, match) => sum + (match.restDays ?? 0), 0);
    return (total / density.length).toFixed(1);
  }, [density]);

  const maxDensity = useMemo(
    () =>
      density.reduce((max, match) => {
        const current = (match.matchesLastSevenDays ?? 0) + (match.matchesNextSevenDays ?? 0);
        return Math.max(max, current);
      }, 0),
    [density]
  );

  const chartData = useMemo(
    () =>
      density.map((match, index) => ({
        name: formatDateLabel(match.matchDate) ?? `Partido ${index + 1}`,
        descanso: match.restDays ?? 0,
        ultimos7d: match.matchesLastSevenDays ?? 0,
        proximos7d: match.matchesNextSevenDays ?? 0,
      })),
    [density]
  );

  const renderRow = (match: ScheduleDensityResponse) => {
    const formattedDate = formatDateLabel(match.matchDate) ?? '-';
    const restDaysValue = match.restDays ?? 0;
    const rowKey = `${match.teamId ?? 'team'}-${match.matchId ?? match.matchDate ?? 'match'}`;

    return (
      <tr key={rowKey} className={match.belowRestThreshold ? 'bg-red-50' : ''}>
        <td className="px-4 py-3 font-medium">{formattedDate}</td>
        <td
          className={`px-4 py-3 text-center font-semibold ${
            restDaysValue < 3 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {restDaysValue}
        </td>
        <td className="px-4 py-3 text-center text-blue-600">{match.matchesLastSevenDays ?? 0}</td>
        <td className="px-4 py-3 text-center text-purple-600">{match.matchesNextSevenDays ?? 0}</td>
        <td className="px-4 py-3 text-center text-gray-700">{match.matchDurationMinutes ?? 0}</td>
        <td className="px-4 py-3 text-center">
          {match.belowRestThreshold ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              <AlertTriangle className="h-3 w-3" />
              Alerta
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Normal
            </span>
          )}
        </td>
      </tr>
    );
  };

  const teamNameForExport = density[0]?.teamName;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <InternalHeader
        title="Reporte de Densidad del Calendario"
        breadcrumbs={[
          { label: 'Reportes', href: '/reports' },
          { label: 'Densidad del Calendario' },
        ]}
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
            title="Partidos con Poco Descanso"
            value={matchesWithLowRest}
            subtitle="bajo el umbral"
            trend={matchesWithLowRest > 0 ? 'down' : 'neutral'}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatCard
            title="Descanso Promedio"
            value={`${avgRestDays} dias`}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Densidad Maxima"
            value={maxDensity}
            subtitle="partidos en 14 dias"
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<ScheduleDensityPDF data={density} teamName={teamNameForExport} />}
            fileName={`densidad-calendario-${teamNameForExport || 'reporte'}`}
            disabled={density.length === 0}
          />
        </div>

        {!isLoading && density.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evolucion del Descanso y Densidad</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={chartData}
                xKey="name"
                lines={[
                  { key: 'descanso', name: 'Dias de Descanso', color: '#10b981' },
                  { key: 'ultimos7d', name: 'Partidos Ultimos 7d', color: '#3b82f6' },
                  { key: 'proximos7d', name: 'Partidos Proximos 7d', color: '#8b5cf6' },
                ]}
                yAxisLabel="Cantidad"
                height={400}
              />
            </CardContent>
          </Card>
        )}

        {!isLoading && density.length === 0 && !selectedTeamId && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="py-6">
              <p className="text-center text-blue-800">
                Selecciona un <strong>equipo</strong> y aplica los filtros para ver el analisis de
                densidad del calendario.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && density.length === 0 && selectedTeamId && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-6">
              <p className="text-center text-yellow-800">
                No se encontraron partidos para el equipo seleccionado. Intenta con otro equipo o
                temporada.
              </p>
            </CardContent>
          </Card>
        )}

        {matchesWithLowRest > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerta de Sobrecarga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">
                Se detectaron <strong>{matchesWithLowRest}</strong> partidos con dias de descanso
                por debajo del umbral recomendado. Considera ajustar el calendario para prevenir
                lesiones y fatiga.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={density}
            headers={tableHeaders}
            renderRow={renderRow}
            loading={isLoading}
            emptyMessage="No se encontraron datos para los filtros seleccionados"
          />
        </div>
      </div>
    </div>
  );
};
