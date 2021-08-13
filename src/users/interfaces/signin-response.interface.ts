export interface SigningResponse {
  accessToken: string;
  userData: {
    id: string;
    username: string;
  };
}
