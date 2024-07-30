import { UserRole } from 'src/user/entities/user.entity';

export class TokensPair {
  access_token: string;
  refresh_token: string;

  constructor(partial?: Partial<TokensPair>) {
    Object.assign(this, partial);
  }
}

/**
 * Logged in `User` payload
 *
 * This payload is stored in `access_token` and `refresh_token`
 */
export class TokenPayload {
  sub: string;
  role: UserRole;
  email: string;

  constructor(partial: Partial<TokenPayload>) {
    Object.assign(this, partial);
  }
}
