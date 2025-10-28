import express from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/tenant.entity';
import { TenantService } from '../services/tenant.service';
import { validateRequest } from '../middleware/validate-input';
import { tenantInSchema } from '../schema/tenant.schema';
import authenticate from '../middleware/authenticate';
import authrorize from '../middleware/authorize';
import { Roles } from '../utils/constants.util';

const tenantRouter = express.Router();

const tokenRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tokenRepository);

const tenantController = new TenantController(tenantService);

tenantRouter
  .route('/')
  .post(
    authenticate,
    authrorize(Roles.ADMIN),
    validateRequest(tenantInSchema),
    tenantController.create,
  );

export default tenantRouter;
