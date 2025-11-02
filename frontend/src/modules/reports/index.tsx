import { InternalHeader } from "@/components/layout/InternalHeader";
import { ReportCard } from "@/components/reports/ReportCard";
import { BarChart3 } from "lucide-react";
import { reportsData, getIconComponent } from "./ReportsData";

export const ReportsModule = () => {
  const categories = [
    { id: "season", name: "Temporada", color: "bg-green-100 text-green-800" },
    { id: "team", name: "Equipos", color: "bg-blue-100 text-blue-800" },
    { id: "performance", name: "Rendimiento", color: "bg-purple-100 text-purple-800" },
    { id: "staff", name: "Personal", color: "bg-orange-100 text-orange-800" },
  ];

  return (
    <div className="w-full">
      <InternalHeader
        title="Reportes y Analíticas"
        description="Visualiza y exporta informes detallados sobre tu organización deportiva"
        buttons={[]}
      />

      <div className="bg-white w-full shadow-md rounded-lg min-h-screen p-6">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category.color} hover:opacity-80`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsData.map((report) => {
            const IconComponent = getIconComponent(report.icon);
            return (
              <ReportCard
                key={report.id}
                title={report.name}
                description={report.description}
                icon={<IconComponent className="h-6 w-6" />}
                path={report.endpoint}
                category={report.category}
              />
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Acerca de los Reportes
              </h3>
              <p className="text-sm text-blue-800">
                Cada reporte puede ser visualizado en pantalla y exportado a PDF para su
                distribución. Utiliza los filtros disponibles en cada reporte para personalizar
                la información según tus necesidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
