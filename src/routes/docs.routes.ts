// src/routes/docs.routes.ts
import { getOpenApiSpec } from '@/controllers/docs.controllers';
import { openApiDocument } from '@/libs/docs/openapi';
import { apiReference } from '@scalar/express-api-reference';
import express from 'express';
import redoc from 'redoc-express';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

// Serve OpenAPI JSON
router.get('/openapi.json', getOpenApiSpec);
// Serve Scalar API reference UI
router.get(
  '/',
  apiReference({
    spec: {
      url: '/openapi.json',
      title: 'XPressKit API Docs',
    },
  })
);

router.use(
  '/redoc',
  redoc({
    title: 'XPressKit API Docs || Redoc',
    specUrl: '/openapi.json',
  })
);

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default router;
