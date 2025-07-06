import { COOKIE_OPTIONS, ERROR_CODES } from '@/config/constants';
import { FRONTEND_URL } from '@/config/envs';
import prisma from '@/config/prisma-client';
import { sendMail } from '@/libs/mailer';
import { catchAsync } from '@/middlewares/catchAsync';
import { loginUserSchema, registerUserSchema } from '@/schemas/user.schema';
import { loginUserService, refreshAuthTokens, registerUserService } from '@/services/auth.services';
import { appError } from '@/utils/appError';
import { logger } from '@/utils/logger';

import type { Request, Response } from 'express';

export const registerUserController = catchAsync(async (req: Request, res: Response) => {
  // Validate the request body using Zod schema
  const validatedData = registerUserSchema.parse(req.body);

  // Call service logic
  const { user, verifyEmailToken } = await registerUserService(validatedData);
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verifyEmailToken}`;

  const verifyRes = await sendMail({
    to: user.emailAddress,
    from: 'no-reply@yourapp.com',
    subject: 'Verify your account',
    html: `<p>Hello ${user.username}, click <a href="${verifyUrl}">here</a> to verify your account.</p>`,
  });

  if (!verifyRes.success) {
    await prisma.user.delete({ where: { id: user.id } });

    logger.error('Verification email failed, rolling back user', {
      userId: user.id,
      reason: verifyRes.message,
    });

    return res.status(500).json({
      success: false,
      message: 'Email failed. Account rolled back. Please try again later.',
      errorCode: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
    });
  }

  logger.info('User created', {
    requestId: req.requestId,
    userId: user.id,
    action: 'createUser',
    route: req.originalUrl,
  });

  res.status(201).json({
    success: true,
    message: 'Account created. Please check your email to verify your account.',
    userId: user.id,
  });
});

export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginUserSchema.parse(req.body);

  const { accessToken, refreshToken, expiresIn, user } = await loginUserService(validatedData, req);

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json({
    accessToken,
    expiresIn,
    user: {
      id: user.id,
      username: user.username,
      email: user.emailAddress,
      role: user.role,
    },
  });
});

export const refreshTokenController = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new appError('Missing refresh token', 403, ERROR_CODES.REFRESH_TOKEN_MISSING);
  }

  const {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
  } = await refreshAuthTokens(refreshToken);

  logger.info('Refreshed token', {
    action: 'refreshToken',
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS).json({
    accessToken,
    expiresIn,
  });
});
