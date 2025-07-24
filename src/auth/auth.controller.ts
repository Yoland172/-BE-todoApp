import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshGuard } from './guards/refresh.guard';
import { TokenPayload } from './utils/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req) {
    return await this.authService.refreshToken(
      req.refreshPayload as TokenPayload,
    );
  }
}
