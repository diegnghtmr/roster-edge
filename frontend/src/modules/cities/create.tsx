import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { Spinner } from "@/components/ui/spinner";
import type { Country } from "@/interface/ICountry";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type INewCity, CityForm } from "./components/Form";

interface IField {
  name: string;
  value: string | number;
}

export const CityCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [city, setCity] = useState<INewCity>({
    name: "",
    countryId: 0,
  });

  // Fetch countries
  const { data: countries = [], isLoading: isLoadingCountries } = useGetList<
    Country[]
  >({
    key: "countries",
    resource: ["countries"],
    keyResults: "data",
    enabled: true,
  });

  const resource = ["cities"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that required IDs are selected
      if (!city.countryId) {
        toast.error("Por favor complete todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const cityData = {
        name: city.name,
        countryId: city.countryId,
      };

      mutate(cityData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al crear la ciudad"
            );
          } else {
            // Only redirect on success
            toast.success("Ciudad creada exitosamente");
            navigate("/cities");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear la ciudad. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [city, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setCity({ ...city, [field.name]: field.value });
  };

  // Show loading spinner while fetching initial data
  if (isLoadingCountries) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Ciudades"
        description="Completa todos los campos para crear una nueva ciudad"
        buttonText="Ver ciudades"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/cities"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <CityForm
          city={city}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
          countries={countries}
        />
      </div>

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al crear la ciudad</AlertDialogTitle>
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

export default CityCreateModule;
