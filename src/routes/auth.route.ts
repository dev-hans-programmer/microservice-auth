import express from 'express';
import authenticate from '../middleware/authenticate';
import logger from '../config/logger';

import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate-input';
import { loginSchema, registerUserSchema } from '../schema/auth.schema';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { RefreshToken } from '../entity/refreshToken.entity';

const authRouter = express.Router();

const userRepo = AppDataSource.getRepository(User);
const tokenRepo = AppDataSource.getRepository(RefreshToken);
const userService = new UserService(userRepo);
const tokenService = new TokenService(tokenRepo);

const authController = new AuthController(userService, tokenService, logger);

authRouter.post(
  '/',
  validateRequest(registerUserSchema),
  authController.register,
);
authRouter.post('/login', validateRequest(loginSchema), authController.login);
authRouter.get('/self', authenticate, authController.getMe);

export default authRouter;
