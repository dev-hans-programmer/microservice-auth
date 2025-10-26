import express from 'express';
import { TenantController } from '../controllers/tenant-controller';

const tenantRouter = express.Router();

const tenantController = new TenantController();

tenantRouter.route('/').post(tenantController.create);

export default tenantRouter;
