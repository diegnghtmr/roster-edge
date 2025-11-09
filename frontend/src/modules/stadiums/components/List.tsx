import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { IStadium } from "@/interface/IStadium";
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
import { StadiumItem } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Área", key: "area" },
  { title: "Superficie", key: "surface" },
  { title: "Capacidad", key: "totalCapacity" },
  { title: "Fundación", key: "foundation" },
  { title: "Acciones", key: "actions", className: "w-32" },
];

const filters: FilterConfig[] = [
  {
    key: "surface",
    label: "Superficie",
    type: "text",
    placeholder: "Buscar por superficie...",
  },
];

export const StadiumsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [stadiumToDelete, setStadiumToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "stadiumsList",
    resource: ["stadiums"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["stadiums"]);

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
    setStadiumToDelete(id);
  }, []);

  // Confirm and delete stadium
  const confirmDelete = () => {
    if (stadiumToDelete !== null) {
      deleteItem(stadiumToDelete.toString());
      setStadiumToDelete(null);
    }
  };

  // Delete stadium
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Estadio eliminado exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar el estadio");
      },
    });
  };

  // Ensure data is properly typed as IStadium array
  const stadiums: IStadium[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (stadium: IStadium) => (
    <StadiumItem key={stadium.id} stadium={stadium} onDelete={handleDelete} />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={stadiums}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron estadios"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={stadiumToDelete !== null}
        onOpenChange={(open) => !open && setStadiumToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El estadio será eliminado
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
