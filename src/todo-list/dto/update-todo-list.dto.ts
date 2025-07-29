import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoListDto {
  @IsOptional()
  @IsString()
  title?: string;
}
