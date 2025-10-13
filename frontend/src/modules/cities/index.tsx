import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { CitiesList } from "./components/List";

export const CitiesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Ciudades"
        description="Gestiona las ciudades de tu organización"
        buttonText="Nueva Ciudad"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/cities-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <CitiesList />
      </div>
    </div>
  );
};

export default CitiesModule;
