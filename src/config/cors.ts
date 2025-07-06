import { FRONTEND_URL } from './envs';

import type { CorsOptions } from 'cors';

const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(new Error('Requests without origin are blocked'), false);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Restrict certain methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204, // Avoid unnecessary response bodies for preflight
};
