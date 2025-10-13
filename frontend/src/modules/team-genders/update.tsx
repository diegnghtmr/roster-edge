import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamGenderForm, type INewTeamGender } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { TeamGender } from "@/interface/ITeamGender";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
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

export const TeamGenderUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gender, setGender] = useState<INewTeamGender>({
    name: "",
    active: true,
  });

  // Fetch the gender data
  const { data: genderData, isLoading: loadingGender } = useGetList({
    key: `team-gender-${id}`,
    resource: [`team-genders/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when gender data is loaded
  useEffect(() => {
    if (genderData) {
      const fetchedGender = genderData as TeamGender;
      
      setGender({
        name: fetchedGender.name,
        active: fetchedGender.active
      });
    }
  }, [genderData]);

  const resource = [`team-genders/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");
  
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

      // Data for update
      const genderData = {
        name: gender.name,
        active: gender.active
      };

      mutate(genderData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al actualizar el género"
            );
          } else {
            // Only redirect on success
            toast.success("Género actualizado exitosamente");
            navigate("/team-genders");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al actualizar el género. Por favor, intenta nuevamente."
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

  // Show loading state while fetching any required data
  if (loadingGender) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          <div className="mt-2">Cargando información del género...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Géneros de Equipos"
        description="Actualizar los datos del género"
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
          isEdit={true}
        />
      </div>

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al actualizar el género</AlertDialogTitle>
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

export default TeamGenderUpdateModule;