// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

import { LOG_LEVEL, LOG_TO_CONSOLE } from '@/config/envs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log format
const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
    Object.keys(meta).length ? `| META: ${JSON.stringify(meta)}` : ''
  }`;
});

const levelFilter = (level: string) =>
  winston.format(info => (info.level === level ? info : false))();

// Logger instance
export const logger = winston.createLogger({
  level: LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // capture error stack traces
    winston.format.splat(),
    winston.format.json(),
    logFormat
  ),
  transports: [
    ...(LOG_TO_CONSOLE === 'true'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat),
          }),
        ]
      : []),

    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      level: 'error',
      format: winston.format.combine(levelFilter('error'), logFormat),
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, 'warn-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      level: 'warn',
      format: winston.format.combine(levelFilter('warn'), logFormat),
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: winston.format.combine(levelFilter('info'), logFormat),
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, 'debug-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '7d',
      level: 'debug',
      format: winston.format.combine(levelFilter('debug'), logFormat),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, 'unhandledException.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, 'unhandledRejections.log') }),
  ],
});

export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
