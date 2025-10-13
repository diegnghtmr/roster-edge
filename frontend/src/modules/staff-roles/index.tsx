import { InternalHeader } from "@/components/layout/InternalHeader";
import { Plus } from "lucide-react";
import { StaffRolesList } from "./components/List";
export const StaffRolesModule = () => {
  return (
    <div className="w-full">
      <InternalHeader
        title="Roles de Personal"
        description="Gestiona los roles del personal de tu organización"
        buttonText="Nuevo Rol"
        buttonIcon={<Plus className="h-4 w-4" />}
        buttonLink="/staff-roles-create"
      />
      <div className="bg-white w-full shadow-md rounded-lg min-h-screen">
        <StaffRolesList />
      </div>
    </div>
  );
};
