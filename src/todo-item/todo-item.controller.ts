import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { TodoItemService } from './todo-item.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WithAuthRequest } from 'src/lib/types/requests';

@Controller('todo-item')
@UseGuards(JwtAuthGuard)
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @Post()
  create(
    @Body() createTodoItemDto: CreateTodoItemDto,
    @Req() req: WithAuthRequest,
  ) {
    return this.todoItemService.create(req.user.sub, createTodoItemDto);
  }

  @Get()
  findAll(@Req() req: WithAuthRequest) {
    return this.todoItemService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: WithAuthRequest) {
    return this.todoItemService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
    @Req() req: WithAuthRequest,
  ) {
    return this.todoItemService.update(+id, updateTodoItemDto, req.user.sub);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: WithAuthRequest) {
    return this.todoItemService.remove(+id, req.user.sub);
  }
}
