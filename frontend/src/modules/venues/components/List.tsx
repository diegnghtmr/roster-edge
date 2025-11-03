import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
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
import { VenueItemList } from "./ItemList";
import type { IVenueResponse } from "@/interface/IVenue";
import type { City } from "@/interface/ICity";
import type { Club } from "@/interface/IClub";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Email", key: "email" },
  { title: "Teléfono", key: "phone" },
  { title: "Ciudad", key: "cityId" },
  { title: "Club", key: "clubId" },
  { title: "Acciones", key: "actions", className: "w-32" },
];

const filters: FilterConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Buscar por nombre...",
  },
];

export const VenuesList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "venuesList",
    resource: ["venues"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  // Fetch cities for display names
  const { data: cities = [] } = useGetList<City[]>({
    key: "cities",
    resource: ["cities"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch clubs for display names
  const { data: clubs = [] } = useGetList<Club[]>({
    key: "clubs",
    resource: ["clubs"],
    keyResults: "data",
    enabled: true,
  });

  const deleteService = useMutateDeleteService(["venues"]);

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
    setVenueToDelete(id);
  }, []);

  // Confirm and delete venue
  const confirmDelete = () => {
    if (venueToDelete !== null) {
      deleteItem(venueToDelete.toString());
      setVenueToDelete(null);
    }
  };

  // Delete venue
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Sede eliminada exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar la sede");
      },
    });
  };

  // Ensure data is properly typed as IVenueResponse array
  const venues: IVenueResponse[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (venue: IVenueResponse) => (
    <VenueItemList
      key={venue.id}
      venue={venue}
      onDelete={handleDelete}
      cities={cities}
      clubs={clubs}
    />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={venues}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron sedes"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={venueToDelete !== null}
        onOpenChange={(open) => !open && setVenueToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sede será eliminada
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
