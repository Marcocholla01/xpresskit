import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prisma from '@/config/prisma-client';

import app from '../../app';

beforeAll(async () => {
  await prisma.$connect();
});

// beforeEach(async () => {
//   await prisma.user.deleteMany();
// });

describe('Users API', () => {
  it('should create and fetch users', async () => {
    const user = { name: 'Paul', email: 'paul@test.com' };

    const res1 = await request(app).post('/api/v1/users').send(user);
    expect(res1.status).toBe(201);

    const res2 = await request(app).get('/api/v1/users');
    expect(res2.body.length).toBe(1);
    expect(res2.body[0].email).toBe(user.email);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
