import {
  loginErrorSchema,
  loginSuccessSchema,
  loginUserSchema,
  registerErrorSchema,
  registerSuccessSchema,
  registerUserSchema,
} from '@/schemas/auth.schema';
import { serverErrorSchema } from '@/schemas/server.errors.chema';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const registerAuthPaths = (registry: OpenAPIRegistry) => {
  registry.register('Authentication', registerUserSchema);
  registry.register('Authentication', loginUserSchema);

  // Register route
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    // security: [{ bearerAuth: [] }],
    summary: 'Reagister an Account',
    description: `This endpoint allows a new user to create an account by providing valid personal details such as full name, email address, username, and password. Upon successful registration, the user will receive a confirmation response containing their user information.
    
Validation is enforced on all required fields, and proper error messages are returned for invalid inputs, duplicate entries, or server issues.`,
    tags: ['Authentication'],

    request: {
      body: {
        content: {
          'application/json': {
            schema: registerUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: {
          'application/json': {
            schema: registerSuccessSchema.openapi('RegisterUserSuccess'),
          },
        },
      },
      400: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: registerErrorSchema.openapi('RegisterUserError'),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: serverErrorSchema.openapi('ServerError'),
          },
        },
      },
    },
  });

  // Login route
  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Authentication'],
    summary: 'Login to Account',
    description: `This endpoint allows an existing user to log in using their username or email and password. Upon successful authentication, the server responds with a JSON Web Token (JWT) and basic user information.

The token can be used for accessing protected routes. In case of invalid credentials, appropriate error messages and codes are returned.`,

    request: {
      body: {
        content: {
          'application/json': {
            schema: loginUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User logged in successfully',
        content: {
          'application/json': {
            schema: loginSuccessSchema.openapi('LoginUserSuccess'),
          },
        },
      },
      400: {
        description: 'Invalid login credentials',
        content: {
          'application/json': {
            schema: loginErrorSchema.openapi('LoginUserError'),
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: serverErrorSchema.openapi('ServerError'),
          },
        },
      },
    },
  });
};
