export interface City {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
  countryId: number;
  countryName?: string;
}

export interface CitiesResponse {
  success: boolean;
  message: string | null;
  data: City[];
  errorCode: string | null;
  timestamp: number;
}
