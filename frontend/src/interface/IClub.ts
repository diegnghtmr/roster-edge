export interface Club {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  motto: string;
  foundation: [number, number, number];
}

export interface ClubsResponse {
  success: boolean;
  message: string;
  code: string | null;
  data: Club[];
  timestamp: number;
}
