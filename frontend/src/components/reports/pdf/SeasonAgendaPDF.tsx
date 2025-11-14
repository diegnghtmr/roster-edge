import { PDFDocument, PDFTable, PDFSection, PDFStatCards, PDFBarChart } from './PDFDocument';
import type { SeasonAgendaResponse } from '@/interface/IReports';

interface SeasonAgendaPDFProps {
  data: SeasonAgendaResponse[];
  seasonName?: string;
}

export const SeasonAgendaPDF = ({ data, seasonName }: SeasonAgendaPDFProps) => {
  // Calculate stats
  const upcomingEvents = data.filter((event) => (event.daysToEvent || 0) >= 0).length;
  const pastEvents = data.filter((event) => (event.daysToEvent || 0) < 0).length;
  const nextEvent = data.find((event) => (event.daysToEvent || 0) >= 0);

  const stats = [
    { label: 'Eventos Próximos', value: upcomingEvents },
    { label: 'Eventos Pasados', value: pastEvents },
    {
      label: 'Próximo Evento',
      value: nextEvent ? `En ${nextEvent.daysToEvent} días` : 'Sin eventos',
    },
  ];

  // Chart data - upcoming vs past
  const chartData = [
    { name: 'Próximos', value: upcomingEvents },
    { name: 'Pasados', value: pastEvents },
  ];

  const tableHeaders = ['Evento', 'Fecha', 'Días hasta', 'Fase', 'Sede', 'Ciudad'];

  const tableData = data.map((event) => [
    event.eventName || '-',
    event.eventDate || '-',
    event.daysToEvent || 0,
    event.phase || '-',
    event.venueName || '-',
    event.cityName || '-',
  ]);

  return (
    <PDFDocument
      title="Agenda de Temporada"
      subtitle={seasonName ? `Temporada: ${seasonName}` : 'Calendario de Eventos'}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Distribución de Eventos">
        <PDFBarChart data={chartData} height={140} />
      </PDFSection>

      <PDFSection title="Calendario Completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>
    </PDFDocument>
  );
};
