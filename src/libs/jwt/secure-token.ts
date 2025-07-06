// libs/jwt/secure-token.ts
import { decryptToken, encryptPayload } from './encryptor';
import { signToken, verifyToken } from './signer';

import type { JWTPayload } from 'jose';

export const createSecureToken = async (
  payload: JWTPayload,
  expiresIn: string = '2h'
): Promise<string> => {
  const signed = await signToken(payload, expiresIn);
  const encrypted = await encryptPayload({ token: signed }, expiresIn);
  return encrypted;
};

export const verifySecureToken = async (token: string) => {
  try {
    const decrypted = await decryptToken(token);
    const signedJWT = decrypted.token as string;

    const verifiedPayload = await verifyToken(signedJWT);
    return { success: true, payload: verifiedPayload };
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('🔐 JWT Error:', err);
    }
    return { success: false, message: err?.message || 'Invalid token' };
  }
};
