export interface Streak {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  teamId: number;
  startDate: [number, number, number];
  endDate: [number, number, number] | null;
}

export interface StreaksResponse {
  success: boolean;
  message: string;
  code: null;
  data: Streak[];
  timestamp: number;
}
