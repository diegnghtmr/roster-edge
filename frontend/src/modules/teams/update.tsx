import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamForm, type INewTeam } from "./components/Form";
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { Team } from "@/interface/ITeam";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import type { TeamCategory } from "@/interface/ITeamCategory";
import type { Club } from "@/interface/IClub";

interface IField {
  name: string;
  value: string | number;
}

export const TeamUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [team, setTeam] = useState<INewTeam>({
    name: "",
    mascot: "",
    foundation: "",
    genderId: 0,
    categoryId: 0,
    clubId: 0,
  });

  // Fetch the team data
  const { data: teamData, isLoading: loadingTeam } = useGetList({
    key: `team-${id}`,
    resource: [`teams/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

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

  // Populate form when team data is loaded
  useEffect(() => {
    console.log("Fetched team data:", teamData);
    if (teamData && teamData.id) {
      const fetchedTeam = teamData as Team;

      // Convert foundation array [year, month, day] to string "YYYY-MM-DD"
      const [year, month, day] = fetchedTeam.foundation;
      const foundationString = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      setTeam({
        name: fetchedTeam.name,
        mascot: fetchedTeam.mascot,
        foundation: foundationString,
        genderId: fetchedTeam.genderId,
        categoryId: fetchedTeam.categoryId,
        clubId: fetchedTeam.clubId,
      });
    }
  }, [teamData]);

  const resource = [`teams/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");
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
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(
              errorMessage || "Error al actualizar el teams",
            );
          } else {
            toast.success("Teams actualizado exitosamente");
            navigate("/teamss");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al actualizar el teams. Por favor, intenta nuevamente.",
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

  // Show loading state while fetching any required data
  if (loadingTeam || isLoadingCategories || isLoadingClubs) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingTeam && "Obteniendo información del equipo"}
            {isLoadingCategories && "Cargando categorías"}
            {isLoadingClubs && "Cargando clubes"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Equipos"
        description="Actualizar los datos del equipo"
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

export default TeamUpdateModule;
