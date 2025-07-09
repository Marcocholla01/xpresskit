import {
    ACCESS_TOKEN_EXPIRY,
    EMAIL_VERIFICATION_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY
} from '@/config/constants';
import { createSecureToken } from '@/libs/jwt/secure-token';
import { generateAuthTokens, generateEmailVerifyToken } from '@/services/jwt/token.services';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/libs/jwt/secure-token');

const mockUser = { userId: '123' };

describe('Token Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAuthTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const mockAccessToken = 'access-token';
      const mockRefreshToken = 'refresh-token';
      (createSecureToken as vi.Mock)
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await generateAuthTokens(mockUser);

      expect(createSecureToken).toHaveBeenNthCalledWith(1, {
        userId: mockUser.userId,
        tokenType: 'accessToken'
      }, ACCESS_TOKEN_EXPIRY);
      expect(createSecureToken).toHaveBeenNthCalledWith(2, {
        userId: mockUser.userId,
        tokenType: 'refreshToken'
      }, REFRESH_TOKEN_EXPIRY);
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY
      });
    });
  });

  describe('generateEmailVerifyToken', () => {
    it('should generate an email verification token', async () => {
      const mockVerifyToken = 'verify-token';
      (createSecureToken as vi.Mock).mockResolvedValue(mockVerifyToken);

      const result = await generateEmailVerifyToken(mockUser);

      expect(createSecureToken).toHaveBeenCalledWith({
        userId: mockUser.userId,
        tokenType: 'emailVerifyToken'
      }, EMAIL_VERIFICATION_TOKEN_EXPIRY);
      expect(result).toEqual({ verifyEmailToken: mockVerifyToken });
    });
  });
});