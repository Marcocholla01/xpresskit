import { signToken, verifyToken } from '@/libs/jwt/signer';
import { SignJWT, jwtVerify } from 'jose';
import { describe, expect, it, vi } from 'vitest';

vi.mock('jose', () => ({
  SignJWT: vi.fn(() => ({
    setProtectedHeader: vi.fn(() => ({
      setIssuedAt: vi.fn(() => ({
        setExpirationTime: vi.fn(() => ({
          sign: vi.fn()
        }))
      }))
    }))
  })),
  jwtVerify: vi.fn()
}));

vi.mock('@/config/secrets', () => ({
  SIGN_SECRET: 'mock-secret'
}));

const mockPayload = { userId: '123' };

// Tests for signToken function
describe('signToken', () => {
  it('should sign a token with correct parameters', async () => {
    const mockSign = vi.fn().mockResolvedValue('mock-token');
    const mockSetExpirationTime = vi.fn().mockReturnValue({
      sign: mockSign
    });
    const mockSetIssuedAt = vi.fn().mockReturnValue({
      setExpirationTime: mockSetExpirationTime
    });
    const mockSetProtectedHeader = vi.fn().mockReturnValue({
      setIssuedAt: mockSetIssuedAt
    });
    (SignJWT as unknown as jest.Mock).mockReturnValue({
      setProtectedHeader: mockSetProtectedHeader
    });

    const result = await signToken(mockPayload);

    expect(SignJWT).toHaveBeenCalledWith(mockPayload);
    expect(mockSetProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    expect(mockSetIssuedAt).toHaveBeenCalled();
    expect(mockSetExpirationTime).toHaveBeenCalledWith('2h');
    expect(mockSign).toHaveBeenCalledWith('mock-secret');
    expect(result).toBe('mock-token');
  });

  it('should allow custom expiration time', async () => {
    const mockSign = vi.fn().mockResolvedValue('mock-token');
    const mockSetExpirationTime = vi.fn().mockReturnValue({
      sign: mockSign
    });
    const mockSetIssuedAt = vi.fn().mockReturnValue({
      setExpirationTime: mockSetExpirationTime
    });
    const mockSetProtectedHeader = vi.fn().mockReturnValue({
      setIssuedAt: mockSetIssuedAt
    });
    (SignJWT as unknown as jest.Mock).mockReturnValue({
      setProtectedHeader: mockSetProtectedHeader
    });

    const customExpiresIn = '1h';
    await signToken(mockPayload, customExpiresIn);

    expect(mockSetExpirationTime).toHaveBeenCalledWith(customExpiresIn);
  });
});

// Tests for verifyToken function
describe('verifyToken', () => {
  it('should verify a token and return payload', async () => {
    const mockPayload = { userId: '123' };
    (jwtVerify as unknown as jest.Mock).mockResolvedValue({ payload: mockPayload });

    const result = await verifyToken('mock-token');

    expect(jwtVerify).toHaveBeenCalledWith('mock-token', 'mock-secret');
    expect(result).toEqual(mockPayload);
  });

  it('should propagate verification errors', async () => {
    const mockError = new Error('Verification failed');
    (jwtVerify as unknown as jest.Mock).mockRejectedValue(mockError);

    await expect(verifyToken('mock-token')).rejects.toThrow(mockError);
  });
});