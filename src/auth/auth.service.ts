import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './utils/types';
import { Roles } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generateTokens(id: number, email: string, role: Roles) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id, email, role },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: id, email, role },
      {
        secret: this.config.get<string>('ACCESS_REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(payload: TokenPayload) {
    return await this.generateTokens(payload.sub, payload.email, payload.role);
  }
}
