export interface Staff {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  email: string;
  passwordHash: string;
  name: string;
  lastName: string;
  cityId: number;
  phone: string;
  birthDate: [number, number, number];
  hireDate: [number, number, number];
  staffRoleId: number;
  teamId: number;
  // Relation fields (likely populated by backend)
  cityName?: string | null;
  staffRoleName?: string | null;
  teamName?: string | null;
}

export interface StaffResponse {
  success: boolean;
  message: string | null;
  data: Staff[];
  errorCode: string | null;
  timestamp: number;
}
