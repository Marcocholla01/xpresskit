import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * 🌐 General 500 Server Error Response
 */
export const serverErrorSchema = z
  .object({
    status: z.literal('error').openapi({ example: 'error' }),
    message: z
      .string()
      .openapi({ example: 'Internal Server Error', description: 'Error message for debugging' }),
    errorCode: z.string().optional().openapi({
      example: 'SERVER_ERROR',
      description: 'Optional application-specific error code',
    }),
    timestamp: z
      .string()
      .datetime()
      .optional()
      .openapi({ example: new Date().toISOString(), description: 'Time the error occurred' }),
  })
  .openapi('ServerErrorResponse');
