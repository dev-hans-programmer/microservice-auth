import express from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../middleware/validate-input';
import { loginSchema, registerUserSchema } from '../schema/user';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user';
import { UserService } from '../services/user-service';
import logger from '../config/logger';
import { TokenService } from '../services/token-service';
import { RefreshToken } from '../entity/refresh-token';
import authenticate from '../middleware/authenticate';

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
