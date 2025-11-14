import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import useGetList from '@/api/services/getServices/useGetList';
import { toast } from 'sonner';
import type { IMatchday } from '@/interface/IMatchday';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { BookmarkCheck } from 'lucide-react';
import { MatchdayForm, type INewMatchday } from './components/Form';

interface IField {
  name: string;
  value: string | number | boolean;
}

export const MatchdayUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const [matchday, setMatchday] = useState<INewMatchday>({
    name: '',
    description: '',
    active: true,
  });

  // Fetch the matchday data
  const { data: matchdayData, isLoading: loadingMatchday } = useGetList<IMatchday>({
    key: `matchday-${id}`,
    resource: [`matchdays/${id}`],
    keyResults: 'data',
    enabled: !!id,
  });

  // Populate form when matchday data is loaded
  useEffect(() => {
    if (matchdayData) {
      const fetchedMatchday = matchdayData as IMatchday;
      setMatchday({
        name: fetchedMatchday.name,
        description: fetchedMatchday.description,
        active: fetchedMatchday.active,
      });
    }
  }, [matchdayData]);

  const resource = [`matchdays/${id}`];
  const { mutate } = useMutateService(resource, '', 'PUT');

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Data already matches API expectations
      const matchdayData = {
        name: matchday.name,
        description: matchday.description,
        active: matchday.active,
      };

      mutate(matchdayData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al actualizar la jornada');
          } else {
            toast.success('Jornada actualizada exitosamente');
            navigate('/matchdays');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al actualizar la jornada. Por favor, intenta nuevamente.'
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [matchday, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setMatchday({ ...matchday, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingMatchday) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingMatchday && 'Obteniendo información de la jornada'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Jornadas"
        description="Actualizar los datos de la jornada"
        buttonText="Ver jornadas"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/matchdays"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <MatchdayForm
          matchday={matchday}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default MatchdayUpdateModule;
