// libs/jwt/token.service.ts

import {
  ACCESS_TOKEN_EXPIRY,
  EMAIL_VERIFICATION_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '@/config/constants';
import { createSecureToken } from '@/libs/jwt/secure-token';
import type { AuthPayload } from '@/types/auth.types';

export const generateAuthTokens = async (user: { userId: string }) => {
  const accessPayload: AuthPayload = {
    userId: user.userId,
    tokenType: 'accessToken',
  };

  const refreshPayload: AuthPayload = {
    userId: user.userId,
    tokenType: 'refreshToken',
  };

  const accessToken = await createSecureToken(accessPayload, ACCESS_TOKEN_EXPIRY);
  const refreshToken = await createSecureToken(refreshPayload, REFRESH_TOKEN_EXPIRY);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
};

export const generateEmailVerifyToken = async (user: { userId: string }) => {
  const payload: AuthPayload = {
    userId: user.userId,
    tokenType: 'emailVerifyToken',
  };

  const verifyEmailToken = await createSecureToken(payload, EMAIL_VERIFICATION_TOKEN_EXPIRY);
  return { verifyEmailToken };
};
