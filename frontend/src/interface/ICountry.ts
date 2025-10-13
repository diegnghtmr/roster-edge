export interface Country {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
}

export interface CountriesResponse {
  success: boolean;
  message: string | null;
  data: Country[];
  errorCode: string | null;
  timestamp: number;
}
