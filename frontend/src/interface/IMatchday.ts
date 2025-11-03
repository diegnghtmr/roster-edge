export interface IMatchday {
  id: number;
  createdAt: number[];
  updatedAt: number[];
  active: boolean;
  name: string;
  description: string;
}

export type MatchdayFormData = Omit<
  IMatchday,
  "id" | "createdAt" | "updatedAt"
>;
