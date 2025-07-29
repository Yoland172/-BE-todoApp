import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TodoList from 'src/entities/todoList.entity';
import User from 'src/entities/user.entity';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList) private todoListRepo: Repository<TodoList>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: number, createTodoListDto: CreateTodoListDto) {
    try {
      const todoList = this.todoListRepo.create({
        owner: { id: userId },
        title: createTodoListDto.title,
      });

      const list = await this.todoListRepo.save(todoList);
      delete list.owner;
      return list;
    } catch {
      throw new InternalServerErrorException('Could not create todo list');
    }
  }

  async findAll(userId: number) {
    try {
      const todoLists = this.todoListRepo.find({
        where: [
          { owner: { id: userId } },
          { shares: { user: { id: userId } } },
        ],
        relations: {
          owner: true,
          todoItems: { createdBy: true },
        },
      });
      return todoLists;
    } catch {}
    return `This action returns all todoList`;
  }

  async findOne(id: number, userId: number, isUserOwner: boolean = false) {
    const todoList = await this.todoListRepo.findOne({
      where: [
        { id, owner: { id: userId } },
        {
          ...(!isUserOwner && { id, shares: { user: { id: userId } } }),
        },
      ],
      relations: {
        owner: true,
        shares: { user: true },
        todoItems: true,
      },
    });
    if (!todoList)
      throw new NotFoundException(
        'don`t exist this list or user haven`t access ',
      );

    return todoList;
  }

  async update(
    id: number,
    userId: number,
    updateTodoListDto: UpdateTodoListDto,
  ) {
    const todoList = await this.findOne(id, userId, true);

    todoList.title = updateTodoListDto.title ?? todoList.title;

    await this.todoListRepo.save(todoList);

    return todoList;
  }

  async remove(id: number, userId: number) {
    const todoList = await this.todoListRepo.findOne({
      where: {
        id,
        owner: { id: userId },
      },
    });
    if (!todoList) {
      throw new NotFoundException(
        'the list with this ID does not exist for this user',
      );
    }

    await this.todoListRepo.remove(todoList);
  }
}
