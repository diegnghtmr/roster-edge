import { PDFDocument, PDFTable, PDFSection, PDFStatCards } from "./PDFDocument";
import { Text, Canvas, StyleSheet } from "@react-pdf/renderer";
import type { TeamPointsProgressResponse } from "@/interface/IReports";

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  chartDescription: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 10,
  },
});

interface PointsProgressPDFProps {
  data: TeamPointsProgressResponse[];
  teamName?: string;
}

export const PointsProgressPDF = ({ data, teamName }: PointsProgressPDFProps) => {
  const tableHeaders = [
    "Jornada",
    "Fecha",
    "GF",
    "GC",
    "DG",
    "Pts Ganados",
    "Pts Acumulados",
  ];

  const tableData = data.map((match) => [
    match.matchdayName || match.matchNumber || "-",
    match.matchDate || "-",
    match.goalsFor || 0,
    match.goalsAgainst || 0,
    match.goalDifference || 0,
    match.pointsEarned || 0,
    match.cumulativePoints || 0,
  ]);

  // Calculate stats
  const totalPoints = data.length > 0 ? data[data.length - 1]?.cumulativePoints || 0 : 0;
  const totalMatches = data.length;
  const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(2) : "0.00";

  const stats = [
    { label: "Puntos Totales", value: totalPoints },
    { label: "Partidos Jugados", value: totalMatches },
    { label: "Promedio por Partido", value: avgPointsPerMatch },
  ];

  // Line chart data
  const maxPoints = Math.max(...data.map(m => m.cumulativePoints || 0));

  return (
    <PDFDocument
      title="Progreso de Puntos"
      subtitle={teamName ? `Equipo: ${teamName}` : "Evolución de Puntos por Jornada"}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Evolución de Puntos Acumulados">
        <Text style={styles.chartDescription}>
          Este gráfico muestra cómo se acumulan los puntos del equipo jornada tras jornada.
        </Text>
        <Canvas
          style={{ width: '100%', height: 180 }}
          paint={(painter, availableWidth, availableHeight) => {
            const padding = { left: 40, right: 20, top: 20, bottom: 30 };
            const chartWidth = availableWidth - padding.left - padding.right;
            const chartHeight = availableHeight - padding.top - padding.bottom;
            const pointSpacing = chartWidth / Math.max(data.length - 1, 1);

            // Draw grid lines
            for (let i = 0; i <= 5; i++) {
              const y = padding.top + (chartHeight * i) / 5;
              painter
                .strokeColor('#e5e7eb')
                .moveTo(padding.left, y)
                .lineTo(availableWidth - padding.right, y)
                .stroke();
            }

            // Draw axes
            painter
                .strokeColor('#374151')
              .moveTo(padding.left, padding.top)
              .lineTo(padding.left, availableHeight - padding.bottom)
              .lineTo(availableWidth - padding.right, availableHeight - padding.bottom)
              .stroke();

            // Draw line
            painter.strokeColor('#8b5cf6').lineWidth(2);
            data.forEach((match, index) => {
              const x = padding.left + index * pointSpacing;
              const points = match.cumulativePoints || 0;
              const y = availableHeight - padding.bottom - (points / maxPoints) * chartHeight;

              if (index === 0) {
                painter.moveTo(x, y);
              } else {
                painter.lineTo(x, y);
              }

              // Draw point
              painter.circle(x, y, 2).fill();
            });
            painter.stroke();

            // Draw Y-axis labels
            for (let i = 0; i <= 5; i++) {
              const value = Math.round((maxPoints * i) / 5);
              const y = availableHeight - padding.bottom - (chartHeight * i) / 5;
              painter
                .fillColor('#6b7280')
                .fontSize(8)
                .text(String(value), 5, y - 4, { width: 30, align: 'right' });
            }

            // X-axis label
            painter
              .fillColor('#6b7280')
              .fontSize(10)
              .text('Jornadas', availableWidth / 2 - 20, availableHeight - 15);

            return null;
          }}
        />
      </PDFSection>

      <PDFSection title="Detalle por Jornada">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
