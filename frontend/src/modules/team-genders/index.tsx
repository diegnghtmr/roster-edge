import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus, Users } from "lucide-react";
import { TeamGendersList } from "./components/List";

export const TeamGendersModule = () => {
  return (
    <div className="w-full">
      <div className="mb-4"></div>
      <InternalHeader
        title="Géneros de Equipos"
        description="Gestiona los géneros para los equipos de tu organización"
        buttons={[
          {
            text: "Equipos",
            icon: <Users className="h-4 w-4" />,
            link: "/teams",
            variant: "outline",
          },
          {
            text: "Nuevo Género",
            icon: <Plus className="h-4 w-4" />,
            link: "/team-genders-create",
            variant: "default",
          },
        ]}
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <TeamGendersList />
      </div>
    </div>
  );
};

export default TeamGendersModule;
