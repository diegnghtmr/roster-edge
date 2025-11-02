import { useState } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { LineChartComponent } from "@/components/reports/charts/LineChartComponent";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { PointsProgressPDF } from "@/components/reports/pdf/PointsProgressPDF";
import { usePointsProgressReport } from "@/api/services/reports/useReportsData";
import { ArrowLeft, TrendingUp, Trophy, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamPointsProgressResponse } from "@/interface/IReports";

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
];

const tableHeaders: TableColumn[] = [
  { title: "Jornada", key: "matchdayName" },
  { title: "Fecha", key: "matchDate", className: "w-32" },
  { title: "GF", key: "goalsFor", className: "w-16" },
  { title: "GC", key: "goalsAgainst", className: "w-16" },
  { title: "DG", key: "goalDifference", className: "w-16" },
  { title: "Pts Ganados", key: "pointsEarned", className: "w-24" },
  { title: "Pts Acumulados", key: "cumulativePoints", className: "w-28" },
];

export const PointsProgressReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  const { data, isLoading } = usePointsProgressReport(appliedFilters, true);

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

  const progress = (data || []) as TeamPointsProgressResponse[];

  // Calculate stats
  const totalPoints = progress.length > 0 ? progress[progress.length - 1]?.cumulativePoints || 0 : 0;
  const totalMatches = progress.length;
  const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(2) : "0.00";

  // Chart data
  const chartData = progress.map((match, index) => ({
    name: match.matchdayName || `J${match.matchNumber || index + 1}`,
    puntos: match.cumulativePoints || 0,
    fecha: match.matchDate || "",
  }));

  const renderRow = (match: TeamPointsProgressResponse) => (
    <tr key={match.matchId}>
      <td className="px-4 py-3">{match.matchdayName || `Jornada ${match.matchNumber}`}</td>
      <td className="px-4 py-3 text-gray-600">{match.matchDate}</td>
      <td className="px-4 py-3 text-center text-green-600 font-medium">
        {match.goalsFor || 0}
      </td>
      <td className="px-4 py-3 text-center text-red-600 font-medium">
        {match.goalsAgainst || 0}
      </td>
      <td
        className={`px-4 py-3 text-center font-medium ${
          (match.goalDifference || 0) > 0
            ? "text-green-600"
            : (match.goalDifference || 0) < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {match.goalDifference || 0}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-blue-600">
        {match.pointsEarned || 0}
      </td>
      <td className="px-4 py-3 text-center font-bold text-purple-600">
        {match.cumulativePoints || 0}
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Progreso de Puntos"
        description="Evolución de puntos acumulados a lo largo de la temporada"
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
            title="Puntos Totales"
            value={totalPoints}
            icon={<Trophy className="h-5 w-5" />}
          />
          <StatCard
            title="Partidos Jugados"
            value={totalMatches}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            title="Promedio por Partido"
            value={avgPointsPerMatch}
            subtitle="puntos/partido"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={
              <PointsProgressPDF
                data={progress}
                teamName={progress[0]?.teamName}
              />
            }
            fileName={`progreso-puntos-${progress[0]?.teamName || "reporte"}`}
            disabled={progress.length === 0}
          />
        </div>

        {!isLoading && progress.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Puntos Acumulados</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Este gráfico muestra cómo se acumulan los puntos del equipo jornada tras jornada.
                La línea ascendente indica el total de puntos acumulados a lo largo de la temporada.
              </p>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={chartData}
                xKey="name"
                lines={[
                  { key: "puntos", name: "Puntos Acumulados", color: "#8b5cf6" },
                ]}
                yAxisLabel="Puntos Totales"
                xAxisLabel="Jornadas"
              />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={progress}
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
