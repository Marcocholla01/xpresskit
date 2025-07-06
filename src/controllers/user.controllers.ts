import prisma from '@/config/prisma-client';
import { catchAsync } from '@/middlewares/catchAsync';
import { createUserService, getAllUsersService } from '@/services/user.services';
import { logger } from '@/utils/logger';

import { createUserSchema } from '../schemas/user.schema';

import type { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  const { fullNames, emailAddress, username, password } = req.body;
  const user = await prisma.user.create({
    data: { fullNames, emailAddress, username, password },
  });
  res.status(201).json(user);
};

export const createUserController = catchAsync(async (req: Request, res: Response) => {
  // Validate the request body using Zod schema
  const validatedData = createUserSchema.parse(req.body);

  // Call service logic
  const user = await createUserService(validatedData);

  // TODO send Mail

  // Optionally log
  logger.info('User created', {
    // requestId: req.requestId,
    userId: user?.id,
    action: 'createUser',
    route: req.originalUrl,
  });

  // Return response
  res.status(201).json(user);
});

export const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder, emailVerified, hasPhone } = req.query;

  const query = {
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
    filters: {
      emailVerified: emailVerified === 'true',
      hasPhone: hasPhone === 'true',
    },
  };

  const data = await getAllUsersService(query);

  res.status(200).json({
    success: true,
    ...data,
  });
});
