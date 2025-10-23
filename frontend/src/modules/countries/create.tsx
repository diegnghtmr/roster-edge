import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CountryForm, type INewCountry } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";

interface IField {
  name: string;
  value: string | number;
}

export const CountryCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [country, setCountry] = useState<INewCountry>({
    name: "",
  });

  const resource = ["countries"];
  const { mutate } = useMutateService(resource);

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
            toast.error(response.error.message || "Error al crear el countries");
          } else {
            toast.success("Countries creado exitosamente");
            navigate("/countries");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al crear el countries. Por favor, intenta nuevamente.",
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

  return (
    <div className="w-full">
      <InternalHeader
        title="Países"
        description="Completa todos los campos para crear un nuevo país"
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

export default CountryCreateModule;
