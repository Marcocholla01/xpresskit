import type { Roles } from '@/config/roles';

import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: Pick<User, 'id' | 'email' | 'role'>;
      auth?: {
        role: string;
        userId?: string;
        email?: string;
      };
    }
  }
}

export {};
