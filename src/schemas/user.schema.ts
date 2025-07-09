import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createUserSchema = z
  .object({
    fullNames: z
      .string({ message: 'Enter your full name' })
      .min(3, { message: 'Full name must be at least 3 characters long.' })
      .max(50, { message: 'Full name must not exceed 50 characters.' })
      .openapi({
        description: 'User full name',
        example: 'John Doe',
      }),

    emailAddress: z
      .string({ message: 'Enter your email address' })
      .email({ message: 'Enter a valid email address.' })
      .openapi({
        description: 'Valid email address of the user',
        example: 'john.doe@example.com',
      }),

    username: z
      .string({ message: 'Enter your username' })
      .min(3, { message: 'Username must be at least 3 characters long.' })
      .max(30, { message: 'Username must not exceed 30 characters.' })
      .openapi({
        description: 'Unique username for the user',
        example: 'johndoe',
      }),
  })
  .openapi('CreateUserSchema');
