import { appError } from '@/utils/appError';
import { describe, expect, it } from 'vitest';

describe('appError', () => {
  it('should create an instance with correct properties', () => {
    const message = 'Test error';
    const statusCode = 400;
    const errorCode = 'TEST_ERROR';
    const error = new appError(message, statusCode, errorCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.errorCode).toBe(errorCode);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });
});