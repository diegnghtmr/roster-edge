import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffRoleForm, type INewStaffRole } from './components/Form';
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import { toast } from 'sonner';
import { BookmarkCheck } from 'lucide-react';
import { InternalHeader } from '@/components/layout/InternalHeader';

interface IField {
  name: string;
  value: string | number;
}

export const StaffRoleCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [staffRole, setStaffRole] = useState<INewStaffRole>({
    name: '',
  });

  const resource = ['staff-roles'];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that name is provided
      if (!staffRole.name.trim()) {
        toast.error('Por favor ingrese el nombre del rol');
        setIsLoading(false);
        return;
      }

      const staffRoleData = {
        name: staffRole.name.trim(),
      };

      mutate(staffRoleData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al crear el staff-roles');
          } else {
            toast.success('Staff-roles creado exitosamente');
            navigate('/staff-roles');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al crear el staff-roles. Por favor, intenta nuevamente.'
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
    </div>
  );
};

export default StaffRoleCreateModule;
