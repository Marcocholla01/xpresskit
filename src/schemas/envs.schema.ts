import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
  FRONTEND_URL: z.string().url({ message: 'FRONTEND_URL must be a valid URL' }),
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: 'NODE_ENV must be development, production, or test' }),
  }),

  SMTP_MAIL: z.string().email({ message: 'SMTP_MAIL must be a valid email' }),
  SMTP_HOST: z.string({ required_error: 'SMTP_HOST is required' }),
  SMTP_PASSWORD: z.string({ required_error: 'SMTP_PASSWORD is required' }),
  SMTP_PORT: z
    .string()
    .transform(Number)
    .refine(val => !isNaN(val), { message: 'SMTP_PORT must be a number' }),
  SMTP_SECURE: z.string({ required_error: 'SMTP_SECURE is required' }),

  JWT_SIGN_SECRET: z
    .string()
    .min(10, { message: 'JWT_SIGN_SECRET must be at least 10 characters' }),
  JWT_ENCRYPT_SECRET: z
    .string()
    .min(10, { message: 'JWT_ENCRYPT_SECRET must be at least 10 characters' }),
  JWT_ACCESS_TOKEN_EXPIRY: z.string({ required_error: 'JWT_ACCESS_TOKEN_EXPIRY is required' }),
  JWT_REFRESH_TOKEN_EXPIRY: z.string({ required_error: 'JWT_REFRESH_TOKEN_EXPIRY is required' }),

  LOG_TO_CONSOLE: z.string({ required_error: 'LOG_TO_CONSOLE is required' }),
  LOG_LEVEL: z.enum(['info', 'debug', 'warn', 'http', 'silly', 'verbose', 'error'], {
    errorMap: () => ({
      message: 'LOG_LEVEL must be info, debug, warn, http, silly, verbose or error',
    }),
  }),
});
