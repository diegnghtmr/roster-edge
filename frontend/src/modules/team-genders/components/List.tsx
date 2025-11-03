import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { TeamGender } from "@/interface/ITeamGender";
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
import { TeamGenderItemList } from "./ItemList";


const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Estado", key: "active", className: "w-24" },
  { title: "Fecha de creación", key: "createdAt" },
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

export const TeamGendersList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [genderToDelete, setGenderToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "gendersList",
    resource: ["team-genders"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["team-genders"]);

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
    setGenderToDelete(id);
  }, []);

  // Confirm and delete gender
  const confirmDelete = () => {
    if (genderToDelete !== null) {
      deleteItem(genderToDelete.toString());
      setGenderToDelete(null);
    }
  };

  // Delete gender
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Género eliminado exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar el género");
      },
    });
  };

  // Ensure data is properly typed as TeamGender array
  const genders: TeamGender[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (gender: TeamGender) => (
    <TeamGenderItemList key={gender.id} gender={gender} onDelete={handleDelete} />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={genders}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron géneros"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={genderToDelete !== null}
        onOpenChange={(open) => !open && setGenderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El género será eliminado
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