import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CountryForm, type INewCountry } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { Country } from "@/interface/ICountry";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";

interface IField {
  name: string;
  value: string | number;
}

export const CountryUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [country, setCountry] = useState<INewCountry>({
    name: "",
  });

  // Fetch the country data
  const { data: countryData, isLoading: loadingCountry } = useGetList({
    key: `country-${id}`,
    resource: [`countries/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when country data is loaded
  useEffect(() => {
    if (countryData) {
      const fetchedCountry = countryData as Country;
      setCountry({
        name: fetchedCountry.name,
      });
    }
  }, [countryData]);

  const resource = [`countries/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const countryData = {
        name: country.name,
      };

      mutate(countryData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            toast.error(response.error.message || "Error al actualizar el countries");
          } else {
            toast.success("Countries actualizado exitosamente");
            navigate("/countries");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el countries. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [country, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setCountry({ ...country, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingCountry) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingCountry && "Obteniendo información del país"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Países"
        description="Actualizar los datos del país"
        buttonText="Ver países"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/countries"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <CountryForm
          country={country}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      
    </div>
  );
};

export default CountryUpdateModule;
