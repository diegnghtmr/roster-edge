import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus, Users } from "lucide-react";
import { TeamCategoriesList } from "./components/List";

export const TeamCategoriesModule = () => {
  return (
    <div className="w-full">
      <div className="mb-4"></div>
      <InternalHeader
        title="Categorías de Equipos"
        description="Gestiona las categorías para los equipos de tu organización"
        buttons={[
          {
            text: "Equipos",
            icon: <Users className="h-4 w-4" />,
            link: "/teams",
            variant: "outline",
          },
          {
            text: "Nueva Categoría",
            icon: <Plus className="h-4 w-4" />,
            link: "/team-categories-create",
            variant: "default",
          },
        ]}
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamCategoriesList />
      </div>
    </div>
  );
};

export default TeamCategoriesModule;
