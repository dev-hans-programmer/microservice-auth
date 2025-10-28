import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import app from '../../../app';
import { Tenant } from '../../../entity/tenant.entity';
import jwt from 'jsonwebtoken';
import { Roles } from '../../../utils/constants.util';
import fs from 'fs/promises';
import path from 'path';

describe('POST /tenants', () => {
  let connection: DataSource;
  let adminToken: string | null = null;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // truncate all the tables
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
    const privateKey = await fs.readFile(path.resolve('certs/private.pem'));

    adminToken = jwt.sign(
      {
        sub: '1',
        role: Roles.ADMIN,
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      },
    );
  });

  afterAll(async () => {
    await connection?.destroy();
  });
  describe('Given all the fields', () => {
    // login tests
    it('Should return 401 if not authenticated', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      };
      const response = await request(app).post('/tenants').send(tenantData);

      expect(response.statusCode).toBe(401);
    });
    it('Should create a tenant in the database', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      };
      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData);

      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants.length).not.toBe(0);

      expect(response.statusCode).toBe(201);
    });
  });
  describe('Fields are missing', () => {});

  describe('Fields are not in proper format', () => {});
});
