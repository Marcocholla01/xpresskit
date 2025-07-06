import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../app';

describe('GET /api/health', () => {
  it('should return health message', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Health Route working fine');
  });
});
