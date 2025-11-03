import { Document, Page, Text, View, StyleSheet, Canvas } from "@react-pdf/renderer";
import { REPORT_COLORS, PDF_TYPOGRAPHY, PDF_SPACING, PDF_RADIUS } from "@/constants/reportColors";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: REPORT_COLORS.pdf.background,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.primary,
  },
  header: {
    marginBottom: PDF_SPACING.xl,
    paddingBottom: PDF_SPACING.md,
    borderBottom: `3 solid ${REPORT_COLORS.primary.main}`,
    backgroundColor: REPORT_COLORS.pdf.sectionBg,
    padding: PDF_SPACING.lg,
    borderRadius: PDF_RADIUS.md,
  },
  title: {
    fontSize: PDF_TYPOGRAPHY.fontSize.h1,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    color: REPORT_COLORS.primary.main,
    marginBottom: PDF_SPACING.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: PDF_TYPOGRAPHY.fontSize.body,
    color: REPORT_COLORS.neutral.gray600,
    marginTop: PDF_SPACING.xs,
  },
  metaInfo: {
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.neutral.gray500,
    marginTop: PDF_SPACING.xs,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.oblique,
  },
  section: {
    marginTop: PDF_SPACING.lg,
    marginBottom: PDF_SPACING.lg,
    padding: PDF_SPACING.md,
    backgroundColor: REPORT_COLORS.neutral.white,
    borderRadius: PDF_RADIUS.md,
    borderLeft: `4 solid ${REPORT_COLORS.primary.main}`,
  },
  sectionTitle: {
    fontSize: PDF_TYPOGRAPHY.fontSize.h3,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    color: REPORT_COLORS.neutral.gray800,
    marginBottom: PDF_SPACING.md,
    paddingBottom: PDF_SPACING.xs,
    borderBottom: `1 solid ${REPORT_COLORS.neutral.gray200}`,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: REPORT_COLORS.pdf.tableBorder,
    borderRadius: PDF_RADIUS.sm,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: REPORT_COLORS.pdf.tableBorder,
    minHeight: 32,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: REPORT_COLORS.pdf.tableHeaderBg,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
  },
  tableHeaderCell: {
    flex: 1,
    padding: PDF_SPACING.sm,
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.pdf.tableHeaderText,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
  },
  tableCell: {
    flex: 1,
    padding: PDF_SPACING.sm,
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.neutral.gray700,
  },
  tableCellAlt: {
    backgroundColor: REPORT_COLORS.neutral.gray50,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: REPORT_COLORS.pdf.footerText,
    fontSize: PDF_TYPOGRAPHY.fontSize.tiny,
    borderTop: `1 solid ${REPORT_COLORS.neutral.gray200}`,
    paddingTop: PDF_SPACING.sm,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.oblique,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: PDF_SPACING.md,
    gap: PDF_SPACING.sm,
  },
  statCard: {
    flexBasis: "30%",
    padding: PDF_SPACING.md,
    backgroundColor: REPORT_COLORS.pdf.sectionBg,
    borderWidth: 1,
    borderColor: REPORT_COLORS.pdf.cardBorder,
    borderRadius: PDF_RADIUS.md,
    borderLeft: `3 solid ${REPORT_COLORS.primary.main}`,
  },
  statLabel: {
    fontSize: PDF_TYPOGRAPHY.fontSize.small,
    color: REPORT_COLORS.neutral.gray600,
    marginBottom: PDF_SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: PDF_TYPOGRAPHY.fontSize.h2,
    fontWeight: PDF_TYPOGRAPHY.fontWeight.bold,
    fontFamily: PDF_TYPOGRAPHY.fontFamily.bold,
    color: REPORT_COLORS.primary.main,
  },
  chartContainer: {
    marginTop: PDF_SPACING.md,
    marginBottom: PDF_SPACING.md,
    padding: PDF_SPACING.md,
    backgroundColor: REPORT_COLORS.neutral.white,
    borderRadius: PDF_RADIUS.sm,
  },
});

interface PDFDocumentProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const PDFDocument = ({ title, subtitle, children }: PDFDocumentProps) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.metaInfo}>Generado el {currentDate} a las {currentTime}</Text>
        </View>
        {children}
        <Text style={styles.footer}>
          RosterEdge - Sistema de Gestión Deportiva | {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

export const PDFSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface PDFTableProps {
  headers: string[];
  data: (string | number)[][];
}

export const PDFTable = ({ headers, data }: PDFTableProps) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.tableHeaderCell}>
          {header}
        </Text>
      ))}
    </View>
    {data.map((row, rowIndex) => (
      <View
        key={rowIndex}
        style={rowIndex % 2 === 1 ? [styles.tableRow, styles.tableCellAlt] : styles.tableRow}
      >
        {row.map((cell, cellIndex) => (
          <Text key={cellIndex} style={styles.tableCell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

interface PDFStatCardsProps {
  stats: { label: string; value: string | number }[];
}

export const PDFStatCards = ({ stats }: PDFStatCardsProps) => (
  <View style={styles.statsGrid}>
    {stats.map((stat, index) => (
      <View key={index} style={styles.statCard}>
        <Text style={styles.statLabel}>{stat.label}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
      </View>
    ))}
  </View>
);

interface PDFBarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
}

export const PDFBarChart = ({ data, title, height = 200 }: PDFBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <Canvas
        style={{ width: '100%', height }}
        paint={(painter, availableWidth, availableHeight) => {
          const barWidth = availableWidth / data.length;
          const padding = 45;
          const chartHeight = availableHeight - padding;

          // Draw background grid lines
          for (let i = 0; i <= 4; i++) {
            const y = padding/2 + (chartHeight * i) / 4;
            painter
              .strokeColor(REPORT_COLORS.neutral.gray200)
              .lineWidth(0.5)
              .moveTo(0, y)
              .lineTo(availableWidth, y)
              .stroke();
          }

          // Draw bars
          data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = index * barWidth;
            const y = availableHeight - barHeight - padding/2;

            // Draw gradient-like bar with shadow effect (red theme)
            painter
              .fillColor(REPORT_COLORS.primary.light)
              .rect(x + barWidth * 0.15, y, barWidth * 0.7, barHeight)
              .fill();

            // Draw bar border
            painter
              .strokeColor(REPORT_COLORS.primary.dark)
              .lineWidth(1)
              .rect(x + barWidth * 0.15, y, barWidth * 0.7, barHeight)
              .stroke();

            // Draw value on top with better styling
            painter
              .fillColor(REPORT_COLORS.neutral.gray800)
              .fontSize(9)
              .text(String(item.value), x, y - 14, {
                width: barWidth,
                align: 'center',
              });

            // Draw label at bottom
            painter
              .fillColor(REPORT_COLORS.neutral.gray600)
              .fontSize(8)
              .text(
                item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
                x,
                availableHeight - padding/2 + 5,
                {
                  width: barWidth,
                  align: 'center',
                }
              );
          });

          // Draw axis with better styling
          painter
            .strokeColor(REPORT_COLORS.neutral.gray400)
            .lineWidth(1.5)
            .moveTo(0, availableHeight - padding/2)
            .lineTo(availableWidth, availableHeight - padding/2)
            .stroke();

          return null;
        }}
      />
    </View>
  );
};

interface PDFMultiBarChartProps {
  data: { name: string; [key: string]: string | number }[];
  bars: { key: string; name: string; color: string }[];
  title?: string;
  height?: number;
}

export const PDFMultiBarChart = ({ data, bars, title, height = 200 }: PDFMultiBarChartProps) => {
  // Find max value across all bars
  const maxValue = Math.max(
    ...data.flatMap(item =>
      bars.map(bar => Number(item[bar.key]) || 0)
    )
  );

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <Canvas
        style={{ width: '100%', height }}
        paint={(painter, availableWidth, availableHeight) => {
          const groupWidth = availableWidth / data.length;
          const barWidth = groupWidth / (bars.length + 0.5);
          const padding = 50;
          const chartHeight = availableHeight - padding;

          // Draw bars
          data.forEach((item, dataIndex) => {
            bars.forEach((bar, barIndex) => {
              const value = Number(item[bar.key]) || 0;
              const barHeight = (value / maxValue) * chartHeight;
              const x = dataIndex * groupWidth + barIndex * barWidth + barWidth * 0.1;
              const y = availableHeight - barHeight - padding/2;

              // Draw bar
              painter
                .fillColor(bar.color)
                .rect(x, y, barWidth * 0.9, barHeight)
                .fill();

              // Draw value on top if space allows
              if (barHeight > 15) {
                painter
                  .fillColor('#374151')
                  .fontSize(7)
                  .text(String(value), x, y - 10, {
                    width: barWidth * 0.9,
                    align: 'center',
                  });
              }
            });

            // Draw group label at bottom
            painter
              .fillColor('#6b7280')
              .fontSize(7)
              .text(
                String(item.name).length > 8 ? String(item.name).substring(0, 8) + '...' : String(item.name),
                dataIndex * groupWidth,
                availableHeight - padding/2 + 5,
                {
                  width: groupWidth,
                  align: 'center',
                }
              );
          });

          // Draw axis
          painter
            .strokeColor('#e5e7eb')
            .moveTo(0, availableHeight - padding/2)
            .lineTo(availableWidth, availableHeight - padding/2)
            .stroke();

          // Draw legend
          const legendX = 10;
          let legendY = 5;
          bars.forEach((bar) => {
            painter
              .fillColor(bar.color)
              .rect(legendX, legendY, 8, 8)
              .fill();

            painter
              .fillColor('#374151')
              .fontSize(8)
              .text(bar.name, legendX + 12, legendY - 1);

            legendY += 12;
          });

          return null;
        }}
      />
    </View>
  );
};

interface PDFPieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
}

export const PDFPieChart = ({ data, title, height = 180 }: PDFPieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    REPORT_COLORS.chart.blue,
    REPORT_COLORS.chart.green,
    REPORT_COLORS.chart.orange,
    REPORT_COLORS.chart.purple,
    REPORT_COLORS.chart.cyan,
    REPORT_COLORS.chart.pink,
    REPORT_COLORS.chart.indigo,
    REPORT_COLORS.chart.yellow,
  ];

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <Canvas
        style={{ width: '100%', height }}
        paint={(painter, availableWidth) => {
          const centerX = availableWidth / 2;
          const centerY = height / 2;
          const radius = Math.min(centerX, centerY) - 45;

          let currentAngle = -90; // Start at top

          // Draw pie slices with borders
          data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 360;
            const color = colors[index % colors.length];

            // Draw slice
            painter.save();
            painter.fillColor(color);

            // Move to center
            painter.path(`
              M ${centerX} ${centerY}
              L ${centerX + radius * Math.cos((currentAngle * Math.PI) / 180)} ${centerY + radius * Math.sin((currentAngle * Math.PI) / 180)}
              A ${radius} ${radius} 0 ${sliceAngle > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(((currentAngle + sliceAngle) * Math.PI) / 180)} ${centerY + radius * Math.sin(((currentAngle + sliceAngle) * Math.PI) / 180)}
              Z
            `).fill();

            // Draw slice border
            painter.strokeColor(REPORT_COLORS.neutral.white);
            painter.lineWidth(2);
            painter.path(`
              M ${centerX} ${centerY}
              L ${centerX + radius * Math.cos((currentAngle * Math.PI) / 180)} ${centerY + radius * Math.sin((currentAngle * Math.PI) / 180)}
              A ${radius} ${radius} 0 ${sliceAngle > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(((currentAngle + sliceAngle) * Math.PI) / 180)} ${centerY + radius * Math.sin(((currentAngle + sliceAngle) * Math.PI) / 180)}
              Z
            `).stroke();

            painter.restore();

            currentAngle += sliceAngle;
          });

          // Draw legend with better styling
          let legendY = 10;
          data.forEach((item, index) => {
            const color = colors[index % colors.length];
            const percentage = ((item.value / total) * 100).toFixed(1);

            // Color box with border
            painter
              .fillColor(color)
              .rect(10, legendY, 10, 10)
              .fill();

            painter
              .strokeColor(REPORT_COLORS.neutral.gray400)
              .lineWidth(0.5)
              .rect(10, legendY, 10, 10)
              .stroke();

            // Label
            painter
              .fillColor(REPORT_COLORS.neutral.gray800)
              .fontSize(9)
              .text(`${item.name}: ${percentage}%`, 24, legendY);

            legendY += 14;
          });

          return null;
        }}
      />
    </View>
  );
};

interface PDFLineChartProps {
  data: { name: string; [key: string]: string | number }[];
  lines: { key: string; name: string; color: string }[];
  title?: string;
  height?: number;
}

export const PDFLineChart = ({ data, lines, title, height = 180 }: PDFLineChartProps) => {
  // Find max value across all lines
  const maxValue = Math.max(
    ...data.flatMap(item =>
      lines.map(line => Number(item[line.key]) || 0)
    ),
    1 // Ensure at least 1 to avoid division by zero
  );

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <Canvas
        style={{ width: '100%', height }}
        paint={(painter, availableWidth, availableHeight) => {
          const padding = { left: 40, right: 20, top: 30, bottom: 40 };
          const chartWidth = availableWidth - padding.left - padding.right;
          const chartHeight = availableHeight - padding.top - padding.bottom;
          const pointSpacing = chartWidth / Math.max(data.length - 1, 1);

          // Draw grid lines
          for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight * i) / 5;
            painter
              .strokeColor(REPORT_COLORS.neutral.gray200)
              .lineWidth(0.5)
              .moveTo(padding.left, y)
              .lineTo(availableWidth - padding.right, y)
              .stroke();

            // Y-axis labels
            const value = Math.round((maxValue * (5 - i)) / 5);
            painter
              .fillColor(REPORT_COLORS.neutral.gray600)
              .fontSize(9)
              .text(String(value), 5, y - 4, { width: 30, align: 'right' });
          }

          // Draw axes
          painter
            .strokeColor(REPORT_COLORS.neutral.gray400)
            .lineWidth(1.5)
            .moveTo(padding.left, padding.top)
            .lineTo(padding.left, availableHeight - padding.bottom)
            .lineTo(availableWidth - padding.right, availableHeight - padding.bottom)
            .stroke();

          // Draw lines
          lines.forEach((line) => {
            painter.strokeColor(line.color).lineWidth(2.5);

            data.forEach((item, index) => {
              const x = padding.left + index * pointSpacing;
              const value = Number(item[line.key]) || 0;
              const y = availableHeight - padding.bottom - (value / maxValue) * chartHeight;

              if (index === 0) {
                painter.moveTo(x, y);
              } else {
                painter.lineTo(x, y);
              }

              // Draw point with border
              painter.circle(x, y, 4).fillColor(line.color).fill();
              painter.circle(x, y, 4).strokeColor(REPORT_COLORS.neutral.white).lineWidth(1.5).stroke();
            });
            painter.stroke();
          });

          // Draw x-axis labels (every few points to avoid overlap)
          const labelInterval = Math.ceil(data.length / 8);
          data.forEach((item, index) => {
            if (index % labelInterval === 0 || index === data.length - 1) {
              const x = padding.left + index * pointSpacing;
              const label = String(item.name).length > 10
                ? String(item.name).substring(0, 8) + '...'
                : String(item.name);

              painter
                .fillColor(REPORT_COLORS.neutral.gray600)
                .fontSize(8)
                .text(label, x - 15, availableHeight - padding.bottom + 5, {
                  width: 30,
                  align: 'center',
                });
            }
          });

          // Draw legend with better styling
          let legendY = 10;
          lines.forEach((line) => {
            // Line indicator
            painter
              .strokeColor(line.color)
              .lineWidth(3)
              .moveTo(padding.left, legendY + 4)
              .lineTo(padding.left + 18, legendY + 4)
              .stroke();

            // Point indicator
            painter
              .circle(padding.left + 9, legendY + 4, 3)
              .fillColor(line.color)
              .fill();

            // Label
            painter
              .fillColor(REPORT_COLORS.neutral.gray800)
              .fontSize(9)
              .text(line.name, padding.left + 22, legendY);

            legendY += 14;
          });

          return null;
        }}
      />
    </View>
  );
};
