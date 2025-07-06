import { Prisma } from '@prisma/client';

export const handlePrismaError = (err: any) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return {
          statusCode: 409,
          message: `Duplicate value for: ${(err.meta?.target as string[]).join(', ')}`,
        };
      case 'P2025':
        return {
          statusCode: 404,
          message: 'Record not found',
        };
      default:
        return {
          statusCode: 400,
          message: `Prisma error: ${err.message}`,
        };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Invalid input for database operation',
    };
  }

  return null;
};
