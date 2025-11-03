export interface Currency {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
  symbol: string;
}

export interface CurrenciesResponse {
  success: boolean;
  message: string | null;
  data: Currency[];
  errorCode: string | null;
  timestamp: number;
}
