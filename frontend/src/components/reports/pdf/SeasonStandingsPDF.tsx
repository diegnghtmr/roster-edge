import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart } from './PDFDocument';
import type { SeasonStandingResponse } from '@/interface/IReports';

interface SeasonStandingsPDFProps {
  data: SeasonStandingResponse[];
  seasonName?: string;
}

export const SeasonStandingsPDF = ({ data, seasonName }: SeasonStandingsPDFProps) => {
  const tableHeaders = ['Pos', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'Pts'];

  const tableData = data.map((team) => [
    team.rankingPosition || '-',
    team.teamName || '-',
    team.played || 0,
    team.wins || 0,
    team.draws || 0,
    team.losses || 0,
    team.goalsFor || 0,
    team.goalsAgainst || 0,
    team.goalDifference || 0,
    team.points || 0,
  ]);

  // Calculate stats
  const totalTeams = data.length;
  const avgPoints =
    data.length > 0
      ? (data.reduce((sum, team) => sum + (team.points || 0), 0) / data.length).toFixed(1)
      : '0';
  const topScorer =
    data.length > 0
      ? data.reduce(
          (max, team) => ((team.goalsFor || 0) > (max.goalsFor || 0) ? team : max),
          data[0]
        )
      : null;

  const stats = [
    { label: 'Equipos en Competencia', value: totalTeams },
    { label: 'Promedio de Puntos', value: avgPoints },
    {
      label: 'Máximo Goleador',
      value: topScorer ? `${topScorer.teamName}: ${topScorer.goalsFor} goles` : '-',
    },
  ];

  // Chart data - top 10 teams
  const chartData = data.slice(0, 10).map((team) => ({
    name: (team.teamName || 'Sin nombre').substring(0, 15),
    value: team.points || 0,
  }));

  return (
    <PDFDocument
      title="Tabla de Posiciones"
      subtitle={seasonName ? `Temporada: ${seasonName}` : 'Reporte de Temporada'}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Distribución de Puntos (Top 10)">
        <PDFBarChart data={chartData} height={180} />
      </PDFSection>

      <PDFSection title="Clasificación Completa">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
