import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { TokenPayload } from 'src/auth/utils/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    const userData = await this.userService.register(body);

    return userData;
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: Request & { user: TokenPayload }) {
    return await this.userService.getUserInfoById(req.user.sub);
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return await this.userService.login(body);
  }
}
