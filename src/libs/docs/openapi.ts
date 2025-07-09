import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registerAuthPaths } from './paths/auth.paths';
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();
// Register all endpoint paths

registerAuthPaths(registry);
// registerUserPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'XPressKit API',
    version: '1.0.0',
    description: `XPressKit is a robust and developer-friendly backend API starter kit built with Express.js, TypeScript, and Prisma ORM. It provides a modular, scalable architecture ideal for building RESTful APIs and microservices. 

Key features include:
- Type-safe schema validation with Zod
- JWT-based authentication with refresh token support
- Built-in API documentation using Scalar (OpenAPI)
- Clean folder structure following industry best practices
- Integrated testing setup with Vitest and Supertest

Whether you're prototyping or deploying production-ready services, XPressKit accelerates development with clarity, maintainability, and modern tooling.`,
    contact: {
      name: 'XPressKit Maintainer',
      url: 'https://github.com/marcocholla01/xpresskit',
      email: 'your-email@example.com',
    },
    termsOfService: 'https://xpresskit-api.com/terms',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  externalDocs: {
    description: 'Find more info on GitHub',
    url: 'https://github.com/marcocholla01/xpresskit',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development server',
    },
    {
      url: 'https://xpresskit-api.onrender.com/api/v1',
      description: 'Production server',
    },
  ],

  tags: [
    {
      name: 'Authentication',
      description:
        'Endpoints related to user authentication (login, register, token refresh, etc.)',
    },
    {
      name: 'User',
      description: 'User-related operations and profile management',
    },
  ],

  // ⛓️ Security requirement applied globally to all endpoints
  security: [{ bearerAuth: [] }, { refreshToken: [] }],
});

openApiDocument.components = {
  ...openApiDocument.components, 
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Access Token',
    },
    refreshToken: {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'Refresh token in HttpOnly cookie',
    },
  },
};

export { openApiDocument };
