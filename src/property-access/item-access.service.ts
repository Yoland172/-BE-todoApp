import { Injectable } from '@nestjs/common';
import { AccessService } from './access.service';
import { ItemResourceReader } from './adapters/item.resource-reader';
import { ItemAccessRepo } from './adapters/item.access-repo';
import { AccessManagedResource } from './contracts';

@Injectable()
export class TodoItemAccessService extends AccessService<AccessManagedResource> {
  constructor(reader: ItemResourceReader, repo: ItemAccessRepo) {
    super(reader, repo);
  }
}
