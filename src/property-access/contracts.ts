// access/contracts.ts
import { AccessLevel } from 'src/entities/utils/types';

export type AccessEntry = { userId: number; role: AccessLevel };

export interface AccessManagedResource {
  id: number;
  createdBy: { id: number };
  accessList: AccessEntry[]; // має відповідати тому, що повертає твій findOne(..., true)
}

export interface ResourceReader<R extends AccessManagedResource> {
  findOne(
    userId: number,
    resourceId: number,
    withAccess?: boolean,
    queryArg?: string,
  ): Promise<R>;
}

export interface AccessRepo {
  insert(dto: {
    userId: number;
    resourceId: number;
    role: AccessLevel;
  }): Promise<void>;
  delete(dto: {
    userId: number;
    resourceId: number;
  }): Promise<{ affected?: number }>;
}

export const ROLES_PRIORITY = [AccessLevel.READER, AccessLevel.EDITOR] as const;
