import createHttpError from 'http-errors';
import { UserIn } from '../schema/user.schema';
import { TenantService } from '../services/tenant.service';
import { UserService } from '../services/user.service';
import { BaseController, ControllerHandler } from '../utils/response.util';
import { hashPassword } from '../utils/security.util';
import { StatusCodes } from 'http-status-codes';

export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
  ) {
    super();
  }

  create: ControllerHandler = async (req, res) => {
    const { firstName, lastName, email, password, role, tenantId } =
      req.body as UserIn;

    // check if tenant exists
    const tenant = await this.tenantService.findById(tenantId);

    if (!tenant)
      throw createHttpError(StatusCodes.NOT_FOUND, 'Tenant does not exist');

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role,
      tenant: tenantId ? { id: tenantId } : null,
    });

    this.sendResponse(res, { id: user.id }, 201);
  };
}
