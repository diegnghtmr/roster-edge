import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFMultiBarChart, PDFPieChart } from "./PDFDocument";
import type { TeamStaffRatioResponse } from "@/interface/IReports";

interface StaffRatioPDFProps {
  data: TeamStaffRatioResponse[];
}

export const StaffRatioPDF = ({ data }: StaffRatioPDFProps) => {
  // Calculate overall stats
  const totalStaff = data.reduce((sum, team) => sum + (team.staff || 0), 0);
  const totalPlayers = data.reduce((sum, team) => sum + (team.players || 0), 0);
  const avgRatio = data.length > 0
    ? (data.reduce((sum, team) => sum + (team.staffToPlayerRatio || 0), 0) / data.length).toFixed(2)
    : "0.00";

  const stats = [
    { label: "Personal Total", value: totalStaff },
    { label: "Jugadores Total", value: totalPlayers },
    { label: "Ratio Promedio", value: avgRatio },
  ];

  // Chart data - staff vs players (top 10 teams)
  const chartData = data.slice(0, 10).map(team => ({
    name: (team.teamName || "Sin nombre").substring(0, 12),
    staff: team.staff || 0,
    jugadores: team.players || 0,
  }));

  // Aggregate roles across all teams for pie chart
  const rolesMap = new Map<string, number>();
  data.forEach((team) => {
    team.roleBreakdown?.forEach((role) => {
      const current = rolesMap.get(role.roleName || "Desconocido") || 0;
      rolesMap.set(role.roleName || "Desconocido", current + (role.staffCount || 0));
    });
  });

  const rolesData = Array.from(rolesMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // Table data
  const tableHeaders = ["Equipo", "Personal", "Jugadores", "Ratio", "Antigüedad"];
  const tableData = data.map((team) => [
    team.teamName || "-",
    team.staff || 0,
    team.players || 0,
    team.staffToPlayerRatio ? team.staffToPlayerRatio.toFixed(2) : "-",
    team.averageStaffTenure ? `${team.averageStaffTenure.toFixed(1)} años` : "-",
  ]);

  return (
    <PDFDocument
      title="Ratio Personal-Jugadores"
      subtitle="Proporción de staff técnico por jugador"
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Personal vs Jugadores (Top 10)">
        <PDFMultiBarChart
          data={chartData}
          bars={[
            { key: "staff", name: "Personal", color: "#f97316" },
            { key: "jugadores", name: "Jugadores", color: "#3b82f6" },
          ]}
          height={180}
        />
      </PDFSection>

      {rolesData.length > 0 && (
        <PDFSection title="Distribución por Rol">
          <PDFPieChart data={rolesData} height={160} />
        </PDFSection>
      )}

      <PDFSection title="Detalle Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
