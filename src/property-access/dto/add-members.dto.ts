import { IsArray, ValidateNested } from 'class-validator';
import { UserRoleDto } from './user-role.dto';
import { Type } from 'class-transformer';

export class AddMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  users: UserRoleDto[];
}
