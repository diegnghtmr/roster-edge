import useGetList from "@/api/services/getServices/useGetList";
import { useMutateService } from "@/api/services/useMutation";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { Spinner } from "@/components/ui/spinner";
import type { Club } from "@/interface/IClub";
import type { TeamCategory } from "@/interface/ITeamCategory";
import { BookmarkCheck } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TeamForm, type INewTeam } from "./components/Form";

interface IField {
  name: string;
  value: string | number;
}

export const TeamCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
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
            toast.error(response.error.message || "Error al crear el teams");
          } else {
            toast.success("Teams creado exitosamente");
            navigate("/teams");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al crear el teams. Por favor, intenta nuevamente.",
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

      
    </div>
  );
};

export default TeamCreateModule;
