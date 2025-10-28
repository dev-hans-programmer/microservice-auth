import { UserIn } from '../schema/user.schema';
import { UserService } from '../services/user.service';
import { BaseController, ControllerHandler } from '../utils/response.util';
import { hashPassword } from '../utils/security.util';

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  create: ControllerHandler = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body as UserIn;

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role,
    });

    this.sendResponse(res, { id: user.id }, 201);
  };
}
