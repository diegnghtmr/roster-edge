import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { City } from "@/interface/ICity";
import type { Country } from "@/interface/ICountry";
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
import { CityItemList } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "País", key: "countryName" },
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
];

export const CitiesList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList<City[]>({
    key: "citiesList",
    resource: ["cities"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const { data: countriesData } = useGetList<Country[]>({
    key: "citiesCountriesList",
    resource: ["countries"],
    keyResults: "data",
    enabled: true,
  });

  const deleteService = useMutateDeleteService(["cities"]);

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
    setCityToDelete(id);
  }, []);

  // Confirm and delete city
  const confirmDelete = () => {
    if (cityToDelete !== null) {
      deleteItem(cityToDelete.toString());
      setCityToDelete(null);
    }
  };

  // Delete city
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Ciudad eliminada exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar la ciudad");
      },
    });
  };

  // Ensure data is properly typed as City array
  const countryMap = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) {
      return new Map<number, string>();
    }
    return new Map<number, string>(
      countriesData.map((country) => [country.id, country.name]),
    );
  }, [countriesData]);

  const cities: City[] = React.useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data)) {
      console.warn("Unexpected data structure:", data);
      return [];
    }
    return data.map((city) => ({
      ...city,
      countryName:
        countryMap.get(city.countryId) ?? city.countryName ?? null,
    }));
  }, [data, countryMap]);

  // Render function for each row
  const renderRow = (city: City) => (
    <CityItemList key={city.id} city={city} onDelete={handleDelete} />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={cities}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron ciudades"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={cityToDelete !== null}
        onOpenChange={(open) => !open && setCityToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La ciudad será eliminada
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
