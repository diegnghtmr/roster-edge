import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamForm, type INewTeam } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import type { TeamCategory } from "@/interface/ITeamCategory";
import type { Club } from "@/interface/IClub";
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
  value: string | number;
}

export const TeamCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [team, setTeam] = useState<INewTeam>({
    name: "",
    mascot: "",
    foundation: "",
    genderId: 0,
    categoryId: 0,
    clubId: 0,
  });

  const resource = ["teams"];
  const { mutate } = useMutateService(resource);

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useGetList<
    TeamCategory[]
  >({
    key: "team-categories",
    resource: ["team-categories"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch clubs
  const { data: clubs = [], isLoading: isLoadingClubs } = useGetList<Club[]>({
    key: "clubs",
    resource: ["clubs"],
    keyResults: "data",
    enabled: true,
  });

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that required IDs are selected
      if (!team.genderId || !team.categoryId || !team.clubId) {
        toast.error("Por favor complete todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const teamData = {
        name: team.name,
        mascot: team.mascot,
        foundation: team.foundation,
        genderId: team.genderId,
        categoryId: team.categoryId,
        clubId: team.clubId,
      };

      mutate(teamData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al crear el equipo"
            );
          } else {
            // Only redirect on success
            toast.success("Equipo creado exitosamente");
            navigate("/teams");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear el equipo. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [team, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setTeam({ ...team, [field.name]: field.value });
  };

  // Show loading spinner while fetching initial data
  if (isLoadingCategories || isLoadingClubs) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  // console.log({ categories, clubs });
  return (
    <div className="w-full">
      <InternalHeader
        title="Equipos"
        description="Completa todos los campos para crear un nuevo equipo"
        buttonText="Ver equipos"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/teams"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <TeamForm
          team={team}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
          categories={categories}
          clubs={clubs}
        />
      </div>

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al crear el equipo</AlertDialogTitle>
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

export default TeamCreateModule;
