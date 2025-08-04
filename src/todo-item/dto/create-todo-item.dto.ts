import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority, Status } from 'src/entities/todoItem.entity';

export class CreateTodoItemDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  listId?: number;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
