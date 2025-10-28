import express from 'express';
import authenticate from '../middleware/authenticate';
import authrorize from '../middleware/authorize';

import { validateRequest } from '../middleware/validate-input';
import { userInSchema } from '../schema/user.schema';
import { Roles } from '../utils/constants.util';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';

const userRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post(
  '/',
  validateRequest(userInSchema),
  authenticate,
  authrorize(Roles.ADMIN, Roles.MANAGER),
  userController.create,
);

export default userRouter;
