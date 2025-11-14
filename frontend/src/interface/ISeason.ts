export interface ISeason {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  clubId: number;
  name: string;
  startDate: number[];
  endDate: number[];
}

export type SeasonFormData = Omit<ISeason, 'id' | 'createdAt' | 'updatedAt'>;
