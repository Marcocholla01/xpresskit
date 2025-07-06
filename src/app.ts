import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import statusMonitor from 'express-status-monitor';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import { globalErrorHandler } from '@/middlewares/globalErrorHandler';
import { requestLogger } from '@/middlewares/requestLogger';
import authRoutes from '@/routes/auth.routes';
import healthRoutes from '@/routes/health.routes';
import userRoutes from '@/routes/user.routes';
import { loggerStream } from '@/utils/logger';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(statusMonitor());
app.use('/', express.static(join(__dirname, '..', 'public')));
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// app.use(cors(corsOptions));
app.use(hpp());
app.use(morgan('combined', { stream: loggerStream }));
app.use(requestLogger);

app.use('/status', healthRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// make sure its the last one
app.use(globalErrorHandler as (err: any, req: Request, res: Response, next: NextFunction) => void);

export default app;
