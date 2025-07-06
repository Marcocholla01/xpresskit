// src/middlewares/isAuthenticated.ts

import { ERROR_CODES } from '@/config/constants';
import prisma from '@/config/prisma-client';
import { verifySecureToken } from '@/libs/jwt/secure-token';
import type { AuthPayload } from '@/types/auth.types';
import { appError } from '@/utils/appError';

import { catchAsync } from './catchAsync';

import type { NextFunction, Request, Response } from 'express';

export const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.headers.authorization?.split(' ')[1] || req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      throw new appError(
        'Unauthorized: No token provided',
        401,
        ERROR_CODES.ACCESS_TOKEN_NOT_FOUND
      );
    }

    const result = await verifySecureToken(accessToken);

    if (!result.success) {
      throw new appError('Unauthorized: Invalid token', 403, ERROR_CODES.ACCESS_TOKEN_INVALID);
    }

    const { userId } = result.payload as AuthPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new appError('Unauthorized: User not found', 403, ERROR_CODES.USER_NOT_FOUND);
    }

    // Attach auth to req (extended on Express.Request)
    req.auth = {
      userId,
      role: user.role,
    };

    next(); // important to call this on success
  }
);
