import express from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/tenant.entity';
import { TenantService } from '../services/tenant.service';
import { validateRequest } from '../middleware/validate-input';
import { tenantInSchema } from '../schema/tenant.schema';

const tenantRouter = express.Router();

const tokenRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tokenRepository);

const tenantController = new TenantController(tenantService);

tenantRouter
  .route('/')
  .post(validateRequest(tenantInSchema), tenantController.create);

export default tenantRouter;
