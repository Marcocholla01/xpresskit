// services/user.service.ts
import prisma from '@/config/prisma-client';
import type { CreateUserInput } from '@/types/user.types';
import { appError } from '@/utils/appError';
import { generateRandomPassword, hashPassword } from '@/utils/password';

import { findByEmail, findByusername } from './common';

export const createUserService = async (data: CreateUserInput) => {
  const emailExists = await findByEmail(data.emailAddress);
  if (emailExists) {
    throw new appError('Email is already registered', 409, 'EMAIL_EXISTS');
  }

  const usernameExists = await findByusername(data.username);
  if (usernameExists) {
    throw new appError('Username is already taken', 409, 'USERNAME_EXISTS');
  }
  const password = generateRandomPassword();

  console.log(password);
  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      fullNames: data.fullNames,
      emailAddress: data.emailAddress,
      username: data.username,
      password: hashedPassword,
    },
  });
};

interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'username' | 'emailAddress';
  sortOrder?: 'asc' | 'desc';
  filters?: {
    emailVerified?: boolean;
    hasPhone?: boolean;
  };
}

export const getAllUsersService = async (query: GetUsersQuery = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filters = {},
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { username: { contains: search.toLowerCase() } },
        { emailAddress: { contains: search.toLowerCase() } },
        { fullNames: { contains: search.toLowerCase() } },
      ],
    }),
    ...(filters.emailVerified !== undefined && {
      emailVerified: filters.emailVerified,
    }),
    ...(filters.hasPhone !== undefined && {
      phoneNumber: filters.hasPhone ? { not: null } : null,
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        fullNames: true,
        emailAddress: true,
        username: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    users,
  };
};

export const getCurrentUserService = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullNames: true,
      emailAddress: true,
      username: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
