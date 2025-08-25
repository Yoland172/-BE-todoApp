// src/property-access/adapters/list.resource-reader.ts
import { Injectable } from '@nestjs/common';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { AccessManagedResource, ResourceReader } from '../contracts';

type ListResource = AccessManagedResource;

@Injectable()
export class ListResourceReader implements ResourceReader<ListResource> {
  constructor(private readonly listService: TodoListService) {}

  findOne(
    userId: number,
    resourceId: number,
    withAccess?: boolean,
    queryArg?: 'join' | 'query',
  ) {
    return this.listService.findOne(resourceId, userId, !!withAccess, queryArg);
  }
}
