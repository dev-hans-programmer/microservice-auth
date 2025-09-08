import express from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../middleware/validate-input';
import { registerUserSchema } from '../schema/user';

const router = express.Router();

const authController = new AuthController();

router.post(
  '/register',
  validateRequest(registerUserSchema),
  authController.register,
);

export { router as authRouter };
