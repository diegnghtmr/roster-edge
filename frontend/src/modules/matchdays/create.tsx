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
import { MatchdayForm, type INewMatchday } from "./components/Form";

interface IField {
  name: string;
  value: string | number | boolean;
}

export const MatchdayCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [matchday, setMatchday] = useState<INewMatchday>({
    name: "",
    description: "",
    active: true,
  });

  const resource = ["matchdays"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const matchdayData = {
        name: matchday.name,
        description: matchday.description,
        active: matchday.active,
      };

      mutate(matchdayData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || "Error al crear la jornada");
          } else {
            toast.success("Jornada creada exitosamente");
            navigate("/matchdays");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al crear la jornada. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [matchday, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setMatchday({ ...matchday, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Jornadas"
        description="Completa todos los campos para crear una nueva jornada"
        buttonText="Ver jornadas"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/matchdays"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <MatchdayForm
          matchday={matchday}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default MatchdayCreateModule;
