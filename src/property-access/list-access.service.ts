import { Injectable } from '@nestjs/common';
import { AccessService } from './access.service';
import { ListResourceReader } from './adapters/list.resource-reader';
import { ListAccessRepo } from './adapters/list.access-repo';
import { AccessManagedResource } from './contracts';

@Injectable()
export class TodoListAccessService extends AccessService<AccessManagedResource> {
  constructor(reader: ListResourceReader, repo: ListAccessRepo) {
    super(reader, repo);
  }
}
