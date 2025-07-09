import { catchAsync } from '@/middlewares/catchAsync';
import { describe, expect, it, vi } from 'vitest';

// Mock Express types
const mockRequest = {};
const mockResponse = {};
const mockNext = vi.fn();

describe('catchAsync', () => {
  it('should call the handler and resolve successfully', async () => {
    const mockHandler = vi.fn().mockResolvedValue('success');
    const asyncHandler = catchAsync(mockHandler);

    await asyncHandler(mockRequest, mockResponse, mockNext);

    expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with the error if the handler rejects', async () => {
    const mockError = new Error('Test error');
    const mockHandler = vi.fn().mockRejectedValue(mockError);
    const asyncHandler = catchAsync(mockHandler);

    await asyncHandler(mockRequest, mockResponse, mockNext);

    expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});