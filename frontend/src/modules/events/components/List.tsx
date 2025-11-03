import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { IEvent } from "@/interface/IEvent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { EventItem } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Descripción", key: "description" },
  { title: "Fecha", key: "date" },
  { title: "Temporada", key: "seasonId" },
  { title: "Sede", key: "venueId" },
  { title: "Estado", key: "active", className: "w-24" },
  { title: "Acciones", key: "actions", className: "w-32" },
];

const filters: FilterConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Buscar por nombre...",
  },
  {
    key: "description",
    label: "Descripción",
    type: "text",
    placeholder: "Buscar por descripción...",
  },
  {
    key: "seasonId",
    label: "Temporada",
    type: "text",
    placeholder: "Buscar por temporada...",
  },
  {
    key: "venueId",
    label: "Sede",
    type: "text",
    placeholder: "Buscar por sede...",
  },
  {
    key: "active",
    label: "Estado",
    type: "select",
    options: [
      { key: "true", value: "Activo" },
      { key: "false", value: "Inactivo" },
    ],
    placeholder: "Seleccionar estado",
  },
];

export const EventsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList<IEvent[]>({
    key: "eventsList",
    resource: ["events"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["events"]);

  // Avoid infinity loops handle manually refetch
  useEffect(() => {
    if (!isLoading && !isFetching && shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [isLoading, isFetching, refetch, shouldRefetch]);

  // Detect changes in searchparams to do the refetch
  useEffect(() => {
    setShouldRefetch(true);
  }, [searchParams]);

  // Handle the delete button event
  const handleDelete = useCallback((id: number) => {
    setEventToDelete(id);
  }, []);

  // Confirm and delete event
  const confirmDelete = () => {
    if (eventToDelete !== null) {
      deleteItem(eventToDelete.toString());
      setEventToDelete(null);
    }
  };

  // Delete event
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Evento eliminado exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar el evento");
      },
    });
  };

  // Ensure data is properly typed as IEvent array
  const events: IEvent[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (event: IEvent) => (
    <EventItem key={event.id} event={event} onDelete={handleDelete} />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={events}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron eventos"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={eventToDelete !== null}
        onOpenChange={(open) => !open && setEventToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado
              permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
