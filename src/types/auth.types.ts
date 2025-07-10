

import type { loginUserSchema, registerUserSchema } from '@/schemas/auth.schema';
import type { JWTPayload } from 'jose';
import type { z } from 'zod';

export type TokenType = 'accessToken' | 'refreshToken' | 'emailVerifyToken' | 'passwordResetToken';

// You can extend the payload type for your app
export interface AuthPayload extends JWTPayload {
  userId: string;
  tokenType: TokenType;
}

export interface ComparePasswordResult {
  isValid: boolean;
  needsRehash: boolean;
}

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type registerUserInput = z.infer<typeof registerUserSchema>;
