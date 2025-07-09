// src/controllers/docs.controller.ts
import { openApiDocument } from '@/libs/docs/openapi';
import type { Request, Response } from 'express';

/**
 * Serve the generated OpenAPI document
 */
export const getOpenApiSpec = (_req: Request, res: Response) => {
  res.json(openApiDocument);
};
