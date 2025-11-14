import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import { toast } from 'sonner';
import { BookmarkCheck } from 'lucide-react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { StadiumForm, type INewStadium } from './components/Form';

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const StadiumCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [stadium, setStadium] = useState<INewStadium>({
    area: 0,
    surface: '',
    totalCapacity: 0,
    foundation: [new Date().getFullYear(), 1, 1],
    venueId: 0,
    active: true,
  });

  const resource = ['stadiums'];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const stadiumData = {
        area: stadium.area,
        surface: stadium.surface,
        totalCapacity: stadium.totalCapacity,
        foundation: stadium.foundation,
        venueId: stadium.venueId,
        active: stadium.active,
      };

      mutate(stadiumData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al crear el stadiums');
          } else {
            toast.success('Stadiums creado exitosamente');
            navigate('/stadiums');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al crear el stadiums. Por favor, intenta nuevamente.'
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [stadium, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setStadium({ ...stadium, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Estadios"
        description="Completa todos los campos para crear un nuevo estadio"
        buttonText="Ver estadios"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/stadiums"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <StadiumForm
          stadium={stadium}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default StadiumCreateModule;
