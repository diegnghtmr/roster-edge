import { InternalHeader } from "@/components/layout/InternalHeader";
import { ReportCard } from "@/components/reports/ReportCard";
import { reportsData, getIconComponent } from "./ReportsData";

export const ReportsModule = () => {

  return (
    <div className="w-full">
      <InternalHeader
        title="Reportes y Análiticas"
        description="Visualiza y exporta informes detallados sobre tu organización deportiva"
        buttons={[]}
      />

      <div className="bg-white w-full shadow-md rounded-lg min-h-screen p-6">
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
      </div>
    </div>
  );
};
