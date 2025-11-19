export interface TeamGender {
  id: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  active: boolean;
  name: string;
}

export interface TeamGendersResponse {
  success: boolean;
  message: string;
  code: string | null;
  data: TeamGender[];
  timestamp: number;
}
