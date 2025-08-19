import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from 'src/entities/todoItem.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserTodoItemAccess } from 'src/entities/userTodoItemAccess.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private todoItemRepo: Repository<TodoItem>,
    @InjectRepository(UserTodoItemAccess)
    private accessRepo: Repository<UserTodoItemAccess>,
  ) {}

  async create(userId: number, createTodoItemDto: CreateTodoItemDto) {
    const todoItem = await this.todoItemRepo.create({
      createdBy: { id: userId },
      description: createTodoItemDto.description,
      status: createTodoItemDto.status,
      priority: createTodoItemDto.priority,
      title: createTodoItemDto.title,
      due_date: createTodoItemDto.due_date,
      listItem: { id: createTodoItemDto.listId },
    });

    await this.todoItemRepo.save(todoItem);

    return todoItem;
  }

  async findAll(userId: number, includeShared: boolean = true) {
    const baseQuery = {
      order: { id: 'DESC' as const },
      relations: {
        createdBy: true,
      },
    };

    const whereConditions:
      | FindOptionsWhere<TodoItem>
      | FindOptionsWhere<TodoItem>[] = includeShared
      ? [
          { createdBy: { id: userId } },
          { accessList: { user: { id: userId } } },
        ]
      : { createdBy: { id: userId } };

    return this.todoItemRepo.find({
      ...baseQuery,
      where: whereConditions,
    });
  }

  async findOne(userId: number, todoId: number, includeShared = true) {
    const baseQuery = {
      relations: {
        createdBy: true,
      },
    } as const;

    const whereConditions:
      | FindOptionsWhere<TodoItem>
      | FindOptionsWhere<TodoItem>[] = includeShared
      ? [
          { id: todoId, createdBy: { id: userId } },
          { id: todoId, accessList: { user: { id: userId } } },
        ]
      : { id: todoId, createdBy: { id: userId } };

    const todo = await this.todoItemRepo.findOne({
      ...baseQuery,
      where: whereConditions,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(
    id: number,
    updateTodoItemDto: UpdateTodoItemDto,
    userId: number,
  ) {
    const { listId, ...rest } = updateTodoItemDto;
    const payload: QueryDeepPartialEntity<TodoItem> = { ...rest };
    if (listId !== undefined) {
      payload.listItem = listId ? { id: listId } : null;
    }
    const updatedItem = await this.todoItemRepo.update(
      { id, createdBy: { id: userId } },
      payload,
    );

    if (!updatedItem.affected)
      throw new NotFoundException('Not found item or user don`t have access');
  }

  async remove(id: number, userId: number) {
    const todoList = await this.todoItemRepo.findOne({
      where: {
        id,
        createdBy: { id: userId },
      },
    });
    if (!todoList) {
      throw new NotFoundException(
        'the list with this ID does not exist for this user',
      );
    }

    await this.todoItemRepo.remove(todoList);
  }
}
