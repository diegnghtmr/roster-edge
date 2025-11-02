import { useState } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { BarChartComponent } from "@/components/reports/charts/BarChartComponent";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { MatchLoadPDF } from "@/components/reports/pdf/MatchLoadPDF";
import { useMatchLoadReport } from "@/api/services/reports/useReportsData";
import { ArrowLeft, Home, Plane, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamMatchLoadResponse } from "@/interface/IReports";

const filterFields: FilterField[] = [
  {
    key: "seasonId",
    label: "Temporada",
    type: "number",
    placeholder: "ID de temporada",
  },
  {
    key: "clubId",
    label: "Club",
    type: "number",
    placeholder: "ID de club",
  },
  {
    key: "teamId",
    label: "Equipo",
    type: "number",
    placeholder: "ID de equipo",
  },
];

const tableHeaders: TableColumn[] = [
  { title: "Equipo", key: "teamName" },
  { title: "Club", key: "clubName" },
  { title: "Local", key: "homeMatches", className: "w-24" },
  { title: "Visitante", key: "awayMatches", className: "w-24" },
  { title: "Total", key: "totalMatches", className: "w-24" },
  { title: "% Local", key: "homePercentage", className: "w-24" },
];

export const MatchLoadReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  const { data, isLoading } = useMatchLoadReport(appliedFilters, true);

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

  const matchLoad = (data || []) as TeamMatchLoadResponse[];

  // Calculate stats
  const totalHomeMatches = matchLoad.reduce((sum, team) => sum + (team.homeMatches || 0), 0);
  const totalAwayMatches = matchLoad.reduce((sum, team) => sum + (team.awayMatches || 0), 0);
  const totalMatches = totalHomeMatches + totalAwayMatches;
  const homePercentage = totalMatches > 0 ? ((totalHomeMatches / totalMatches) * 100).toFixed(1) : "0.0";

  // Chart data
  const barChartData = matchLoad.map((team) => ({
    name: team.teamName || "Sin nombre",
    local: team.homeMatches || 0,
    visitante: team.awayMatches || 0,
  }));

  const renderRow = (team: TeamMatchLoadResponse) => {
    const homePerc = team.totalMatches ? ((team.homeMatches || 0) / team.totalMatches * 100).toFixed(1) : "0.0";
    return (
      <tr key={team.teamId}>
        <td className="px-4 py-3 font-medium">{team.teamName}</td>
        <td className="px-4 py-3 text-gray-600">{team.clubName}</td>
        <td className="px-4 py-3 text-center font-semibold text-blue-600">
          {team.homeMatches || 0}
        </td>
        <td className="px-4 py-3 text-center font-semibold text-purple-600">
          {team.awayMatches || 0}
        </td>
        <td className="px-4 py-3 text-center font-bold">
          {team.totalMatches || 0}
        </td>
        <td className="px-4 py-3 text-center text-gray-700">
          {homePerc}%
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Carga de Partidos"
        description="Distribución de partidos de local y visitante por equipo"
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
            title="Partidos de Local"
            value={totalHomeMatches}
            subtitle={`${homePercentage}% del total`}
            icon={<Home className="h-5 w-5" />}
          />
          <StatCard
            title="Partidos de Visitante"
            value={totalAwayMatches}
            subtitle={`${(100 - parseFloat(homePercentage)).toFixed(1)}% del total`}
            icon={<Plane className="h-5 w-5" />}
          />
          <StatCard
            title="Total de Partidos"
            value={totalMatches}
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={
              <MatchLoadPDF
                data={matchLoad}
                seasonName={matchLoad[0]?.seasonName}
              />
            }
            fileName={`carga-partidos-${matchLoad[0]?.seasonName || "reporte"}`}
            disabled={matchLoad.length === 0}
          />
        </div>

        {!isLoading && matchLoad.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Partidos por Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={barChartData}
                xKey="name"
                bars={[
                  { key: "local", name: "Local", color: "#3b82f6" },
                  { key: "visitante", name: "Visitante", color: "#8b5cf6" },
                ]}
                yAxisLabel="Número de Partidos"
                height={400}
              />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={matchLoad}
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
