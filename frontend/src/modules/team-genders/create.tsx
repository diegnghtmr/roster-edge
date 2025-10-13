import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamGenderForm, type INewTeamGender } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IField {
  name: string;
  value: string | boolean;
}

export const TeamGenderCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al crear el género"
            );
          } else {
            // Only redirect on success
            toast.success("Género creado exitosamente");
            navigate("/team-genders");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear el género. Por favor, intenta nuevamente."
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

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al crear el género</AlertDialogTitle>
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

export default TeamGenderCreateModule;