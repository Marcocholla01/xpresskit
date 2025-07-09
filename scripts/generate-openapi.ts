import { writeFileSync } from 'fs';
import { join } from 'path';

import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const dummySchema = z
  .object({
    email: z.string().email().openapi({ description: 'User email address' }),
  })
  .openapi('DummySchema');

const registry = new OpenAPIRegistry();

registry.register('Dummy', dummySchema);

registry.registerPath({
  method: 'post',
  path: '/api/test',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: dummySchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'XPressKit API',
    version: '1.0.0',
  },
});

const outputPath = join(process.cwd(), 'public/openapi.json');
writeFileSync(outputPath, JSON.stringify(document, null, 2));
console.log('✅ OpenAPI spec written to public/openapi.json');
