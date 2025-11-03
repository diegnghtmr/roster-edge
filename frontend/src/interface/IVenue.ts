export interface IVenue {
  id?: number;
  name?: string;
  email?: string;
  cityId?: number;
  foundation?: string;
  phone?: string;
  clubId?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVenueRequest {
  name: string;
  email: string;
  cityId: number;
  foundation: string;
  phone: string;
  clubId: number;
  active: boolean;
}

export interface IVenueResponse {
  id: number;
  name: string;
  email: string;
  cityId: number;
  foundation: string;
  phone: string;
  clubId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
