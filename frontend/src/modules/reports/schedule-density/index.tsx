import { useState } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { LineChartComponent } from "@/components/reports/charts/LineChartComponent";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { ScheduleDensityPDF } from "@/components/reports/pdf/ScheduleDensityPDF";
import { useScheduleDensityReport } from "@/api/services/reports/useReportsData";
import { ArrowLeft, Calendar, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScheduleDensityResponse } from "@/interface/IReports";

const filterFields: FilterField[] = [
  {
    key: "seasonId",
    label: "Temporada",
    type: "number",
    placeholder: "ID de temporada",
  },
  {
    key: "teamId",
    label: "Equipo",
    type: "number",
    placeholder: "ID de equipo",
  },
  {
    key: "restThreshold",
    label: "Umbral de descanso (días)",
    type: "number",
    placeholder: "Ej: 3",
  },
];

const tableHeaders: TableColumn[] = [
  { title: "Fecha", key: "matchDate" },
  { title: "Días Descanso", key: "restDays", className: "w-32" },
  { title: "Últimos 7d", key: "matchesLastSevenDays", className: "w-28" },
  { title: "Próximos 7d", key: "matchesNextSevenDays", className: "w-28" },
  { title: "Duración (min)", key: "matchDurationMinutes", className: "w-28" },
  { title: "Estado", key: "belowRestThreshold", className: "w-24" },
];

export const ScheduleDensityReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  const { data, isLoading } = useScheduleDensityReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const density = (data || []) as ScheduleDensityResponse[];

  // Calculate stats
  const matchesWithLowRest = density.filter(m => m.belowRestThreshold).length;
  const avgRestDays = density.length > 0
    ? (density.reduce((sum, m) => sum + (m.restDays || 0), 0) / density.length).toFixed(1)
    : "0.0";
  const maxDensity = Math.max(...density.map(m => (m.matchesLastSevenDays || 0) + (m.matchesNextSevenDays || 0)), 0);

  // Chart data
  const chartData = density.map((match, index) => ({
    name: match.matchDate || `Partido ${index + 1}`,
    descanso: match.restDays || 0,
    ultimos7d: match.matchesLastSevenDays || 0,
    proximos7d: match.matchesNextSevenDays || 0,
  }));

  const renderRow = (match: ScheduleDensityResponse) => (
    <tr key={match.matchId} className={match.belowRestThreshold ? "bg-red-50" : ""}>
      <td className="px-4 py-3 font-medium">{match.matchDate}</td>
      <td className={`px-4 py-3 text-center font-semibold ${
        (match.restDays || 0) < 3 ? "text-red-600" : "text-green-600"
      }`}>
        {match.restDays || 0}
      </td>
      <td className="px-4 py-3 text-center text-blue-600">
        {match.matchesLastSevenDays || 0}
      </td>
      <td className="px-4 py-3 text-center text-purple-600">
        {match.matchesNextSevenDays || 0}
      </td>
      <td className="px-4 py-3 text-center text-gray-700">
        {match.matchDurationMinutes || 0}
      </td>
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

  return (
    <div className="w-full">
      <InternalHeader
        title="Densidad del Calendario"
        description="Análisis de congestion de partidos y días de descanso"
        buttons={[
          {
            text: "Volver",
            icon: <ArrowLeft className="h-4 w-4" />,
            link: "/reports",
            variant: "outline",
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
            trend={matchesWithLowRest > 0 ? "down" : "neutral"}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatCard
            title="Descanso Promedio"
            value={`${avgRestDays} días`}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Densidad Máxima"
            value={maxDensity}
            subtitle="partidos en 14 días"
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={
              <ScheduleDensityPDF
                data={density}
                teamName={density[0]?.teamName}
              />
            }
            fileName={`densidad-calendario-${density[0]?.teamName || "reporte"}`}
            disabled={density.length === 0}
          />
        </div>

        {!isLoading && density.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evolución del Descanso y Densidad</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={chartData}
                xKey="name"
                lines={[
                  { key: "descanso", name: "Días de Descanso", color: "#10b981" },
                  { key: "ultimos7d", name: "Partidos Últimos 7d", color: "#3b82f6" },
                  { key: "proximos7d", name: "Partidos Próximos 7d", color: "#8b5cf6" },
                ]}
                yAxisLabel="Cantidad"
                height={400}
              />
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
                Se detectaron <strong>{matchesWithLowRest}</strong> partidos con días de descanso
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
