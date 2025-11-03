export interface TeamGender {
  id: number;
  createdAt: string;
  updatedAt: string;
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
