// libs/jwt/signer.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

import { SIGN_SECRET } from '@/config/secrets';

export const signToken = async (payload: JWTPayload, expiresIn: string = '2h'): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SIGN_SECRET);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, SIGN_SECRET);
  return payload;
};
