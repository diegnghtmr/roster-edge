import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { Currency } from "@/interface/ICurrency";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import { CurrencyForm, type INewCurrency } from "./components/Form";

interface IField {
  name: string;
  value: string | number;
}

export const CurrencyUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [currency, setCurrency] = useState<INewCurrency>({
    name: "",
    symbol: "",
  });

  // Fetch the currency data
  const { data: currencyData, isLoading: loadingCurrency } = useGetList({
    key: `currency-${id}`,
    resource: [`currencies/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when currency data is loaded
  useEffect(() => {
    if (currencyData) {
      const fetchedCurrency = currencyData as Currency;
      setCurrency({
        name: fetchedCurrency.name,
        symbol: fetchedCurrency.symbol,
      });
    }
  }, [currencyData]);

  const resource = [`currencies/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

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
            toast.error(response.error.message || "Error al actualizar el currencies");
          } else {
            toast.success("Currencies actualizado exitosamente");
            navigate("/currencies");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el currencies. Por favor, intenta nuevamente.",
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

  // Show loading state while fetching any required data
  if (loadingCurrency) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingCurrency && "Obteniendo información de la moneda"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Monedas"
        description="Actualizar los datos de la moneda"
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

      
    </div>
  );
};

export default CurrencyUpdateModule;
