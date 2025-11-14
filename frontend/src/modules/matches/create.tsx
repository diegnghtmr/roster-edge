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
import { MatchForm, type INewMatch } from './components/Form';

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const MatchCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [match, setMatch] = useState<INewMatch>({
    matchdayId: 0,
    startTime: [0, 0],
    endTime: [0, 0],
    date: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
    stadiumId: 0,
    eventId: 0,
    homeTeamId: null,
    awayTeamId: null,
    active: true,
  });

  const resource = ['matches'];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      if (
        match.homeTeamId === null ||
        match.awayTeamId === null ||
        match.homeTeamId === undefined ||
        match.awayTeamId === undefined
      ) {
        toast.error('Debes seleccionar los equipos local y visitante');
        setIsLoading(false);
        return;
      }

      if (match.homeTeamId === match.awayTeamId) {
        toast.error('Los equipos deben ser diferentes');
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations (no transformation needed)
      const matchData = {
        matchdayId: match.matchdayId,
        startTime: match.startTime,
        endTime: match.endTime,
        date: match.date,
        stadiumId: match.stadiumId,
        eventId: match.eventId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        active: match.active,
      };

      mutate(matchData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al crear el partido');
          } else {
            toast.success('Partido creado exitosamente');
            navigate('/matches');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al crear el partido. Por favor, intenta nuevamente.'
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [match, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setMatch({ ...match, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Partidos"
        description="Completa todos los campos para crear un nuevo partido"
        buttonText="Ver partidos"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/matches"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <MatchForm
          match={match}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default MatchCreateModule;
