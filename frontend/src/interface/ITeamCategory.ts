export interface TeamCategory {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
}

export interface TeamCategoriesResponse {
  success: boolean;
  message: string | null;
  data: TeamCategory[];
  errorCode: string | null;
  timestamp: number;
}
