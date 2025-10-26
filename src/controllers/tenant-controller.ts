import { BaseController, ControllerHandler } from '../utils/response';

export class TenantController extends BaseController {
  constructor() {
    super();
  }

  create: ControllerHandler = async (req, res) => {
    await Promise.resolve(20);
    res.sendStatus(201);
  };
}
