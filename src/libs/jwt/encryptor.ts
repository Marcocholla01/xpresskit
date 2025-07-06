// libs/jwt/encryptor.ts
import { EncryptJWT, jwtDecrypt } from 'jose';

import { ENCRYPT_SECRET } from '@/config/secrets';

export const encryptPayload = async (
  payload: Record<string, any>,
  expiresIn: string = '2h'
): Promise<string> => {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .encrypt(ENCRYPT_SECRET);
};

export const decryptToken = async (token: string): Promise<Record<string, any>> => {
  const { payload } = await jwtDecrypt(token, ENCRYPT_SECRET);
  return payload;
};
