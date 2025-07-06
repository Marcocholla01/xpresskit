// config/secrets.ts
import { JWT_ENCRYPT_SECRET, JWT_SIGN_SECRET } from './envs';

const encoder = new TextEncoder();

export const SIGN_SECRET = encoder.encode(JWT_SIGN_SECRET!);
export const ENCRYPT_SECRET = encoder.encode(JWT_ENCRYPT_SECRET!);
