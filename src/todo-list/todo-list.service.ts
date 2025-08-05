import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TodoList from 'src/entities/todoList.entity';
import { TodoListShares } from 'src/entities/todoListShare.entity';
import { TodoItemService } from 'src/todo-item/todo-item.service';

@Injectable()
export class TodoListService {
  constructor(
    private readonly todoItemService: TodoItemService,
    @InjectRepository(TodoList) private todoListRepo: Repository<TodoList>,
    @InjectRepository(TodoListShares)
    private todoListShares: Repository<TodoListShares>,
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

  async findOne(id: number, userId: number, includeShared: boolean = true) {
    const todoList = await this.todoListRepo.findOne({
      where: [
        { id, owner: { id: userId } },
        {
          ...(includeShared && { id, shares: { user: { id: userId } } }),
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
    const updatedList = await this.todoListRepo.update(
      {
        owner: { id: userId },
        id,
      },
      updateTodoListDto,
    );

    return updatedList;
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

  async connectItemToList(userId: number, listId: number, itemId: number) {
    const item = await this.todoItemService.findOne(itemId, userId, false);
    const list = await this.findOne(listId, userId, false);

    if (item.listId)
      throw new BadRequestException('this item already connected to List');

    const updatedItem = await this.todoItemService.update(
      itemId,
      {
        listId,
      },
      userId,
    );

    return updatedItem;
    // console.log(item, list);
    // const [list, item] = await Promise.all([
    //   this.todoListRepo.findOneOrFail({ where: { id: listId } }),
    //   this.todoItemRepo.findOneOrFail({ where: { id: itemId } }),
    // ]);
  }
}
