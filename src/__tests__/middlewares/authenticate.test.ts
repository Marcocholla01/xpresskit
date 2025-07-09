import { ERROR_CODES } from '@/config/constants';
import prisma from '@/config/prisma-client';
import { verifySecureToken } from '@/libs/jwt/secure-token';
import { isAuthenticated } from '@/middlewares/authenticate';
import { appError } from '@/utils/appError';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/prisma-client');
vi.mock('@/libs/jwt/secure-token');
vi.mock('@/utils/appError');
vi.mock('./catchAsync', () => ({ catchAsync: vi.fn((fn) => fn) }));

const mockRequest = { headers: {} } as any;
const mockResponse = {} as any;
const mockNext = vi.fn();

describe('isAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.headers = {};
  });

  it('should throw an error if no token is provided', async () => {
    await isAuthenticated(mockRequest, mockResponse, mockNext);

    expect(appError).toHaveBeenCalledWith(
      'Unauthorized: No token provided',
      401,
      ERROR_CODES.ACCESS_TOKEN_NOT_FOUND
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
  });

  it('should throw an error if the token is invalid', async () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';
    (verifySecureToken as vi.Mock).mockResolvedValue({ success: false });

    await isAuthenticated(mockRequest, mockResponse, mockNext);

    expect(appError).toHaveBeenCalledWith(
      'Unauthorized: Invalid token',
      403,
      ERROR_CODES.ACCESS_TOKEN_INVALID
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
  });

  it('should throw an error if the user is not found', async () => {
    mockRequest.headers.authorization = 'Bearer valid-token';
    (verifySecureToken as vi.Mock).mockResolvedValue({ 
      success: true, 
      payload: { userId: '123' } 
    });
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(null);

    await isAuthenticated(mockRequest, mockResponse, mockNext);

    expect(appError).toHaveBeenCalledWith(
      'Unauthorized: User not found',
      403,
      ERROR_CODES.USER_NOT_FOUND
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
  });

  it('should attach auth to request if authentication is successful', async () => {
    const mockUser = { id: '123', role: 'USER' };
    mockRequest.headers.authorization = 'Bearer valid-token';
    (verifySecureToken as vi.Mock).mockResolvedValue({ 
      success: true, 
      payload: { userId: '123' } 
    });
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);

    await isAuthenticated(mockRequest, mockResponse, mockNext);

    expect(mockRequest.auth).toEqual({ userId: '123', role: 'USER' });
    expect(mockNext).toHaveBeenCalled();
  });
});