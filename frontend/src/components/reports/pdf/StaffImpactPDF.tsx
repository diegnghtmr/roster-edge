import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFMultiBarChart } from "./PDFDocument";
import type { StaffImpactResponse } from "@/interface/IReports";

interface StaffImpactPDFProps {
  data: StaffImpactResponse;
}

export const StaffImpactPDF = ({ data }: StaffImpactPDFProps) => {
  const teams = data.teamDetails || [];

  const stats = [
    { label: "Correlación Ratio-Victorias", value: data.ratioWinRateCorrelation ? data.ratioWinRateCorrelation.toFixed(3) : "N/A" },
    { label: "Correlación Ratio-Puntos", value: data.ratioPointsCorrelation ? data.ratioPointsCorrelation.toFixed(3) : "N/A" },
    { label: "Ratio Staff Promedio", value: data.averageStaffRatio ? data.averageStaffRatio.toFixed(2) : "N/A" },
  ];

  // Chart data - ratio vs win rate (top 10 teams)
  const chartData = teams.slice(0, 10).map(team => ({
    name: (team.teamName || "Sin nombre").substring(0, 10),
    ratio: team.staffToPlayerRatio || 0,
    winRate: (team.winRate || 0) * 100, // Convert to percentage
  }));

  const tableHeaders = [
    "Equipo",
    "Ratio S/J",
    "% Victorias",
    "Pts/PJ",
    "DG",
    "PJ",
  ];

  const tableData = teams.map((team) => [
    team.teamName || "-",
    team.staffToPlayerRatio ? team.staffToPlayerRatio.toFixed(2) : "-",
    team.winRate ? `${(team.winRate * 100).toFixed(1)}%` : "-",
    team.pointsPerMatch ? team.pointsPerMatch.toFixed(2) : "-",
    team.goalDifference || 0,
    team.matchesPlayed || 0,
  ]);

  return (
    <PDFDocument
      title="Impacto del Personal"
      subtitle="Correlación entre personal técnico y rendimiento del equipo"
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Ratio Staff vs % Victorias (Top 10)">
        <PDFMultiBarChart
          data={chartData}
          bars={[
            { key: "ratio", name: "Ratio Staff/Jugador", color: "#f97316" },
            { key: "winRate", name: "% Victorias", color: "#10b981" },
          ]}
          height={180}
        />
      </PDFSection>

      <PDFSection title="Detalle Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
