import { TeamsList } from "./components/List";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";

export const TeamsModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Equipos"
        description="Gestiona los equipos de tu organización"
        buttonText="Nuevo Equipo"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/teams-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamsList />
      </div>
    </div>
  );
};
