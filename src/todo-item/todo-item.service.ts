import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from 'src/entities/todoItem.entity';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem) private todoItemRepo: Repository<TodoItem>,
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

  async findAll(userId: number) {
    const items = await this.todoItemRepo.find({
      where: [
        { createdBy: { id: userId }, shares: { user: { id: userId } } },
        { createdBy: { id: userId } },
      ],
    });

    if (!items.length)
      throw new NotFoundException('nothing items related to this user');

    return items;
  }

  async findOne(id: number, userId: number, includeShared: boolean = true) {
    const todoItem = await this.todoItemRepo.findOne({
      where: [
        { id, createdBy: { id: userId } },

        {
          ...(includeShared && { id, shares: { user: { id: userId } } }),
        },
      ],
      relations: { createdBy: true, shares: { user: true } },
    });

    if (!todoItem)
      throw new NotFoundException('not found any items related to this users');

    return todoItem;
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
