import { NextFunction, Request, Response } from 'express';

export abstract class BaseController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected sendResponse(res: Response, data: any, status = 200) {
    res.status(status).json(data);
  }
}

export type ControllerHandler = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => Promise<void>;
