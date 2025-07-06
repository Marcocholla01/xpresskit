import { loadEnv } from '@/libs/load-env';

const env = loadEnv();

if (!env) {
  process.exit(1);
}

// Export validated variables
export const PORT = Number(env.PORT || 5000);
export const DATABASE_URL = env.DATABASE_URL;
export const FRONTEND_URL = env.FRONTEND_URL;
export const NODE_ENV = env.NODE_ENV;

export const SMTP_MAIL = env.SMTP_MAIL;
export const SMTP_HOST = env.SMTP_HOST;
export const SMTP_PASSWORD = env.SMTP_PASSWORD;
export const SMTP_PORT = env.SMTP_PORT;
export const SMTP_SECURE = env.SMTP_SECURE;

export const JWT_SIGN_SECRET = env.JWT_SIGN_SECRET;
export const JWT_ENCRYPT_SECRET = env.JWT_ENCRYPT_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRY = env.JWT_ACCESS_TOKEN_EXPIRY;
export const JWT_REFRESH_TOKEN_EXPIRY = env.JWT_REFRESH_TOKEN_EXPIRY;

export const LOG_LEVEL = env.LOG_LEVEL;
export const LOG_TO_CONSOLE = env.LOG_TO_CONSOLE;
