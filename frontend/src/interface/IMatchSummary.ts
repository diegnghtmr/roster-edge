export interface IMatchSummary {
  id: number;
  date?: number[] | string;
  startTime?: number[] | string;
  endTime?: number[] | string;
  matchdayName?: string | null;
  eventName?: string | null;
  seasonName?: string | null;
  stadiumName?: string | null;
  venueName?: string | null;
  homeTeamId?: number | null;
  homeTeamName?: string | null;
  homeClubName?: string | null;
  awayTeamId?: number | null;
  awayTeamName?: string | null;
  awayClubName?: string | null;
}
