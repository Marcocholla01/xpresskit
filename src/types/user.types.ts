import type { createUserSchema } from '@/schemas/user.schema';

import type { z } from 'zod';

export type CreateUserInput = z.infer<typeof createUserSchema>;
