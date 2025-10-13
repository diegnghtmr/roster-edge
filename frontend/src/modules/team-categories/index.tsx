
import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { TeamCategoriesList } from "./components/List";

export const TeamCategoriesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Categorías de Equipos"
        description="Gestiona las categorías para los equipos de tu organización"
        buttonText="Nueva Categoría"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/team-categories-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamCategoriesList />
      </div>
    </div>
  );
};

export default TeamCategoriesModule;