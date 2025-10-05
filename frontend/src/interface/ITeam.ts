export interface Team {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  genderId: number;
  categoryId: number;
  mascot: string;
  foundation: [number, number, number];
  clubId: number;
  genderName: string | null;
  categoryName: string | null;
  clubName: string | null;
}

export interface TeamsResponse {
  success: boolean;
  message: string;
  code: null;
  data: Team[];
  timestamp: number;
}
