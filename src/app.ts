import 'reflect-metadata';
import express from 'express';
import createHttpError from 'http-errors';

import { StatusCodes } from 'http-status-codes';
import { authRouter } from './routes/auth';
import { globalErrorHandler } from './middleware/global-error-handler';

const app = express();

app.use(express.json());

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, _res, _next) => {
  throw createHttpError(
    StatusCodes.BAD_REQUEST,
    `Can't find route ${req.originalUrl} on the server global`,
  );
});

app.use(globalErrorHandler);

export default app;
