import { Request, Response } from 'express';
import { RegisterUserInput } from '../schema/user';
import { UserService } from '../services/user-service';
import { Logger } from 'winston';
import { Roles } from '../utils/constants';
import { hashPassword } from '../utils/security';

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

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role: Roles.CUSTOMER,
    });

    res.status(201).json({ message: 'User created', id: user.id });
  };
}
