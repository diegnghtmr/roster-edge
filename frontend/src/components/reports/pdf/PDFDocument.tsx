import { Document, Page, Text, View, StyleSheet, Canvas } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #3b82f6",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: "#374151",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 10,
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flexBasis: "30%",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
  },
  chartContainer: {
    marginTop: 10,
    marginBottom: 15,
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.subtitle}>Generado el {currentDate}</Text>
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
        <Text key={index} style={styles.tableCell}>
          {header}
        </Text>
      ))}
    </View>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
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
          const padding = 40;
          const chartHeight = availableHeight - padding;

          // Draw bars
          data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = index * barWidth;
            const y = availableHeight - barHeight - padding/2;

            // Draw bar
            painter
              .fillColor('#3b82f6')
              .rect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight)
              .fill();

            // Draw value on top
            painter
              .fillColor('#374151')
              .fontSize(8)
              .text(String(item.value), x, y - 12, {
                width: barWidth,
                align: 'center',
              });

            // Draw label at bottom
            painter
              .fillColor('#6b7280')
              .fontSize(7)
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

          // Draw axis
          painter
            .strokeColor('#e5e7eb')
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
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <Canvas
        style={{ width: '100%', height }}
        paint={(painter, availableWidth) => {
          const centerX = availableWidth / 2;
          const centerY = height / 2;
          const radius = Math.min(centerX, centerY) - 40;

          let currentAngle = -90; // Start at top

          // Draw pie slices
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
            painter.restore();

            currentAngle += sliceAngle;
          });

          // Draw legend
          let legendY = 10;
          data.forEach((item, index) => {
            const color = colors[index % colors.length];
            const percentage = ((item.value / total) * 100).toFixed(1);

            // Color box
            painter
              .fillColor(color)
              .rect(10, legendY, 8, 8)
              .fill();

            // Label
            painter
              .fillColor('#374151')
              .fontSize(8)
              .text(`${item.name}: ${percentage}%`, 22, legendY);

            legendY += 12;
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
              .strokeColor('#e5e7eb')
              .moveTo(padding.left, y)
              .lineTo(availableWidth - padding.right, y)
              .stroke();

            // Y-axis labels
            const value = Math.round((maxValue * (5 - i)) / 5);
            painter
              .fillColor('#6b7280')
              .fontSize(8)
              .text(String(value), 5, y - 4, { width: 30, align: 'right' });
          }

          // Draw axes
          painter
            .strokeColor('#374151')
            .lineWidth(1)
            .moveTo(padding.left, padding.top)
            .lineTo(padding.left, availableHeight - padding.bottom)
            .lineTo(availableWidth - padding.right, availableHeight - padding.bottom)
            .stroke();

          // Draw lines
          lines.forEach((line) => {
            painter.strokeColor(line.color).lineWidth(2);

            data.forEach((item, index) => {
              const x = padding.left + index * pointSpacing;
              const value = Number(item[line.key]) || 0;
              const y = availableHeight - padding.bottom - (value / maxValue) * chartHeight;

              if (index === 0) {
                painter.moveTo(x, y);
              } else {
                painter.lineTo(x, y);
              }

              // Draw point
              painter.circle(x, y, 2).fillColor(line.color).fill();
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
                .fillColor('#6b7280')
                .fontSize(7)
                .text(label, x - 15, availableHeight - padding.bottom + 5, {
                  width: 30,
                  align: 'center',
                });
            }
          });

          // Draw legend
          let legendY = 10;
          lines.forEach((line) => {
            painter
              .strokeColor(line.color)
              .lineWidth(2)
              .moveTo(padding.left, legendY)
              .lineTo(padding.left + 15, legendY)
              .stroke();

            painter
              .fillColor('#374151')
              .fontSize(8)
              .text(line.name, padding.left + 20, legendY - 3);

            legendY += 12;
          });

          return null;
        }}
      />
    </View>
  );
};
