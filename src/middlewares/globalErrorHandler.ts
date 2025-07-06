import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { ERROR_CODES } from '@/config/constants';
import { appError } from '@/utils/appError';
import { handleJwtError } from '@/utils/errorHandlers/handleJwtError';
import { handleMailError } from '@/utils/errorHandlers/handleMailError';
import { handlePrismaError } from '@/utils/errorHandlers/handlePrismaError';
import { handleZodError } from '@/utils/errorHandlers/handleZodError';
import { logger } from '@/utils/logger';

import type { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || ERROR_CODES.UNKNOWN_ERROR;
  let message = err.message || 'Something went wrong';
  let errors: string | any[] = [];

  if (err instanceof appError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    const zodHandled = handleZodError(err);
    return res.status(zodHandled.statusCode).json({
      success: false,
      errorCode: zodHandled.errorCode,
      message: zodHandled.message,
      errors: zodHandled.errors,
    });
  } else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    const prismaHandled = handlePrismaError(err);
    if (prismaHandled) {
      return res.status(prismaHandled.statusCode).json({
        success: false,
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        message: prismaHandled.message,
      });
    }
  } else {
    const jwtHandled = handleJwtError(err) || handleMailError(err);
    if (jwtHandled) {
      statusCode = jwtHandled.statusCode;
      errorCode = jwtHandled.errorCode;
      message = jwtHandled.message;
    }
  }

  console.log(err.stack || err);

  logger.error(err.message, {
    stack: err.stack,
    requestId: req.requestId,
    userId: req?.auth?.userId,
  });

  return res.status(statusCode).json({
    success: false,
    errorCode,
    message,
    ...(errors.length && { errors }),
  });
};
