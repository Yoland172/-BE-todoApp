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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WithAuthRequest } from 'src/lib/types/requests';

@Controller('todo-list')
@UseGuards(JwtAuthGuard)
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Post('create')
  async create(
    @Body() createTodoListDto: CreateTodoListDto,
    @Req() req: WithAuthRequest,
  ) {
    return await this.todoListService.create(req.user.sub, createTodoListDto);
  }

  @Get()
  async findAll(@Req() req: WithAuthRequest) {
    return await this.todoListService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: WithAuthRequest) {
    return this.todoListService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
    @Req() req: WithAuthRequest,
  ) {
    return this.todoListService.update(+id, req.user.sub, updateTodoListDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Req() req: WithAuthRequest) {
    await this.todoListService.remove(+id, req.user.sub);

    return {
      message: 'deleted successfully',
    };
  }
}
