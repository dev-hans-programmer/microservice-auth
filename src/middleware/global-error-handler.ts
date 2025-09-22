/* eslint-disable */

import { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

const handleDuplicateKeyDb = (detail: string): HttpError => {
  const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
  if (match) {
    const [_, field, value] = match;
    return createHttpError(
      StatusCodes.BAD_REQUEST,
      `${field} "${value}" already exists`,
    );
  }

  return createHttpError(StatusCodes.BAD_REQUEST, 'Duplicate key error');
};

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Default error structure
  let error = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    status: 'error',
    message: 'Something went wrong',
    stack: undefined as string | undefined,
  };

  console.log({ errorName: err.name });

  // Handle known HttpError instances
  if (err instanceof HttpError) {
    error.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = err.status.toString().startsWith('4') ? 'fail' : 'error';
    error.message = err.message;
    error.stack = err.stack;
  }

  // Handle specific database errors (PostgreSQL unique constraint)
  if ((err as any)?.code === '23505') {
    const dbError = handleDuplicateKeyDb((err as any).detail);
    error.statusCode = dbError.statusCode;
    error.message = dbError.message;
    error.status = 'fail';
  }
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  });
};
