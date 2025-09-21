export interface ILoginResponse {
  error?: {
    message: string;
    code: string;
    errors: [];
  };
  token: string;
  token_type: string;
}

export interface ILoginUser {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName: string;
  phone: string | undefined;
  cityId: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}
