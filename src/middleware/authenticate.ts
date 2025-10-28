import Config from '../config';

import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

export default expressjwt({
  secret: expressJwtSecret({
    jwksUri: Config.JWKS_URI,
    cache: true,
    rateLimit: true,
  }),
  algorithms: ['RS256'],
  getToken: (req: Request) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }

    type AuthCookie = {
      accessToken: string;
    };

    const { accessToken } = req.cookies as AuthCookie;

    return accessToken;
  },
});
