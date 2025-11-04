export interface User {
  id: number;
  createdAt:
    | string
    | [number, number, number, number, number, number, number];
  updatedAt:
    | string
    | [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  cityId: number | null;
  cityName?: string | null;
}

export interface UsersResponse {
  success: boolean;
  message: string | null;
  code?: string | null;
  data: User[];
  errorCode: string | null;
  timestamp: number;
}
