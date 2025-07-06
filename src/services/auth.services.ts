import { ERROR_CODES, REFRESH_TOKEN_EXPIRY_MS } from '@/config/constants';
import prisma from '@/config/prisma-client';
import { verifySecureToken } from '@/libs/jwt/secure-token';
import type { AuthPayload, LoginUserInput, registerUserInput } from '@/types/auth.types';
import { appError } from '@/utils/appError';
import { getHeaderValue } from '@/utils/header';
import { comparePassword, hashPassword } from '@/utils/password';

import { findByEmail, findByPhoneNumber, findByusername } from './common';
import { generateAuthTokens, generateEmailVerifyToken } from './jwt/token.services';

import type { Request } from 'express';

export const registerUserService = async (data: registerUserInput) => {
  const emailExists = await findByEmail(data.emailAddress);
  if (emailExists) {
    throw new appError('Email is already registered', 409, ERROR_CODES.EMAIL_EXISTS);
  }

  const usernameExists = await findByusername(data.username);
  if (usernameExists) {
    throw new appError('Username is already taken', 409, ERROR_CODES.USERNAME_EXISTS);
  }

  if (data.phoneNumber) {
    const phoneNumberExists = await findByPhoneNumber(data.phoneNumber);
    if (phoneNumberExists) {
      throw new appError('Phone number already registered', 409, ERROR_CODES.PHONE_EXISTS);
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullNames: data.fullNames,
      emailAddress: data.emailAddress,
      username: data.username,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
    },
  });

  // ✅ Generate email verification token
  const { verifyEmailToken } = await generateEmailVerifyToken({ userId: user.id });

  return {
    user,
    verifyEmailToken,
  };
};

export const loginUserService = async (data: LoginUserInput, req: Request) => {
  const user = (await findByEmail(data.username)) || (await findByusername(data.username));

  if (!user) {
    throw new appError('Invalid email or password', 401, ERROR_CODES.USER_NOT_FOUND);
  }

  const { isValid, needsRehash } = await comparePassword(data.password, user.password);

  if (!isValid) {
    throw new appError('Invalid email or password', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (needsRehash) {
    const newHash = await hashPassword(data.password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });
  }

  const { accessToken, refreshToken, expiresIn } = await generateAuthTokens({ userId: user.id });

  const session = await createSession({
    userId: user.id,
    ipAddress: getHeaderValue(req.ip) || 'unknown',
    userAgent: req.get('user-agent') || 'unknown',
    device: getHeaderValue(req.headers['sec-ch-ua-platform']) || 'unknown',
    location: getHeaderValue(req.headers['x-forwarded-for']) || req.ip,
    refreshToken: await hashPassword(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return {
    user,
    accessToken,
    refreshToken,
    expiresIn,
    session,
  };
};

export const refreshAuthTokens = async (refreshToken: string) => {
  const result = await verifySecureToken(refreshToken);

  if (!result.success) {
    throw new appError('Invalid refresh token', 403, ERROR_CODES.REFRESH_TOKEN_INVALID);
  }

  const { userId } = result.payload as AuthPayload;

  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  const matchedSession = await Promise.any(
    sessions.map(async session => {
      const isValid = await comparePassword(refreshToken, session.refreshToken);
      if (isValid) return session;
      throw new Error('No match');
    })
  ).catch(() => null);

  if (!matchedSession) {
    throw new appError('Session not found or expired', 403, ERROR_CODES.SESSION_NOT_FOUND);
  }

  await prisma.session.update({
    where: { id: matchedSession.id },
    data: { isRevoked: true },
  });

  const newTokens = await generateAuthTokens({ userId });

  await createSession({
    userId,
    refreshToken: await hashPassword(newTokens.refreshToken),
    ipAddress: matchedSession.ipAddress,
    userAgent: matchedSession.userAgent,
    device: matchedSession?.device || '',
    location: matchedSession?.location || '',
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return newTokens;
};

// create session
export const createSession = async (data: {
  userId: string;
  ipAddress: string;
  userAgent: string;
  refreshToken: string;
  expiresAt: Date;
  device?: string;
  location?: string;
}) => {
  return await prisma.session.create({ data });
};
