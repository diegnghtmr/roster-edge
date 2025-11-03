import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { ISeason } from "@/interface/ISeason";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import { SeasonForm, type INewSeason } from "./components/Form";

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const SeasonUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const [season, setSeason] = useState<INewSeason>({
    clubId: 0,
    name: "",
    startDate: [new Date().getFullYear(), 1, 1],
    endDate: [new Date().getFullYear(), 12, 31],
    active: true,
  });

  // Fetch the season data
  const { data: seasonData, isLoading: loadingSeason } = useGetList<ISeason>({
    key: `season-${id}`,
    resource: [`seasons/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when season data is loaded
  useEffect(() => {
    if (seasonData) {
      const fetchedSeason = seasonData as ISeason;
      setSeason({
        clubId: fetchedSeason.clubId,
        name: fetchedSeason.name,
        startDate: fetchedSeason.startDate,
        endDate: fetchedSeason.endDate,
        active: fetchedSeason.active,
      });
    }
  }, [seasonData]);

  const resource = [`seasons/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Transform data to match API expectations
      const formatDateArray = (dateArray: number[]): string => {
        const [year, month, day] = dateArray;
        const paddedMonth = month.toString().padStart(2, "0");
        const paddedDay = day.toString().padStart(2, "0");
        return `${year}-${paddedMonth}-${paddedDay}`;
      };

      const seasonData = {
        clubId: season.clubId,
        name: season.name,
        startDate: formatDateArray(season.startDate),
        endDate: formatDateArray(season.endDate),
        active: season.active,
      };

      mutate(seasonData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || "Error al actualizar la temporada");
          } else {
            toast.success("Temporada actualizada exitosamente");
            navigate("/seasons");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al actualizar la temporada. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [season, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setSeason({ ...season, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingSeason) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingSeason && "Obteniendo información de la temporada"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Temporadas"
        description="Actualizar los datos de la temporada"
        buttonText="Ver temporadas"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/seasons"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <SeasonForm
          season={season}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default SeasonUpdateModule;
