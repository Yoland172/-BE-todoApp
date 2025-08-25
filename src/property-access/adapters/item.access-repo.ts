import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRepo } from '../contracts';
import { UserTodoItemAccess } from 'src/entities/userTodoItemAccess.entity';

@Injectable()
export class ItemAccessRepo implements AccessRepo {
  constructor(
    @InjectRepository(UserTodoItemAccess)
    private readonly repo: Repository<UserTodoItemAccess>,
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
    await this.repo.insert({ userId, todoId: resourceId, role });
  }

  delete({ userId, resourceId }: { userId: number; resourceId: number }) {
    return this.repo.delete({
      user: { id: userId },
      todoItem: { id: resourceId },
    });
  }
}
