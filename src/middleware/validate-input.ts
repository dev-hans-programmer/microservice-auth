import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { ZodType, z } from 'zod';

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = err.issues.map((issue) => issue.message).join('|');

        throw createHttpError(StatusCodes.BAD_REQUEST, error);
      }
    }
  };
