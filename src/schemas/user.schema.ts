// src/schemas/user.schema.ts
import { z } from 'zod';

export const loginUserSchema = z.object({
  username: z
    .string({ message: 'Enter Your username' })
    .min(3, {
      message: 'Username or email must be at least 3 characters long.',
    })
    .max(30, { message: 'Username or email must not exceed 30 characters.' }),

  password: z
    .string({ message: 'Enter Your password' })
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password must not exceed 100 characters.' }),
});

export const createUserSchema = z.object({
  fullNames: z
    .string({ message: 'Enter Your full names' })
    .min(3, { message: 'Full name must be at least 3 characters long.' })
    .max(50, { message: 'Full name must not exceed 50 characters.' }),

  emailAddress: z
    .string({ message: 'Enter Your email address' })
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Enter a valid email address.' }),

  username: z
    .string({ message: 'Enter Your username' })
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(30, { message: 'Username must not exceed 30 characters.' }),
});

export const registerUserSchema = createUserSchema
  .extend({
    password: z
      .string({ message: 'Enter your password' })
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .max(100, { message: 'Password must not exceed 100 characters.' }),

    phoneNumber: z
      .string({ message: 'Enter your phone Number' })
      .regex(/^\+?\d{10,13}$/, {
        message: 'Phone number must be 10–13 digits and can start with +.',
      })
      .optional(),

    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
