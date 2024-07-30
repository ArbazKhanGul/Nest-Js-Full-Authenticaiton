import { UserRole } from '../entities/user.entity';

export interface ResponseUSer {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface LoginResponse {
  user: ResponseUSer;
  access_token: string;
}
