import 'reflect-metadata';
import express from 'express';
import createHttpError from 'http-errors';
import cookieParser from 'cookie-parser';

import { StatusCodes } from 'http-status-codes';
import { globalErrorHandler } from './middleware/global-error-handler';
import tenantRouter from './routes/tenant.route';
import authRouter from './routes/auth.route';

declare module 'express-serve-static-core' {
  interface Request {
    auth: {
      sub: string;
      role: string;
    };
  }
}

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public', { dotfiles: 'allow' }));

// app.use(express.static(path.join(__dirname, '../public'), {dotfiles }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello server' });
});

app.get('/error-route', () => {
  throw createHttpError(
    StatusCodes.UNAUTHORIZED,
    'You cannot access this route',
  );
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, _res, _next) => {
  throw createHttpError(
    StatusCodes.NOT_FOUND,
    `Can't find route ${req.originalUrl} on the server global`,
  );
});

app.use(globalErrorHandler);

export default app;
