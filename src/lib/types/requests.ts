import { TokenPayload } from 'src/auth/utils/types';

export type WithAuthRequest = Request & { user: TokenPayload };
