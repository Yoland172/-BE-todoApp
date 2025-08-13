import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { AccessLevel } from 'src/entities/utils/types';

export class UserRoleDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsEnum(AccessLevel)
  role: AccessLevel;
}
