import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  password: string;
}
