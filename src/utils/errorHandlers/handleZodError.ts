import { ZodError } from 'zod';

import { ERROR_CODES } from '@/config/constants';

export const handleZodError = (err: ZodError) => {
  const errors = err.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));

  return {
    success: false,
    statusCode: 400,
    message: errors[0]?.message || 'Validation failed', // Set the first error as message
    errorCode: ERROR_CODES.VALIDATION_ERROR,
    errors, // Still return full array for field-level display if needed
  };
};
