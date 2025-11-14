export interface IEvent {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  seasonId: number;
  venueId: number;
  name: string;
  description: string;
  date: number[];
  seasonName: string | null;
  venueName: string | null;
}

export type EventFormData = Omit<
  IEvent,
  'id' | 'createdAt' | 'updatedAt' | 'seasonName' | 'venueName'
>;
