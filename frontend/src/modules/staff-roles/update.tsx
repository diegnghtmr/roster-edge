import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StaffRoleForm, type INewStaffRole } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { StaffRole } from "@/interface/IStaffRole";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IField {
  name: string;
  value: string | number;
}

export const StaffRoleUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [staffRole, setStaffRole] = useState<INewStaffRole>({
    name: "",
  });

  // Fetch the staff role data
  const { data: staffRoleData, isLoading: loadingStaffRole } = useGetList({
    key: `staff-role-${id}`,
    resource: [`staff-roles/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when staff role data is loaded
  useEffect(() => {
    console.log("Fetched staff role data:", staffRoleData);
    if (staffRoleData && staffRoleData.id) {
      const fetchedStaffRole = staffRoleData as StaffRole;

      setStaffRole({
        name: fetchedStaffRole.name,
      });
    }
  }, [staffRoleData]);

  const resource = [`staff-roles/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that name is provided
      if (!staffRole.name.trim()) {
        toast.error("Por favor ingrese el nombre del rol");
        setIsLoading(false);
        return;
      }

      const staffRoleData = {
        name: staffRole.name.trim(),
      };

      mutate(staffRoleData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(
              response.error.message || "Error al actualizar el rol de personal"
            );
          } else {
            // Only redirect on success
            toast.success("Rol de personal actualizado exitosamente");
            navigate("/staff-roles");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al actualizar el rol de personal. Por favor, intenta nuevamente."
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [staffRole, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setStaffRole({ ...staffRole, [field.name]: field.value });
  };

  // Show loading state while fetching required data
  if (loadingStaffRole) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            Obteniendo información del rol de personal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Roles de Personal"
        description="Actualizar los datos del rol de personal"
        buttonText="Ver roles"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/staff-roles"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <StaffRoleForm
          staffRole={staffRole}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Error al actualizar el rol de personal
            </AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffRoleUpdateModule;
