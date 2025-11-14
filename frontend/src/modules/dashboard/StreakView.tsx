import React from 'react';
import useGetList from '@/api/services/getServices/useGetList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingDown } from 'lucide-react';
import type { Streak } from '@/interface/IStreak';
import type { Team } from '@/interface/ITeam';

interface StreakWithTeam extends Streak {
  teamName: string;
  streakDays: number;
  isActive: boolean;
}

export const StreakView: React.FC = () => {
  // Fetch streaks data
  const { data: streaksData, isLoading: isLoadingStreaks } = useGetList<Streak[]>({
    key: 'streaksList',
    resource: ['streaks'],
    keyResults: 'data',
    enabled: true,
  });

  // Fetch teams data
  const { data: teamsData, isLoading: isLoadingTeams } = useGetList<Team[]>({
    key: 'teamsList',
    resource: ['teams'],
    keyResults: 'data',
    enabled: true,
  });

  // Helper function to calculate days between two dates
  const calculateStreakDays = (
    startDate: [number, number, number],
    endDate: [number, number, number] | null
  ): number => {
    const start = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    const end = endDate ? new Date(endDate[0], endDate[1] - 1, endDate[2]) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Combine streaks with team data
  const streaksWithTeams: StreakWithTeam[] = React.useMemo(() => {
    if (!streaksData || !teamsData) return [];

    const streaks = Array.isArray(streaksData) ? streaksData : [];
    const teams = Array.isArray(teamsData) ? teamsData : [];

    return streaks.map((streak) => {
      const team = teams.find((t) => t.id === streak.teamId);
      return {
        ...streak,
        teamName: team?.name || `Equipo ${streak.teamId}`,
        streakDays: calculateStreakDays(streak.startDate, streak.endDate),
        isActive: streak.endDate === null,
      };
    });
  }, [streaksData, teamsData]);

  const isLoading = isLoadingStreaks || isLoadingTeams;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rachas de Equipos</CardTitle>
          <CardDescription>Días de racha de todos los equipos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rachas de Equipos</CardTitle>
        <CardDescription>Días de racha de todos los equipos</CardDescription>
      </CardHeader>
      <CardContent>
        {streaksWithTeams && streaksWithTeams.length > 0 ? (
          <div className="space-y-3">
            {streaksWithTeams.map((streak) => (
              <div
                key={streak.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all ${
                  streak.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      streak.isActive ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {streak.isActive ? (
                      <Flame className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base">{streak.teamName}</p>
                    <p className="text-sm text-muted-foreground">
                      {streak.isActive ? 'Racha activa en curso' : 'Racha terminada'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inicio:{' '}
                      {new Date(
                        streak.startDate[0],
                        streak.startDate[1] - 1,
                        streak.startDate[2]
                      ).toLocaleDateString()}
                      {!streak.isActive &&
                        streak.endDate &&
                        ` - Fin: ${new Date(
                          streak.endDate[0],
                          streak.endDate[1] - 1,
                          streak.endDate[2]
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={streak.isActive ? 'default' : 'destructive'}
                    className="text-lg px-3 py-1"
                  >
                    {streak.streakDays} {streak.streakDays === 1 ? 'día' : 'días'}
                  </Badge>
                  {streak.isActive && (
                    <span className="text-xs text-green-600 font-medium">⚡ Activa</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Flame className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-base text-muted-foreground font-medium">No hay rachas disponibles</p>
            <p className="text-sm text-muted-foreground mt-2">
              Las rachas se mostrarán cuando los equipos tengan datos registrados
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
