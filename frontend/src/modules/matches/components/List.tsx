import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { IMatchSummary } from "@/interface/IMatchSummary";
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
import { MatchItem } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Fecha", key: "date" },
  { title: "Horario", key: "time" },
  { title: "Local", key: "homeTeam" },
  { title: "Visitante", key: "awayTeam" },
  { title: "Acciones", key: "actions", className: "w-32" },
];

const filters: FilterConfig[] = [
  {
    key: "dateFrom",
    label: "Fecha desde",
    type: "date",
  },
  {
    key: "dateTo",
    label: "Fecha hasta",
    type: "date",
  },
];

export const MatchesList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList<IMatchSummary[]>({
    key: "matchesList",
    resource: ["matches", "schedule"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["matches"]);

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
    setMatchToDelete(id);
  }, []);

  // Confirm and delete match
  const confirmDelete = () => {
    if (matchToDelete !== null) {
      deleteItem(matchToDelete.toString());
      setMatchToDelete(null);
    }
  };

  // Delete match
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Partido eliminado exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar el partido");
      },
    });
  };

  // Ensure data is properly typed as IMatch array
  const matches: IMatchSummary[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (match: IMatchSummary) => (
    <MatchItem key={match.id} match={match} onDelete={handleDelete} />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={matches}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron partidos"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={matchToDelete !== null}
        onOpenChange={(open) => !open && setMatchToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El partido será eliminado
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
