export interface IRoster {
  id: number;
  name: string;
  email: string;
  passwordHash?: string;
  clubId?: number;
  subscriptionId?: number;
  creationDate?: string;
  lastAccess?: string;
}

export interface IRosterSessionResponse {
  id: number;
  name: string;
  email: string;
  clubId: number;
  subscriptionId: number;
}

export interface IRosterUpdateRequest {
  name: string;
  email: string; // Required by API but read-only in UI
  passwordHash?: string; // Not sent from frontend
  clubId?: number;
  subscriptionId?: number;
  creationDate?: string;
  lastAccess?: string;
}
