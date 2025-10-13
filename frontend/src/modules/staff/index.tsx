import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { StaffList } from "./components/List";
export const StaffModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Personal"
        description="Gestiona el personal de tu organización"
        buttonText="Nuevo Personal"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/staff-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <StaffList />
      </div>
    </div>
  );
};
