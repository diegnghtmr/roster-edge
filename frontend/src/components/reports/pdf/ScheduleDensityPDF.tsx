import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFLineChart } from "./PDFDocument";
import type { ScheduleDensityResponse } from "@/interface/IReports";

interface ScheduleDensityPDFProps {
  data: ScheduleDensityResponse[];
  teamName?: string;
}

export const ScheduleDensityPDF = ({ data, teamName }: ScheduleDensityPDFProps) => {
  // Calculate stats
  const matchesWithLowRest = data.filter(m => m.belowRestThreshold).length;
  const avgRestDays = data.length > 0
    ? (data.reduce((sum, m) => sum + (m.restDays || 0), 0) / data.length).toFixed(1)
    : "0.0";
  const maxDensity = Math.max(...data.map(m => (m.matchesLastSevenDays || 0) + (m.matchesNextSevenDays || 0)), 0);

  const stats = [
    { label: "Partidos con Poco Descanso", value: matchesWithLowRest },
    { label: "Descanso Promedio", value: `${avgRestDays} días` },
    { label: "Densidad Máxima", value: `${maxDensity} partidos` },
  ];

  // Chart data
  const chartData = data.map((match, index) => ({
    name: match.matchDate || `P${index + 1}`,
    descanso: match.restDays || 0,
    ultimos7d: match.matchesLastSevenDays || 0,
    proximos7d: match.matchesNextSevenDays || 0,
  }));

  const tableHeaders = [
    "Fecha",
    "Días Descanso",
    "Últimos 7d",
    "Próximos 7d",
    "Duración (min)",
    "Alerta",
  ];

  const tableData = data.map((match) => [
    match.matchDate || "-",
    match.restDays || 0,
    match.matchesLastSevenDays || 0,
    match.matchesNextSevenDays || 0,
    match.matchDurationMinutes || 0,
    match.belowRestThreshold ? "Sí" : "No",
  ]);

  return (
    <PDFDocument
      title="Densidad del Calendario"
      subtitle={teamName ? `Equipo: ${teamName}` : "Análisis de Congestion de Partidos"}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Evolución del Descanso y Densidad">
        <PDFLineChart
          data={chartData}
          lines={[
            { key: "descanso", name: "Días de Descanso", color: "#10b981" },
            { key: "ultimos7d", name: "Últimos 7d", color: "#3b82f6" },
            { key: "proximos7d", name: "Próximos 7d", color: "#8b5cf6" },
          ]}
          height={160}
        />
      </PDFSection>

      <PDFSection title="Detalle Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
