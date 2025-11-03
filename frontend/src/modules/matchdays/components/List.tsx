import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { IMatchday } from "@/interface/IMatchday";
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
import { MatchdayItem } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Descripción", key: "description" },
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
];

export const MatchdaysList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [matchdayToDelete, setMatchdayToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList<IMatchday[]>({
    key: "matchdaysList",
    resource: ["matchdays"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["matchdays"]);

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
    setMatchdayToDelete(id);
  }, []);

  // Confirm and delete matchday
  const confirmDelete = () => {
    if (matchdayToDelete !== null) {
      deleteItem(matchdayToDelete.toString());
      setMatchdayToDelete(null);
    }
  };

  // Delete matchday
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Jornada eliminada exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar la jornada");
      },
    });
  };

  // Ensure data is properly typed as IMatchday array
  const matchdays: IMatchday[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (matchday: IMatchday) => (
    <MatchdayItem
      key={matchday.id}
      matchday={matchday}
      onDelete={handleDelete}
    />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={matchdays}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron jornadas"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={matchdayToDelete !== null}
        onOpenChange={(open) => !open && setMatchdayToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La jornada será eliminada
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
