import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenPayload } from '../utils/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: TokenPayload }>();

    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('No access token.');

    let payload: TokenPayload;

    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.cfg.get<string>('ACCESS_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const isUserExist = await this.userRepo.exists({
      where: { id: payload.sub, email: payload.email, role: payload.role },
    });

    if (!isUserExist) throw new UnauthorizedException('Invalid token');

    if (new Date(payload.exp * 1000) < new Date())
      throw new UnauthorizedException('Token outdated.');

    req.user = payload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
