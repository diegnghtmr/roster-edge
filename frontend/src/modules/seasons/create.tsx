import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { SeasonForm, type INewSeason } from "./components/Form";

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const SeasonCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [season, setSeason] = useState<INewSeason>({
    clubId: 0,
    name: "",
    startDate: [new Date().getFullYear(), 1, 1],
    endDate: [new Date().getFullYear(), 12, 31],
    active: true,
  });

  const resource = ["seasons"];
  const { mutate } = useMutateService(resource);

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
            toast.error(errorMessage || "Error al crear la temporada");
          } else {
            toast.success("Temporada creada exitosamente");
            navigate("/seasons");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al crear la temporada. Por favor, intenta nuevamente."
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

  return (
    <div className="w-full">
      <InternalHeader
        title="Temporadas"
        description="Completa todos los campos para crear una nueva temporada"
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

export default SeasonCreateModule;
