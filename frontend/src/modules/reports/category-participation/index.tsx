import { useState } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { BarChartComponent } from "@/components/reports/charts/BarChartComponent";
import { PieChartComponent } from "@/components/reports/charts/PieChartComponent";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { CategoryParticipationPDF } from "@/components/reports/pdf/CategoryParticipationPDF";
import { useCategoryParticipationReport } from "@/api/services/reports/useReportsData";
import { ArrowLeft, BarChart3, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryParticipationResponse } from "@/interface/IReports";

const filterFields: FilterField[] = [
  {
    key: "clubId",
    label: "Club",
    type: "number",
    placeholder: "ID de club",
  },
  {
    key: "seasonId",
    label: "Temporada",
    type: "number",
    placeholder: "ID de temporada",
  },
  {
    key: "categoryId",
    label: "Categoría",
    type: "number",
    placeholder: "ID de categoría",
  },
  {
    key: "genderId",
    label: "Género",
    type: "number",
    placeholder: "ID de género",
  },
];

const tableHeaders: TableColumn[] = [
  { title: "Club", key: "clubName" },
  { title: "Categoría", key: "categoryName" },
  { title: "Género", key: "genderName", className: "w-32" },
  { title: "Partidos", key: "matchesCount", className: "w-24" },
  { title: "% Participación", key: "participationPercentage", className: "w-32" },
];

export const CategoryParticipationReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  const { data, isLoading } = useCategoryParticipationReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const participation = (data || []) as CategoryParticipationResponse[];

  // Calculate stats
  const totalMatches = participation.reduce((sum, item) => sum + (item.matchesCount || 0), 0);
  const categories = new Set(participation.map(item => item.categoryName)).size;
  const genders = new Set(participation.map(item => item.genderName)).size;

  // Chart data
  const categoryChart = participation.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.categoryName);
    if (existing) {
      existing.partidos += item.matchesCount || 0;
    } else {
      acc.push({ name: item.categoryName || "Sin categoría", partidos: item.matchesCount || 0 });
    }
    return acc;
  }, [] as { name: string; partidos: number }[]);

  const genderChart = participation.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.genderName);
    if (existing) {
      existing.value += item.matchesCount || 0;
    } else {
      acc.push({ name: item.genderName || "Sin género", value: item.matchesCount || 0 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const renderRow = (item: CategoryParticipationResponse) => (
    <tr key={`${item.categoryId}-${item.genderId}-${item.clubId}`}>
      <td className="px-4 py-3 font-medium">{item.clubName}</td>
      <td className="px-4 py-3 text-gray-700">{item.categoryName}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {item.genderName}
        </span>
      </td>
      <td className="px-4 py-3 text-center font-semibold text-blue-600">
        {item.matchesCount || 0}
      </td>
      <td className="px-4 py-3 text-center font-semibold text-green-600">
        {item.participationPercentage ? `${item.participationPercentage.toFixed(1)}%` : "0.0%"}
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Participación por Categoría"
        description="Análisis de participación por categoría y género"
        buttons={[
          {
            text: "Volver",
            icon: <ArrowLeft className="h-4 w-4" />,
            link: "/reports",
            variant: "outline",
          },
        ]}
      />

      <div className="bg-white w-full shadow-md rounded-lg min-h-screen p-6 space-y-6">
        <ReportFilters
          fields={filterFields}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total de Partidos"
            value={totalMatches}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Categorías"
            value={categories}
            subtitle="categorías diferentes"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Géneros"
            value={genders}
            subtitle="géneros representados"
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<CategoryParticipationPDF data={participation} />}
            fileName={`participacion-categoria-${new Date().toISOString().split("T")[0]}`}
            disabled={participation.length === 0}
          />
        </div>

        {!isLoading && participation.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partidos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={categoryChart}
                  xKey="name"
                  bars={[
                    { key: "partidos", name: "Partidos", color: "#3b82f6" },
                  ]}
                  yAxisLabel="Número de Partidos"
                  height={400}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Género</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={genderChart}
                  nameKey="name"
                  valueKey="value"
                  colors={["#3b82f6", "#ec4899", "#8b5cf6"]}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={participation}
            headers={tableHeaders}
            renderRow={renderRow}
            loading={isLoading}
            emptyMessage="No se encontraron datos para los filtros seleccionados"
          />
        </div>
      </div>
    </div>
  );
};
