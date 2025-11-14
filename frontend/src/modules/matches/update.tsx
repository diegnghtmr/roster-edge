import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import useGetList from '@/api/services/getServices/useGetList';
import { toast } from 'sonner';
import type { IMatch } from '@/interface/IMatch';
import type { IMatchTeam } from '@/interface/IMatchTeam';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { BookmarkCheck } from 'lucide-react';
import { MatchForm, type INewMatch } from './components/Form';

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const MatchUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  // Fetch the match data
  const { data: matchData, isLoading: loadingMatch } = useGetList<IMatch>({
    key: `match-${id}`,
    resource: [`matches/${id}`],
    keyResults: 'data',
    enabled: !!id,
  });

  // Populate form when match data is loaded
  useEffect(() => {
    if (matchData) {
      const fetchedMatch = matchData as IMatch;
      setMatch((prev) => ({
        ...prev,
        matchdayId: fetchedMatch.matchdayId,
        startTime: fetchedMatch.startTime,
        endTime: fetchedMatch.endTime,
        date: fetchedMatch.date,
        stadiumId: fetchedMatch.stadiumId,
        eventId: fetchedMatch.eventId,
        active: fetchedMatch.active,
      }));
    }
  }, [matchData]);

  const { data: homeTeamsData } = useGetList<IMatchTeam[]>({
    key: `match-home-team-${id}`,
    resource: ['match-home-teams'],
    keyResults: 'data',
    params: id ? { matchId: id } : undefined,
    enabled: Boolean(id),
  });

  const { data: awayTeamsData } = useGetList<IMatchTeam[]>({
    key: `match-away-team-${id}`,
    resource: ['match-away-teams'],
    keyResults: 'data',
    params: id ? { matchId: id } : undefined,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (homeTeamsData && Array.isArray(homeTeamsData) && homeTeamsData.length > 0) {
      const teamId = homeTeamsData[0].teamId;
      setMatch((prev) => ({
        ...prev,
        homeTeamId: prev.homeTeamId ?? teamId,
      }));
    }
  }, [homeTeamsData]);

  useEffect(() => {
    if (awayTeamsData && Array.isArray(awayTeamsData) && awayTeamsData.length > 0) {
      const teamId = awayTeamsData[0].teamId;
      setMatch((prev) => ({
        ...prev,
        awayTeamId: prev.awayTeamId ?? teamId,
      }));
    }
  }, [awayTeamsData]);

  const resource = [`matches/${id}`];
  const { mutate } = useMutateService(resource, '', 'PUT');

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
            toast.error(errorMessage || 'Error al actualizar el partido');
          } else {
            toast.success('Partido actualizado exitosamente');
            navigate('/matches');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al actualizar el partido. Por favor, intenta nuevamente.'
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

  // Show loading state while fetching any required data
  if (loadingMatch) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingMatch && 'Obteniendo información del partido'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Partidos"
        description="Actualizar los datos del partido"
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

export default MatchUpdateModule;
