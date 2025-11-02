import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart, PDFPieChart } from "./PDFDocument";
import type { CategoryParticipationResponse } from "@/interface/IReports";

interface CategoryParticipationPDFProps {
  data: CategoryParticipationResponse[];
}

export const CategoryParticipationPDF = ({ data }: CategoryParticipationPDFProps) => {
  // Calculate stats
  const totalMatches = data.reduce((sum, item) => sum + (item.matchesCount || 0), 0);
  const categories = new Set(data.map(item => item.categoryName)).size;
  const genders = new Set(data.map(item => item.genderName)).size;

  const stats = [
    { label: "Total de Partidos", value: totalMatches },
    { label: "Categorías", value: categories },
    { label: "Géneros", value: genders },
  ];

  // Chart data - by category
  const categoryChart = data.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.categoryName);
    if (existing) {
      existing.value += item.matchesCount || 0;
    } else {
      acc.push({ name: item.categoryName || "Sin categoría", value: item.matchesCount || 0 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Chart data - by gender
  const genderChart = data.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.genderName);
    if (existing) {
      existing.value += item.matchesCount || 0;
    } else {
      acc.push({ name: item.genderName || "Sin género", value: item.matchesCount || 0 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const tableHeaders = [
    "Club",
    "Categoría",
    "Género",
    "Partidos",
    "% Participación",
  ];

  const tableData = data.map((item) => [
    item.clubName || "-",
    item.categoryName || "-",
    item.genderName || "-",
    item.matchesCount || 0,
    item.participationPercentage ? `${item.participationPercentage.toFixed(1)}%` : "0.0%",
  ]);

  return (
    <PDFDocument
      title="Participación por Categoría"
      subtitle="Análisis de participación por categoría y género"
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Partidos por Categoría">
        <PDFBarChart data={categoryChart} height={160} />
      </PDFSection>

      <PDFSection title="Distribución por Género">
        <PDFPieChart data={genderChart} height={140} />
      </PDFSection>

      <PDFSection title="Detalle Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
