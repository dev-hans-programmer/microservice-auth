import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import logger from './config/logger';
import { StatusCodes } from 'http-status-codes';
import { authRouter } from './routes/auth';

const app = express();

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
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        path: '',
        location: '',
        msg: err.message,
      },
    ],
  });
});

export default app;
