import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { CurrenciesList } from "./components/List";

export const CurrenciesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Monedas"
        description="Gestiona las monedas de tu organización"
        buttonText="Nueva Moneda"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/currencies-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <CurrenciesList />
      </div>
    </div>
  );
};

export default CurrenciesModule;
