import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { City } from "@/interface/ICity";
import type { Country } from "@/interface/ICountry";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";

import { CityForm, type INewCity } from "./components/Form";

interface IField {
  name: string;
  value: string | number;
}

export const CityUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const [city, setCity] = useState<INewCity>({
    name: "",
    countryId: 0,
  });

  // Fetch the city data
  const { data: cityData, isLoading: loadingCity } = useGetList({
    key: `city-${id}`,
    resource: [`cities/${id}`],
    keyResults: "data",
    enabled: !!id,
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

  // Populate form when city data is loaded
  useEffect(() => {
    if (cityData) {
      const fetchedCity = cityData as City;
      setCity({
        name: fetchedCity.name,
        countryId: fetchedCity.countryId,
      });
    }
  }, [cityData]);

  const resource = [`cities/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

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
            toast.error(
              response.error.message || "Error al actualizar la ciudad",
            );
          } else {
            toast.success("Ciudad actualizada exitosamente");
            navigate("/cities");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar la ciudad. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [city, mutate, navigate],
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setCity({ ...city, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingCity || isLoadingCountries) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingCity && "Obteniendo información de la ciudad"}
            {isLoadingCountries && "Cargando países"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Ciudades"
        description="Actualizar los datos de la ciudad"
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
    </div>
  );
};

export default CityUpdateModule;
