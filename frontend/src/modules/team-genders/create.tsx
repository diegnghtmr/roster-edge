import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TeamGenderForm, type INewTeamGender } from "./components/Form";

interface IField {
  name: string;
  value: string | boolean;
}

export const TeamGenderCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [gender, setGender] = useState<INewTeamGender>({
    name: "",
  });

  const resource = ["team-genders"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate required fields
      if (!gender.name) {
        toast.error("Por favor complete todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const genderData = {
        name: gender.name,
      };

      mutate(genderData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(
              errorMessage || "Error al crear el team-genders",
            );
          } else {
            toast.success("Team-genders creado exitosamente");
            navigate("/team-genders");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al crear el team-genders. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [gender, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setGender({ ...gender, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Géneros de Equipos"
        description="Completa todos los campos para crear un nuevo género"
        buttonText="Ver géneros"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/team-genders"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <TeamGenderForm
          gender={gender}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      
    </div>
  );
};

export default TeamGenderCreateModule;
