import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

const authrorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // find user by id
    if (!roles.includes(req.auth.role))
      throw createHttpError(StatusCodes.FORBIDDEN, 'Unathorized');
    // check role
    next();
    // if present then allow otherwise through 403
  };

export default authrorize;
