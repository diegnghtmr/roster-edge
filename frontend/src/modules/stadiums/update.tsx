import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { IStadium } from "@/interface/IStadium";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import { StadiumForm, type INewStadium } from "./components/Form";

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const StadiumUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [stadium, setStadium] = useState<INewStadium>({
    area: 0,
    surface: "",
    totalCapacity: 0,
    foundation: [new Date().getFullYear(), 1, 1],
    venueId: 0,
    active: true,
  });

  // Fetch the stadium data
  const { data: stadiumData, isLoading: loadingStadium } = useGetList({
    key: `stadium-${id}`,
    resource: [`stadiums/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when stadium data is loaded
  useEffect(() => {
    if (stadiumData) {
      const fetchedStadium = stadiumData as IStadium;
      setStadium({
        area: fetchedStadium.area,
        surface: fetchedStadium.surface,
        totalCapacity: fetchedStadium.totalCapacity,
        foundation: fetchedStadium.foundation,
        venueId: fetchedStadium.venueId,
        active: fetchedStadium.active,
      });
    }
  }, [stadiumData]);

  const resource = [`stadiums/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const stadiumData = {
        area: stadium.area,
        surface: stadium.surface,
        totalCapacity: stadium.totalCapacity,
        foundation: stadium.foundation,
        venueId: stadium.venueId,
        active: stadium.active,
      };

      mutate(stadiumData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            toast.error(response.error.message || "Error al actualizar el stadiums");
          } else {
            toast.success("Stadiums actualizado exitosamente");
            navigate("/stadiums");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el stadiums. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [stadium, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setStadium({ ...stadium, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingStadium) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingStadium && "Obteniendo información del estadio"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Estadios"
        description="Actualizar los datos del estadio"
        buttonText="Ver estadios"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/stadiums"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <StadiumForm
          stadium={stadium}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      
    </div>
  );
};

export default StadiumUpdateModule;
