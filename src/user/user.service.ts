import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User, { Roles } from 'src/entities/user.entity';
import { LoginUserDto } from './dto/LoginUser.dto';
import Credential, { Providers } from 'src/entities/credential.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private auth: AuthService,
    @InjectRepository(Credential)
    private credentialRepo: Repository<Credential>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const isUserExist = await this.userRepo.exists({
      where: {
        email: user.email,
      },
    });

    if (isUserExist) throw new BadRequestException('user already exist');

    const userData = this.userRepo.create({ ...user, role: Roles.USER });

    return await this.userRepo.save(userData);
  }

  async login(data: LoginUserDto) {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const credential = await this.credentialRepo.findOne({
      where: {
        user: { id: user.id },
        provider: Providers.LOCAL,
      },
      relations: ['user'],
      select: ['password', 'id'], // include only what you need
    });

    if (!credential) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, credential.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const generatedTokens = await this.auth.generateTokens(
      user.id,
      user.email,
      user.role,
    );
    return { user, ...generatedTokens };
  }

  async register(body: RegisterUserDto) {
    try {
      const user = await this.createUser({
        name: body.name,
        avatar: body.avatar,
        email: body.email,
      });

      const hashedPassword = await bcrypt.hash(body.password, 12);

      const userCredential = this.credentialRepo.create({
        password: hashedPassword,
        provider: Providers.LOCAL,
        user,
      });

      await this.credentialRepo.save(userCredential);

      const tokens = await this.auth.generateTokens(
        user.id,
        user.email,
        user.role,
      );

      return {
        id: user.id,
        email: user.email,
        ...tokens,
      };
    } catch {
      throw new InternalServerErrorException('something went wrong :(');
    }
  }
}
