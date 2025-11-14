export interface IMatch {
  id: number;
  createdAt: number[];
  updatedAt: number[];
  active: boolean;
  matchdayId: number;
  startTime: number[];
  endTime: number[];
  date: number[];
  stadiumId: number;
  eventId: number;
}

export type MatchFormData = Omit<IMatch, 'id' | 'createdAt' | 'updatedAt'>;
