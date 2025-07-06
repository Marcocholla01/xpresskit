import * as jose from 'jose';

import { ERROR_CODES } from '@/config/constants';

export const handleJwtError = (err: unknown) => {
  if (err instanceof jose.errors.JWTExpired) {
    return {
      statusCode: 401,
      message: 'Token has expired',
      errorCode: ERROR_CODES.ACCESS_TOKEN_EXPIRED,
    };
  }

  if (err instanceof jose.errors.JWTInvalid) {
    return {
      statusCode: 401,
      message: 'Invalid token',
      errorCode: ERROR_CODES.ACCESS_TOKEN_INVALID,
    };
  }

  if (err instanceof jose.errors.JWSInvalid) {
    return {
      statusCode: 401,
      message: 'JWS is invalid',
      errorCode: ERROR_CODES.ACCESS_TOKEN_INVALID,
    };
  }

  if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
    return {
      statusCode: 401,
      message: 'Token signature verification failed',
      errorCode: ERROR_CODES.TOKEN_VERIFICATION_FAILED,
    };
  }

  if (err instanceof jose.errors.JWTClaimValidationFailed) {
    return {
      statusCode: 401,
      message: `JWT claim validation failed: ${err.message}`,
      errorCode: ERROR_CODES.TOKEN_VERIFICATION_FAILED,
    };
  }

  return null; // Not a JWT-related error
};
