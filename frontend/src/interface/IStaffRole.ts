export interface StaffRole {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
}

export interface StaffRolesResponse {
  success: boolean;
  message: string | null;
  data: StaffRole[];
  errorCode: string | null;
  timestamp: number;
}
