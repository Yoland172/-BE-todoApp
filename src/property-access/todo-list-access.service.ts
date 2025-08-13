import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoListShares } from 'src/entities/todoListShare.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoListAccessService {
  constructor(
    @InjectRepository(TodoListShares)
    todoListSharesRepo: Repository<TodoListShares>,
  ) {}
}
