import path from 'path';
import fs from 'fs/promises';

import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, sign } from 'jsonwebtoken';
import Config from '../config';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/refreshToken.entity';
import { User } from '../entity/user.entity';

export class TokenService {
  constructor(private readonly tokenRepository: Repository<RefreshToken>) {}
  generateAccessToken = async (payload: JwtPayload) => {
    try {
      const privateKey = await fs.readFile(path.resolve('certs/private.pem'));

      const token = sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      });

      return token;
    } catch (err: unknown) {
      const error = err as Error;

      throw createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  };
  generateRefreshToken = (payload: JwtPayload) => {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'auth-service',
      jwtid: String(payload.id),
    });
    return refreshToken;
  };
  persist = async (user: User) => {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

    // Here we are manually creating instance of entity
    // so that it runs any other entity logic
    // but if we save method directly, it skips many internal checks
    // like hooks, validations etc
    const tokenEntity = this.tokenRepository.create({
      user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });

    return await this.tokenRepository.save(tokenEntity);
  };
  deleteRefreshToken = async (tokenId: number) =>
    await this.tokenRepository.delete({ id: tokenId });
}
