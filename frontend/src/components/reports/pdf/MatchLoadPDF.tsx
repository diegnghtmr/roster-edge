import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart } from "./PDFDocument";
import type { TeamMatchLoadResponse } from "@/interface/IReports";

interface MatchLoadPDFProps {
  data: TeamMatchLoadResponse[];
  seasonName?: string;
}

export const MatchLoadPDF = ({ data, seasonName }: MatchLoadPDFProps) => {
  const tableHeaders = [
    "Equipo",
    "Club",
    "Local",
    "Visitante",
    "Total",
    "% Local",
  ];

  const tableData = data.map((team) => {
    const total = team.totalMatches || 0;
    const homePercentage = total > 0 ? ((team.homeMatches || 0) / total * 100).toFixed(1) : "0.0";
    return [
      team.teamName || "-",
      team.clubName || "-",
      team.homeMatches || 0,
      team.awayMatches || 0,
      total,
      `${homePercentage}%`,
    ];
  });

  // Calculate stats
  const totalHomeMatches = data.reduce((sum, team) => sum + (team.homeMatches || 0), 0);
  const totalAwayMatches = data.reduce((sum, team) => sum + (team.awayMatches || 0), 0);
  const totalMatches = totalHomeMatches + totalAwayMatches;

  const stats = [
    { label: "Partidos de Local", value: totalHomeMatches },
    { label: "Partidos de Visitante", value: totalAwayMatches },
    { label: "Total de Partidos", value: totalMatches },
  ];

  // Chart data - all teams
  const chartData = data.slice(0, 10).map(team => ({
    name: (team.teamName || "Sin nombre").substring(0, 12),
    value: team.totalMatches || 0,
  }));

  return (
    <PDFDocument
      title="Carga de Partidos"
      subtitle={seasonName ? `Temporada: ${seasonName}` : "Distribución Local vs Visitante"}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Carga de Partidos por Equipo (Top 10)">
        <PDFBarChart data={chartData} height={180} />
      </PDFSection>

      <PDFSection title="Detalle Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
