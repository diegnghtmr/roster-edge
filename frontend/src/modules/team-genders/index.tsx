
import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { TeamGendersList } from "./components/List";

export const TeamGendersModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Géneros de Equipos"
        description="Gestiona los géneros para los equipos de tu organización"
        buttonText="Nuevo Género"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/team-genders-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamGendersList />
      </div>
    </div>
  );
};

export default TeamGendersModule;