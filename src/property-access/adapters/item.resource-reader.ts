import { Injectable } from '@nestjs/common';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { AccessManagedResource, ResourceReader } from '../contracts';

type ItemResource = AccessManagedResource; // узгодь з типом, який повертає твій service.findOne()

@Injectable()
export class ItemResourceReader implements ResourceReader<ItemResource> {
  constructor(private readonly itemService: TodoItemService) {}

  findOne(
    userId: number,
    resourceId: number,
    withAccess?: boolean,
    queryArg?: 'join' | 'query',
  ) {
    return this.itemService.findOne(userId, resourceId, !!withAccess, queryArg);
  }
}
