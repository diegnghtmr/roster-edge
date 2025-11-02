import { useState } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { BarChartComponent } from "@/components/reports/charts/BarChartComponent";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { StaffImpactPDF } from "@/components/reports/pdf/StaffImpactPDF";
import { useStaffImpactReport } from "@/api/services/reports/useReportsData";
import { ArrowLeft, TrendingUp, Zap, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StaffImpactResponse, TeamStaffImpactDetail } from "@/interface/IReports";

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
];

const tableHeaders: TableColumn[] = [
  { title: "Equipo", key: "teamName" },
  { title: "Ratio S/J", key: "staffToPlayerRatio", className: "w-24" },
  { title: "Edad Promedio", key: "averagePlayerAge", className: "w-28" },
  { title: "Antigüedad Staff", key: "averageStaffTenure", className: "w-32" },
  { title: "% Victorias", key: "winRate", className: "w-24" },
  { title: "Pts/PJ", key: "pointsPerMatch", className: "w-24" },
  { title: "DG", key: "goalDifference", className: "w-20" },
];

export const StaffImpactReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  const { data, isLoading } = useStaffImpactReport(appliedFilters, true);

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

  const impact = data as StaffImpactResponse;
  const teams = impact?.teamDetails || [];

  // Chart data
  const chartData = teams.slice(0, 10).map((team) => ({
    name: team.teamName || "Sin nombre",
    ratio: team.staffToPlayerRatio || 0,
    winRate: (team.winRate || 0) * 100,
  }));

  const renderRow = (team: TeamStaffImpactDetail) => (
    <tr key={team.teamId}>
      <td className="px-4 py-3 font-medium">{team.teamName}</td>
      <td className="px-4 py-3 text-center">
        {team.staffToPlayerRatio ? team.staffToPlayerRatio.toFixed(2) : "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {team.averagePlayerAge ? `${team.averagePlayerAge.toFixed(1)} años` : "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {team.averageStaffTenure ? `${team.averageStaffTenure.toFixed(1)} años` : "-"}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-green-600">
        {team.winRate ? `${(team.winRate * 100).toFixed(1)}%` : "-"}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-blue-600">
        {team.pointsPerMatch ? team.pointsPerMatch.toFixed(2) : "-"}
      </td>
      <td className={`px-4 py-3 text-center font-medium ${
        (team.goalDifference || 0) > 0 ? "text-green-600" :
        (team.goalDifference || 0) < 0 ? "text-red-600" : "text-gray-600"
      }`}>
        {team.goalDifference || 0}
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Impacto del Personal"
        description="Correlación entre personal técnico y rendimiento del equipo"
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
            title="Correlación Ratio-Victorias"
            value={impact?.ratioWinRateCorrelation ? impact.ratioWinRateCorrelation.toFixed(3) : "N/A"}
            subtitle="coeficiente de correlación"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Correlación Ratio-Puntos"
            value={impact?.ratioPointsCorrelation ? impact.ratioPointsCorrelation.toFixed(3) : "N/A"}
            subtitle="coeficiente de correlación"
            icon={<Zap className="h-5 w-5" />}
          />
          <StatCard
            title="Ratio Staff Promedio"
            value={impact?.averageStaffRatio ? impact.averageStaffRatio.toFixed(2) : "N/A"}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<StaffImpactPDF data={impact} />}
            fileName={`impacto-personal-${new Date().toISOString().split("T")[0]}`}
            disabled={teams.length === 0}
          />
        </div>

        {!isLoading && teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ratio Staff vs % Victorias (Top 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={chartData}
                xKey="name"
                bars={[
                  { key: "ratio", name: "Ratio Staff/Jugador", color: "#f97316" },
                  { key: "winRate", name: "% Victorias", color: "#10b981" },
                ]}
                yAxisLabel="Valor"
                height={400}
              />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={teams}
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
