import { Request, Response } from 'express';
import { RegisterUserInput } from '../schema/user';
import { UserService } from '../services/user-service';

export class AuthController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response) => {
    const user = await this.userService.create(req.body as RegisterUserInput);

    res.status(201).json({ message: 'User created', id: user.id });
  };
}
