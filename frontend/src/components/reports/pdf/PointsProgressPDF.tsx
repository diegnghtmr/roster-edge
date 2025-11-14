import { PDFDocument, PDFTable, PDFSection, PDFStatCards } from './PDFDocument';
import { Text, Canvas, StyleSheet, View } from '@react-pdf/renderer';
import { REPORT_COLORS, PDF_TYPOGRAPHY, PDF_SPACING } from '@/constants/reportColors';
import type { TeamPointsProgressResponse } from '@/interface/IReports';

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: PDF_TYPOGRAPHY.fontSize.h4,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    color: REPORT_COLORS.neutral.gray800,
    marginBottom: PDF_SPACING.sm,
  },
  chartDescription: {
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.neutral.gray600,
    marginBottom: PDF_SPACING.md,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.oblique,
  },
  chartContainer: {
    marginTop: PDF_SPACING.sm,
    marginBottom: PDF_SPACING.md,
  },
});

interface PointsProgressPDFProps {
  data: TeamPointsProgressResponse[];
  teamName?: string;
}

export const PointsProgressPDF = ({ data, teamName }: PointsProgressPDFProps) => {
  const tableHeaders = ['Jornada', 'Fecha', 'GF', 'GC', 'DG', 'Pts Ganados', 'Pts Acumulados'];

  const tableData = data.map((match) => [
    match.matchdayName || match.matchNumber || '-',
    match.matchDate || '-',
    match.goalsFor || 0,
    match.goalsAgainst || 0,
    match.goalDifference || 0,
    match.pointsEarned || 0,
    match.cumulativePoints || 0,
  ]);

  // Calculate stats
  const totalPoints = data.length > 0 ? data[data.length - 1]?.cumulativePoints || 0 : 0;
  const totalMatches = data.length;
  const avgPointsPerMatch = totalMatches > 0 ? (totalPoints / totalMatches).toFixed(2) : '0.00';

  const stats = [
    { label: 'Puntos Totales', value: totalPoints },
    { label: 'Partidos Jugados', value: totalMatches },
    { label: 'Promedio por Partido', value: avgPointsPerMatch },
  ];

  // Line chart data
  const maxPoints = Math.max(...data.map((m) => m.cumulativePoints || 0));

  return (
    <PDFDocument
      title="Progreso de Puntos"
      subtitle={teamName ? `Equipo: ${teamName}` : 'Evolución de Puntos por Jornada'}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Evolución de Puntos Acumulados">
        <Text style={styles.chartDescription}>
          Este gráfico muestra cómo se acumulan los puntos del equipo jornada tras jornada.
        </Text>
        <View style={styles.chartContainer}>
          <Canvas
            style={{ width: '100%', height: 180 }}
            paint={(painter, availableWidth, availableHeight) => {
              const padding = { left: 45, right: 20, top: 25, bottom: 35 };
              const chartWidth = availableWidth - padding.left - padding.right;
              const chartHeight = availableHeight - padding.top - padding.bottom;
              const pointSpacing = chartWidth / Math.max(data.length - 1, 1);

              // Draw grid lines with improved styling
              for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartHeight * i) / 5;
                painter
                  .strokeColor(REPORT_COLORS.neutral.gray200)
                  .lineWidth(0.5)
                  .moveTo(padding.left, y)
                  .lineTo(availableWidth - padding.right, y)
                  .stroke();
              }

              // Draw axes with better styling
              painter
                .strokeColor(REPORT_COLORS.neutral.gray400)
                .lineWidth(1.5)
                .moveTo(padding.left, padding.top)
                .lineTo(padding.left, availableHeight - padding.bottom)
                .lineTo(availableWidth - padding.right, availableHeight - padding.bottom)
                .stroke();

              // Draw line with brand red color
              painter.strokeColor(REPORT_COLORS.primary.main).lineWidth(2.5);
              data.forEach((match, index) => {
                const x = padding.left + index * pointSpacing;
                const points = match.cumulativePoints || 0;
                const y = availableHeight - padding.bottom - (points / maxPoints) * chartHeight;

                if (index === 0) {
                  painter.moveTo(x, y);
                } else {
                  painter.lineTo(x, y);
                }

                // Draw point with border (red theme)
                painter.circle(x, y, 4).fillColor(REPORT_COLORS.primary.main).fill();
                painter
                  .circle(x, y, 4)
                  .strokeColor(REPORT_COLORS.neutral.white)
                  .lineWidth(1.5)
                  .stroke();
              });
              painter.stroke();

              // Draw Y-axis labels
              for (let i = 0; i <= 5; i++) {
                const value = Math.round((maxPoints * i) / 5);
                const y = availableHeight - padding.bottom - (chartHeight * i) / 5;
                painter
                  .fillColor(REPORT_COLORS.neutral.gray600)
                  .fontSize(9)
                  .text(String(value), 5, y - 4, { width: 35, align: 'right' });
              }

              // X-axis label
              painter
                .fillColor(REPORT_COLORS.neutral.gray700)
                .fontSize(10)
                .text('Jornadas', availableWidth / 2 - 20, availableHeight - 18);

              return null;
            }}
          />
        </View>
      </PDFSection>

      <PDFSection title="Detalle por Jornada">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
