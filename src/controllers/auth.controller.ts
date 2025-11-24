import Config from '../config';
import createHttpError from 'http-errors';

import { Request, Response } from 'express';
import { Logger } from 'winston';

import { JwtPayload } from 'jsonwebtoken';

import { LoginUserInput, RegisterUserInput } from '../schema/auth.schema';
import { UserService } from '../services/user.service';
import { Roles } from '../utils/constants.util';
import { comparePassword, hashPassword } from '../utils/security.util';
import { TokenService } from '../services/token.service';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
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
      tenant: user.tenant ? user.tenant : '',
    };

    const newRefreshToken = await this.tokenService.persist(user);

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken({
      ...payload,
      id: String(newRefreshToken.id),
    });

    res.cookie('accessToken', accessToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: Config.ACCESS_TOKEN_COOKIE_EXP_IN_MS, // 1 hour,
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: Config.REFRESH_TOKEN_COOKIE_EXP_IN_MS, // 365 days,
      httpOnly: true,
    });

    res.status(201).json({ message: 'User created', id: user.id });
  };
  login = async (req: Request, res: Response) => {
    //
    const { email, password } = req.body as LoginUserInput;

    const user = await this.userService.findOne({ email }, 'tenant');
    if (!user) throw createHttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch)
      throw createHttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');

    const payload: JwtPayload = {
      sub: String(user.id),
      role: user.role,
      tenant: user.tenant ? user.tenant.id : '',
    };
    const newRefreshToken = await this.tokenService.persist(user);

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken({
      ...payload,
      id: String(newRefreshToken.id),
    });

    res.cookie('accessToken', accessToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: Config.ACCESS_TOKEN_COOKIE_EXP_IN_MS, // 1 hour,
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: Config.REFRESH_TOKEN_COOKIE_EXP_IN_MS, // 365 days,
      httpOnly: true,
    });

    res.json({ message: 'Login Successful' });
  };

  getMe = async (req: Request, res: Response) => {
    const user = await this.userService.findById(+req.auth.sub);
    if (!user) throw createHttpError(StatusCodes.NOT_FOUND, 'User not found');

    res.json({ ...user, password: undefined });
  };
  logout = async (req: Request, res: Response) => {
    await this.tokenService.deleteRefreshToken(Number(req.auth.id));
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({});
  };
}
