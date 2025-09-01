import { AccessLevel } from 'src/entities/utils/types';

export const ROLES_PRIORITY = [AccessLevel.READER, AccessLevel.EDITOR] as const;
