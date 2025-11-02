import { useState, useMemo } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { BarChartComponent } from "@/components/reports/charts/BarChartComponent";
import { PieChartComponent } from "@/components/reports/charts/PieChartComponent";
import { StaffRatioPDF } from "@/components/reports/pdf/StaffRatioPDF";
import { useStaffRatioReport } from "@/api/services/reports/useReportsData";
import { useClubsForFilter, useTeamsForFilter } from "@/api/services/filters/useFilterOptions";
import { translateStaffRole } from "@/utils/translations";
import { ArrowLeft, Users, UserCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamStaffRatioResponse } from "@/interface/IReports";

export const StaffRatioReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({
    onlyActive: true,
  });
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({
    onlyActive: true,
  });

  // Fetch filter options
  const { options: clubOptions, isLoading: clubsLoading } = useClubsForFilter();
  const { options: teamOptions, isLoading: teamsLoading } = useTeamsForFilter(
    filters.clubId ? Number(filters.clubId) : undefined
  );

  // Dynamic filter fields with loaded options
  const filterFields: FilterField[] = useMemo(() => [
    {
      key: "clubId",
      label: "Club",
      type: "select",
      options: clubOptions,
      placeholder: clubsLoading ? "Cargando..." : "Seleccionar club (opcional)",
    },
    {
      key: "teamId",
      label: "Equipo",
      type: "select",
      options: teamOptions,
      placeholder: teamsLoading ? "Cargando..." : "Seleccionar equipo (opcional)",
    },
    {
      key: "onlyActive",
      label: "Solo activos",
      type: "checkbox",
      placeholder: "Mostrar solo personal y jugadores activos",
    },
  ], [clubOptions, clubsLoading, teamOptions, teamsLoading]);

  const { data, isLoading } = useStaffRatioReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    if (key === "clubId") {
      setFilters({ ...filters, clubId: value, teamId: undefined });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({ onlyActive: true });
    setAppliedFilters({ onlyActive: true });
  };

  const handleApplyFilters = () => {
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) return;
      if (key.endsWith("Id") && typeof value === "string") {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const ratios = (data || []) as TeamStaffRatioResponse[];

  // Calculate stats
  const totalStaff = ratios.reduce((sum, team) => sum + (team.staff || 0), 0);
  const totalPlayers = ratios.reduce((sum, team) => sum + (team.players || 0), 0);
  const avgRatio = ratios.length > 0
    ? (ratios.reduce((sum, team) => sum + (team.staffToPlayerRatio || 0), 0) / ratios.length).toFixed(2)
    : "0.00";

  // Chart data
  const ratioChartData = ratios.map((team) => ({
    name: team.teamName || "Sin nombre",
    staff: team.staff || 0,
    jugadores: team.players || 0,
  }));

  // Aggregate roles across all teams
  const rolesMap = new Map<string, number>();
  ratios.forEach((team) => {
    team.roleBreakdown?.forEach((role) => {
      const translatedRole = translateStaffRole(role.roleName);
      const current = rolesMap.get(translatedRole) || 0;
      rolesMap.set(translatedRole, current + (role.staffCount || 0));
    });
  });

  const rolesData = Array.from(rolesMap.entries()).map(([name, count]) => ({
    name,
    value: count,
  }));

  return (
    <div className="w-full">
      <InternalHeader
        title="Ratio Personal-Jugadores"
        description="Proporción de staff técnico por jugador en cada equipo"
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
            title="Personal Total"
            value={totalStaff}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Jugadores Total"
            value={totalPlayers}
            icon={<UserCheck className="h-5 w-5" />}
          />
          <StatCard
            title="Ratio Promedio"
            value={avgRatio}
            subtitle="staff por jugador"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<StaffRatioPDF data={ratios} />}
            fileName={`ratio-personal-${new Date().toISOString().split("T")[0]}`}
            disabled={ratios.length === 0}
          />
        </div>

        {!isLoading && ratios.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal vs Jugadores por Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={ratioChartData}
                  xKey="name"
                  bars={[
                    { key: "staff", name: "Personal", color: "#f97316" },
                    { key: "jugadores", name: "Jugadores", color: "#3b82f6" },
                  ]}
                  yAxisLabel="Cantidad"
                  height={400}
                />
              </CardContent>
            </Card>

            {rolesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Rol</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartComponent
                    data={rolesData}
                    nameKey="name"
                    valueKey="value"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!isLoading && ratios.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalles por Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ratios.map((team) => (
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
                      <span className="text-gray-600">Personal:</span>
                      <span className="font-medium">{team.staff || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jugadores:</span>
                      <span className="font-medium">{team.players || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ratio:</span>
                      <span className="font-medium text-blue-600">
                        {team.staffToPlayerRatio ? team.staffToPlayerRatio.toFixed(2) : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Antigüedad promedio:</span>
                      <span className="font-medium">
                        {team.averageStaffTenure ? `${team.averageStaffTenure.toFixed(1)} años` : "-"}
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

        {!isLoading && ratios.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">No se encontraron datos con los filtros aplicados</div>
          </div>
        )}
      </div>
    </div>
  );
};
