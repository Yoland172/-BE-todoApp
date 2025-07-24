import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';

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
  async getUserInfo() {
    console.log('work');
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return await this.userService.login(body);
  }
}
