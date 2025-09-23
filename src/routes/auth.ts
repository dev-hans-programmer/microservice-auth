import express from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../middleware/validate-input';
import { registerUserSchema } from '../schema/user';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user';
import { UserService } from '../services/user-service';
import logger from '../config/logger';

const router = express.Router();

const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);

const authController = new AuthController(userService, logger);

router.post('/', validateRequest(registerUserSchema), authController.register);

export { router as authRouter };
