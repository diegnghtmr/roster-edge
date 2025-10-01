export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
  errorCode: string | null;
  timestamp: number;
}

export interface ILoginUser {
  id: number;
  email: string;
  name: string;
  clubId: string;
  subscriptionId: string;
}
