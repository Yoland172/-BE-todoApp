import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRepo } from '../contracts';
import { UserTodoListAccess } from 'src/entities/userTodoListAccess.entity';

@Injectable()
export class ListAccessRepo implements AccessRepo {
  constructor(
    @InjectRepository(UserTodoListAccess)
    private readonly repo: Repository<UserTodoListAccess>,
  ) {}

  async insert({
    userId,
    resourceId,
    role,
  }: {
    userId: number;
    resourceId: number;
    role: any;
  }) {
    await this.repo.insert({ userId, listId: resourceId, role });
  }

  delete({ userId, resourceId }: { userId: number; resourceId: number }) {
    return this.repo.delete({
      user: { id: userId },
      todoList: { id: resourceId },
    });
  }
}
