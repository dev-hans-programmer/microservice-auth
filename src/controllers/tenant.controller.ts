import createHttpError from 'http-errors';
import { TenantIn } from '../schema/tenant.schema';
import { TenantService } from '../services/tenant.service';
import { BaseController, ControllerHandler } from '../utils/response.util';
import { StatusCodes } from 'http-status-codes';

export class TenantController extends BaseController {
  constructor(private readonly tenantService: TenantService) {
    super();
  }

  create: ControllerHandler = async (req, res) => {
    const { name } = req.body as TenantIn;

    const existingTenant = await this.tenantService.findOne({ name });

    if (existingTenant)
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Tenant already exists with name ${name}`,
      );

    const tenant = await this.tenantService.create(req.body as TenantIn);

    this.sendResponse(res, { tenant }, 201);
  };
}
