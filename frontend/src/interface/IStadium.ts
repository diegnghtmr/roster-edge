export interface IStadium {
  id: number;
  createdAt: number[];
  updatedAt: number[];
  active: boolean;
  area: number;
  surface: string;
  totalCapacity: number;
  foundation: number[];
  venueId: number;
}

export type StadiumFormData = Omit<IStadium, 'id' | 'createdAt' | 'updatedAt'>;
