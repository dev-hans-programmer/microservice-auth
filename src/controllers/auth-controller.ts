import { Request, Response } from 'express';
import { Logger } from 'winston';
import fs from 'fs/promises';
import path from 'path';

import jwt, { JwtPayload } from 'jsonwebtoken';

import { RegisterUserInput } from '../schema/user';
import { UserService } from '../services/user-service';
import { Roles } from '../utils/constants';
import { hashPassword } from '../utils/security';
import Config from '../config';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/refresh-token';

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  register = async (req: Request, res: Response) => {
    // Try catch not needed in express v5 as the error is automatically passed
    // to global error handler
    this.logger.info('Request comes for registering user');
    const { firstName, lastName, email, password } =
      req.body as RegisterUserInput;

    // const privateKey = (req.app.locals.keys as { privateKey: Buffer })
    //   .privateKey;

    let privateKey: Buffer | undefined;
    try {
      privateKey = await fs.readFile(path.resolve('certs/private.pem'));
    } catch (err: unknown) {
      const error = err as Error;

      throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role: Roles.CUSTOMER,
    });

    const payload: JwtPayload = {
      sub: String(user.id),
      role: user.role,
    };

    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

    const refreshRepo = AppDataSource.getRepository(RefreshToken);
    const newRefreshToken = await refreshRepo.save({
      user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    });
    const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'auth-service',
      jwtid: String(newRefreshToken.id),
    });

    res.cookie('accessToken', accessToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1 hour,
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 26 * 365, // 365 days,
      httpOnly: true,
    });

    res.status(201).json({ message: 'User created', id: user.id });
  };
}
