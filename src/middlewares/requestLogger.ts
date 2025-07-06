// src/middlewares/requestLogger.ts
import { logger } from '@/utils/logger';
import { generateUUID } from '@/utils/uuid';

import type { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateUUID();
  req.requestId = requestId; // Extend Request type if needed

  const meta = {
    id: requestId,
    method: req.method,
    route: req.originalUrl,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    userId: req?.user?.id || 'anonymous', // assuming req.user is set after auth
  };

  logger.info(`📥 Incoming Request`, meta);

  // logger.error('🔥 Error occurred while creating user', { userId: 'abc123' });

  // logger.warn('⚠️ Password attempt failed');

  // logger.info('✅ User successfully registered', { email: 'user@example.com' });

  // logger.http('🌐 HTTP request received', { method: req.method, url: req.originalUrl });

  // logger.verbose('Verbose logging for internal ops');

  // logger.debug('Debugging DB query execution', { query: 'SELECT * FROM users' });

  // logger.silly('Super low-level details here...');

  // Optional: log response on finish
  res.on('finish', () => {
    logger.info(`📤 Responded ${res.statusCode}`, meta);
  });

  next();
};
