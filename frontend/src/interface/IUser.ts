export interface User {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
  email: string;
  cityId: number;
  cityName?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string | null;
  data: User[];
  errorCode: string | null;
  timestamp: number;
}
