import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart } from './PDFDocument';
import type { ScoringRankingResponse } from '@/interface/IReports';

interface ScoringRankingPDFProps {
  data: ScoringRankingResponse[];
  seasonName?: string;
}

export const ScoringRankingPDF = ({ data, seasonName }: ScoringRankingPDFProps) => {
  const tableHeaders = ['Equipo', 'PJ', 'GF', 'GC', 'DG', 'GF/PJ', 'GC/PJ'];

  const tableData = data.map((team) => [
    team.teamName || '-',
    team.matchesPlayed || 0,
    team.goalsFor || 0,
    team.goalsAgainst || 0,
    team.goalDifference || 0,
    team.goalsPerMatch ? team.goalsPerMatch.toFixed(2) : '0.00',
    team.goalsAgainstPerMatch ? team.goalsAgainstPerMatch.toFixed(2) : '0.00',
  ]);

  // Calculate stats
  const totalGoals = data.reduce((sum, team) => sum + (team.goalsFor || 0), 0);
  const avgGoalsPerMatch =
    data.length > 0
      ? (data.reduce((sum, team) => sum + (team.goalsPerMatch || 0), 0) / data.length).toFixed(2)
      : '0.00';
  const topScorer = data.length > 0 ? data[0] : null;

  const stats = [
    { label: 'Total de Goles', value: totalGoals },
    { label: 'Promedio Goles/Partido', value: avgGoalsPerMatch },
    {
      label: 'Equipo Más Goleador',
      value: topScorer ? `${topScorer.teamName}: ${topScorer.goalsFor}` : '-',
    },
  ];

  // Chart data - top 10 goal scorers
  const chartData = data.slice(0, 10).map((team) => ({
    name: (team.teamName || 'Sin nombre').substring(0, 12),
    value: team.goalsFor || 0,
  }));

  return (
    <PDFDocument
      title="Ranking de Goleadores"
      subtitle={seasonName ? `Temporada: ${seasonName}` : 'Estadísticas de Goles'}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Top 10 Equipos Goleadores">
        <PDFBarChart data={chartData} height={180} />
      </PDFSection>

      <PDFSection title="Estadísticas Completas">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
