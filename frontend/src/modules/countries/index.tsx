import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { CountriesList } from "./components/List";

export const CountriesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Países"
        description="Gestiona los países de tu organización"
        buttonText="Nuevo País"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/countries-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <CountriesList />
      </div>
    </div>
  );
};

export default CountriesModule;
