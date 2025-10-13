import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffRoleForm, type INewStaffRole } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
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

export const StaffRoleCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [staffRole, setStaffRole] = useState<INewStaffRole>({
    name: "",
  });

  const resource = ["staff-roles"];
  const { mutate } = useMutateService(resource);

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
              response.error.message || "Error al crear el rol de personal"
            );
          } else {
            // Only redirect on success
            toast.success("Rol de personal creado exitosamente");
            navigate("/staff-roles");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear el rol de personal. Por favor, intenta nuevamente."
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

  return (
    <div className="w-full">
      <InternalHeader
        title="Roles de Personal"
        description="Completa el campo para crear un nuevo rol de personal"
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
              Error al crear el rol de personal
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

export default StaffRoleCreateModule;
