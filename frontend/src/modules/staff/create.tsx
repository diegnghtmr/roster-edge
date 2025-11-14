import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffForm, type INewStaff } from './components/Form';
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import useGetList from '@/api/services/getServices/useGetList';
import { toast } from 'sonner';
import { BookmarkCheck } from 'lucide-react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import type { StaffRole } from '@/interface/IStaffRole';
import type { Team } from '@/interface/ITeam';
import type { City } from '@/interface/ICity';
import { Spinner } from '@/components/ui/spinner';

interface IField {
  name: string;
  value: string | number;
}

export const StaffCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [staff, setStaff] = useState<INewStaff>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    hireDate: '',
    cityId: 0,
    staffRoleId: 0,
    teamId: 0,
  });

  const resource = ['staff'];
  const { mutate } = useMutateService(resource);

  // Fetch cities
  const { data: cities = [], isLoading: isLoadingCities } = useGetList<City[]>({
    key: 'cities',
    resource: ['cities'],
    keyResults: 'data',
    enabled: true,
  });

  // Fetch staff roles
  const { data: staffRoles = [], isLoading: isLoadingStaffRoles } = useGetList<StaffRole[]>({
    key: 'staff-roles',
    resource: ['staff-roles'],
    keyResults: 'data',
    enabled: true,
  });

  // Fetch teams
  const { data: teams = [], isLoading: isLoadingTeams } = useGetList<Team[]>({
    key: 'teams',
    resource: ['teams'],
    keyResults: 'data',
    enabled: true,
  });

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that required IDs are selected
      if (!staff.cityId || !staff.staffRoleId || !staff.teamId) {
        toast.error('Por favor complete todos los campos requeridos');
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const staffData = {
        name: staff.name,
        lastName: staff.lastName,
        email: staff.email,
        password: staff.password,
        phone: staff.phone,
        birthDate: staff.birthDate,
        hireDate: staff.hireDate,
        cityId: staff.cityId,
        staffRoleId: staff.staffRoleId,
        teamId: staff.teamId,
      };

      mutate(staffData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al crear el staff');
          } else {
            toast.success('Staff creado exitosamente');
            navigate('/staff');
          }
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'Error al crear el staff. Por favor, intenta nuevamente.');
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

  // Show loading spinner while fetching initial data
  if (isLoadingCities || isLoadingStaffRoles || isLoadingTeams) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Personal"
        description="Completa todos los campos para crear un nuevo miembro del personal"
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
        />
      </div>
    </div>
  );
};

export default StaffCreateModule;
