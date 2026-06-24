export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message: string;
}