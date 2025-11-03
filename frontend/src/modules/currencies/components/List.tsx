import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { useMutateDeleteService } from "@/api/services/useDelete";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { Currency } from "@/interface/ICurrency";
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
import { CurrencyItemList } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Símbolo", key: "symbol" },

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
    key: "symbol",
    label: "Símbolo",
    type: "text",
    placeholder: "Buscar por símbolo...",
  },
];

export const CurrenciesList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "currenciesList",
    resource: ["currencies"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  const deleteService = useMutateDeleteService(["currencies"]);

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
    setCurrencyToDelete(id);
  }, []);

  // Confirm and delete currency
  const confirmDelete = () => {
    if (currencyToDelete !== null) {
      deleteItem(currencyToDelete.toString());
      setCurrencyToDelete(null);
    }
  };

  // Delete currency
  const deleteItem = (id: string) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success("Moneda eliminada exitosamente");
        setShouldRefetch(true);
      },
      onError: () => {
        toast.error("Error al eliminar la moneda");
      },
    });
  };

  // Ensure data is properly typed as Currency array
  const currencies: Currency[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (currency: Currency) => (
    <CurrencyItemList
      key={currency.id}
      currency={currency}
      onDelete={handleDelete}
    />
  );

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
        <DataTable
          data={currencies}
          headers={headers}
          filters={filters}
          renderRow={renderRow}
          loading={isLoading}
          emptyMessage="No se encontraron monedas"
          className="mt-6"
        />
      </div>

      <AlertDialog
        open={currencyToDelete !== null}
        onOpenChange={(open) => !open && setCurrencyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La moneda será eliminada
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
