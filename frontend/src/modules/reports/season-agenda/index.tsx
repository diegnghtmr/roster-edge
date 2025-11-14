import { useState, useMemo } from "react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportFilters, type FilterField } from "@/components/reports/ReportFilters";
import { StatCard } from "@/components/reports/StatCard";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { SeasonAgendaPDF } from "@/components/reports/pdf/SeasonAgendaPDF";
import { useSeasonAgendaReport } from "@/api/services/reports/useReportsData";
import { useSeasonsForFilter, useClubsForFilter } from "@/api/services/filters/useFilterOptions";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SeasonAgendaResponse } from "@/interface/IReports";

const tableHeaders: TableColumn[] = [
  { title: "Evento", key: "eventName" },
  { title: "Fecha", key: "eventDate", className: "w-32" },
  { title: "Días hasta", key: "daysToEvent", className: "w-24" },
  { title: "Fase", key: "phase", className: "w-32" },
  { title: "Sede", key: "venueName" },
  { title: "Ciudad", key: "cityName", className: "w-32" },
];

export const SeasonAgendaReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | boolean | undefined>>({});

  // Fetch filter options
  const { options: clubOptions, isLoading: clubsLoading } = useClubsForFilter();
  const { options: seasonOptions, isLoading: seasonsLoading } = useSeasonsForFilter(
    filters.clubId ? Number(filters.clubId) : undefined
  );

  // Dynamic filter fields with loaded options
  const filterFields: FilterField[] = useMemo(() => [
    {
      key: "clubId",
      label: "Club",
      type: "select",
      options: clubOptions,
      placeholder: clubsLoading ? "Cargando..." : "Seleccionar club (opcional)",
    },
    {
      key: "seasonId",
      label: "Temporada",
      type: "select",
      options: seasonOptions,
      placeholder: seasonsLoading ? "Cargando..." : "Seleccionar temporada (opcional)",
    },
    {
      key: "fromDate",
      label: "Fecha Inicio",
      type: "date",
      placeholder: "Fecha de inicio (opcional)",
    },
    {
      key: "toDate",
      label: "Fecha Fin",
      type: "date",
      placeholder: "Fecha de fin (opcional)",
    },
  ], [clubOptions, clubsLoading, seasonOptions, seasonsLoading]);

  const { data, isLoading } = useSeasonAgendaReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    if (key === "clubId") {
      setFilters({ ...filters, clubId: value, seasonId: undefined });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) return;
      if (key.endsWith("Id") && typeof value === "string") {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const agenda = (data || []) as SeasonAgendaResponse[];

  // Calculate stats
  const upcomingEvents = agenda.filter(event => (event.daysToEvent || 0) >= 0).length;
  const pastEvents = agenda.filter(event => (event.daysToEvent || 0) < 0).length;
  const nextEvent = agenda.find(event => (event.daysToEvent || 0) >= 0);

  const renderRow = (event: SeasonAgendaResponse) => {
    const daysUntil = event.daysToEvent || 0;
    const isPast = daysUntil < 0;
    const isToday = daysUntil === 0;
    const isSoon = daysUntil > 0 && daysUntil <= 7;

    return (
      <tr key={event.eventId} className={isPast ? "opacity-60" : ""}>
        <td className="px-4 py-3 font-medium">{event.eventName}</td>
        <td className="px-4 py-3 text-gray-600">{event.eventDate}</td>
        <td className={`px-4 py-3 text-center font-semibold ${
          isToday ? "text-red-600" :
          isSoon ? "text-orange-600" :
          isPast ? "text-gray-400" : "text-blue-600"
        }`}>
          {Math.abs(daysUntil)} {isPast ? "pasado" : "días"}
        </td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {event.phase || "Sin fase"}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-700">{event.venueName}</td>
        <td className="px-4 py-3 text-gray-600">{event.cityName}</td>
      </tr>
    );
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Agenda de Temporada"
        description="Calendario de eventos y partidos programados"
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
            title="Eventos Próximos"
            value={upcomingEvents}
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            title="Eventos Pasados"
            value={pastEvents}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Próximo Evento"
            value={nextEvent?.daysToEvent || "N/A"}
            subtitle={nextEvent ? `en ${nextEvent.daysToEvent} días` : "sin eventos"}
            icon={<MapPin className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={
              <SeasonAgendaPDF
                data={agenda}
                seasonName={agenda[0]?.seasonName}
              />
            }
            fileName={`agenda-temporada-${agenda[0]?.seasonName || "reporte"}`}
            disabled={agenda.length === 0}
          />
        </div>

        {!isLoading && nextEvent && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Próximo Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Evento</p>
                  <p className="text-lg font-bold text-blue-900">{nextEvent.eventName}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Fecha</p>
                  <p className="text-lg font-bold text-blue-900">{nextEvent.eventDate}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Sede</p>
                  <p className="text-base text-blue-900">{nextEvent.venueName}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Días restantes</p>
                  <p className="text-2xl font-bold text-blue-600">{nextEvent.daysToEvent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={agenda}
            headers={tableHeaders}
            renderRow={renderRow}
            loading={isLoading}
            emptyMessage="No se encontraron eventos para los filtros seleccionados"
          />
        </div>
      </div>
    </div>
  );
};
