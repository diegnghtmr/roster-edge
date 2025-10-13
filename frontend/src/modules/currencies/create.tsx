import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutateService } from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CurrencyForm, type INewCurrency } from "./components/Form";

interface IField {
  name: string;
  value: string | number;
}

export const CurrencyCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currency, setCurrency] = useState<INewCurrency>({
    name: "",
    symbol: "",
  });

  const resource = ["currencies"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const currencyData = {
        name: currency.name,
        symbol: currency.symbol,
      };

      mutate(currencyData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al crear la moneda"
            );
          } else {
            // Only redirect on success
            toast.success("Moneda creada exitosamente");
            navigate("/currencies");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear la moneda. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [currency, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setCurrency({ ...currency, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Monedas"
        description="Completa todos los campos para crear una nueva moneda"
        buttonText="Ver monedas"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/currencies"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <CurrencyForm
          currency={currency}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al crear la moneda</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CurrencyCreateModule;
