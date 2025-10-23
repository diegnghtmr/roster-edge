import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StaffForm, type INewStaff } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { Staff } from "@/interface/IStaff";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import type { StaffRole } from "@/interface/IStaffRole";
import type { Team } from "@/interface/ITeam";
import type { City } from "@/interface/ICity";

interface IField {
  name: string;
  value: string | number;
}

export const StaffUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [staff, setStaff] = useState<INewStaff>({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    hireDate: "",
    cityId: 0,
    staffRoleId: 0,
    teamId: 0,
  });

  // Fetch the staff data
  const { data: staffData, isLoading: loadingStaff } = useGetList({
    key: `staff-${id}`,
    resource: [`staff/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Fetch cities
  const { data: cities = [], isLoading: isLoadingCities } = useGetList<City[]>({
    key: "cities",
    resource: ["cities"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch staff roles
  const { data: staffRoles = [], isLoading: isLoadingStaffRoles } = useGetList<
    StaffRole[]
  >({
    key: "staff-roles",
    resource: ["staff-roles"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch teams
  const { data: teams = [], isLoading: isLoadingTeams } = useGetList<Team[]>({
    key: "teams",
    resource: ["teams"],
    keyResults: "data",
    enabled: true,
  });

  // Populate form when staff data is loaded
  useEffect(() => {
    console.log("Fetched staff data:", staffData);
    if (staffData && staffData.id) {
      const fetchedStaff = staffData as Staff;

      // Convert birthDate array [year, month, day] to string "YYYY-MM-DD"
      const [birthYear, birthMonth, birthDay] = fetchedStaff.birthDate;
      const birthDateString = `${birthYear}-${birthMonth
        .toString()
        .padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`;

      // Convert hireDate array [year, month, day] to string "YYYY-MM-DD"
      const [hireYear, hireMonth, hireDay] = fetchedStaff.hireDate;
      const hireDateString = `${hireYear}-${hireMonth
        .toString()
        .padStart(2, "0")}-${hireDay.toString().padStart(2, "0")}`;

      setStaff({
        name: fetchedStaff.name,
        lastName: fetchedStaff.lastName,
        email: fetchedStaff.email,
        password: "", // Don't populate password for security
        phone: fetchedStaff.phone,
        birthDate: birthDateString,
        hireDate: hireDateString,
        cityId: fetchedStaff.cityId,
        staffRoleId: fetchedStaff.staffRoleId,
        teamId: fetchedStaff.teamId,
      });
    }
  }, [staffData]);

  const resource = [`staff/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that required IDs are selected
      if (!staff.cityId || !staff.staffRoleId || !staff.teamId) {
        toast.error("Por favor complete todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Prepare data for update (exclude password if empty)
      const staffData: any = {
        name: staff.name,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        birthDate: staff.birthDate,
        hireDate: staff.hireDate,
        cityId: staff.cityId,
        staffRoleId: staff.staffRoleId,
        teamId: staff.teamId,
      };

      // Only include password if it's provided
      if (staff.password.trim()) {
        staffData.password = staff.password;
      }

      mutate(staffData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            toast.error(response.error.message || "Error al actualizar el staff");
          } else {
            toast.success("Staff actualizado exitosamente");
            navigate("/staffs");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el staff. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [staff, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setStaff({ ...staff, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (
    loadingStaff ||
    isLoadingCities ||
    isLoadingStaffRoles ||
    isLoadingTeams
  ) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingStaff && "Obteniendo información del personal"}
            {isLoadingCities && "Cargando ciudades"}
            {isLoadingStaffRoles && "Cargando roles"}
            {isLoadingTeams && "Cargando equipos"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Personal"
        description="Actualizar los datos del personal"
        buttonText="Ver personal"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/staff"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <StaffForm
          staff={staff}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
          cities={cities}
          staffRoles={staffRoles}
          teams={teams}
          isUpdate={true}
        />
      </div>

      
    </div>
  );
};

export default StaffUpdateModule;
