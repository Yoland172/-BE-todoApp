import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenPayload } from '../utils/types';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<
        Request & { cookies: Record<string, string>; refreshPayload?: any }
      >();

    const token = req.cookies?.refresh_token ?? this.extractFromHeader(req);

    if (!token) throw new UnauthorizedException('No refresh token.');

    let payload: TokenPayload;
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.cfg.get<string>('ACCESS_REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const isUserExist = await this.userRepo.exists({
      where: { id: payload.sub, email: payload.email, role: payload.role },
    });

    console.log(isUserExist);

    if (!isUserExist) throw new UnauthorizedException('Invalid token');

    if (new Date(payload.exp * 1000) < new Date())
      throw new UnauthorizedException('Token outdated.');

    req.refreshPayload = payload;
    return true;
  }

  private extractFromHeader(req: Request): string | undefined {
    const h = req.headers['authorization'];
    if (!h) return undefined;
    const [scheme, token] = h.split(' ');
    return scheme?.toLowerCase() === 'refresh' ? token : undefined;
  }
}
