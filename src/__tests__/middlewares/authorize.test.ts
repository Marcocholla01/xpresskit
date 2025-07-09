import { isAuthorized } from '@/middlewares/authorize';
import { describe, expect, it, vi } from 'vitest';

// Mock types
const mockRequest = {} as any;
const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
const mockNext = vi.fn();

describe('isAuthorized', () => {
  it('should call next if user has the required role', () => {
    const allowedRoles = ['ADMIN', 'EDITOR'];
    mockRequest.auth = { role: 'ADMIN' };
    
    const middleware = isAuthorized(...allowedRoles);
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return 401 and error message if user lacks auth info', () => {
    const allowedRoles = ['ADMIN', 'EDITOR'];
    mockRequest.auth = undefined;
    
    const middleware = isAuthorized(...allowedRoles);
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Operation not permitted for role: unknown. Access denied'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 and error message if user does not have the required role', () => {
    const allowedRoles = ['ADMIN', 'EDITOR'];
    mockRequest.auth = { role: 'USER' };
    
    const middleware = isAuthorized(...allowedRoles);
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Operation not permitted for role: USER. Access denied'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});