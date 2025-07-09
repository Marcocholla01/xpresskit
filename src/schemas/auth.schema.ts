import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createUserSchema } from './user.schema';

extendZodWithOpenApi(z);

export const loginUserSchema = z
  .object({
    username: z
      .string({ message: 'Enter your username' })
      .min(3, { message: 'Username must be at least 3 characters long.' })
      .max(30, { message: 'Username must not exceed 30 characters.' })
      .openapi({
        description: 'Username or email used to login',
        example: 'marcocholla',
      }),

    password: z
      .string({ message: 'Enter your password' })
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .max(100, { message: 'Password must not exceed 100 characters.' })
      .openapi({
        description: 'User password (min 6 chars)',
        example: 'strongPass123',
      }),
  })
  .openapi('LoginUserSchema');

export const registerUserSchema = createUserSchema
  .extend({
    password: z
      .string({ message: 'Enter your password' })
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .max(100, { message: 'Password must not exceed 100 characters.' })
      .openapi({
        description: 'Password for the new user',
        example: 'SuperSecret@123',
      }),

    phoneNumber: z
      .string({ message: 'Enter your phone number' })
      .regex(/^\+?\d{10,13}$/, {
        message: 'Phone number must be 10–13 digits and can start with +.',
      })
      .optional()
      .openapi({
        description: 'Optional phone number (10–13 digits)',
        example: '+254712345678',
      }),

    confirmPassword: z.string().openapi({
      description: 'Repeat password to confirm match',
      example: 'SuperSecret@123',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .openapi('RegisterUserSchema');

// ✅ Login Success Response
export const loginSuccessSchema = z
  .object({
    status: z.literal('success'),
    data: z.object({
      token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' }),
      user: z.object({
        id: z.string().openapi({ example: 'user_123' }),
        username: z.string().openapi({ example: 'marcocholla' }),
        email: z.string().openapi({ example: 'marco@example.com' }),
      }),
    }),
  })
  .openapi('LoginSuccessResponse');

// ❌ Login Error Response
export const loginErrorSchema = z
  .object({
    status: z.literal('error'),
    message: z.string().openapi({ example: 'Invalid email or password' }),
    errorCode: z.enum(['USER_NOT_FOUND', 'INVALID_PASSWORD']),
  })
  .openapi('LoginErrorResponse');

export const registerSuccessSchema = z
  .object({
    status: z.literal('success'),
    data: z.object({
      id: z.string().openapi({ example: 'user_123' }),
      fullNames: z.string().openapi({ example: 'Marco Cholla' }),
      username: z.string().openapi({ example: 'marcocholla' }),
      emailAddress: z.string().openapi({ example: 'marco@example.com' }),
      phoneNumber: z.string().optional().openapi({ example: '+254712345678' }),
    }),
  })
  .openapi('RegisterSuccessResponse');

export const registerErrorSchema = z
  .object({
    status: z.literal('error'),
    message: z.string().openapi({ example: 'User already exists' }),
    errorCode: z.enum(['USER_ALREADY_EXISTS', 'VALIDATION_ERROR', 'EMAIL_TAKEN', 'USERNAME_TAKEN']),
  })
  .openapi('RegisterErrorResponse');
