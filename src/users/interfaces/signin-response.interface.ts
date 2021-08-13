import { User } from '../schemas/user.schema';

export interface SigningResponse {
  accessToken: string;
  userData: User;
}
