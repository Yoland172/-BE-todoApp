import { AccessLevel } from 'src/entities/utils/types';

export type InsertAccessPayload =
  | { userId: number; role: AccessLevel; todoItemId: number }
  | { userId: number; role: AccessLevel; todoListId: number };

export type DeleteAccessCriteria =
  | { userId: number; todoItemId: number }
  | { userId: number; todoListId: number };

export interface AccessRepo {
  insert(payload: InsertAccessPayload): Promise<void>;
  delete(criteria: DeleteAccessCriteria): Promise<{ affected: number }>;
}
