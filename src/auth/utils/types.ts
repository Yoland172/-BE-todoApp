import { Roles } from 'src/entities/user.entity';

export interface TokenPayload {
  sub: number;
  email: string;
  role: Roles;
  iat: number;
  exp: number;
}
