import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import app from '../../../app';

describe('POST /tenants', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // truncate all the tables
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
  });

  afterAll(async () => {
    await connection?.destroy();
  });
  describe('Given all the fields', () => {
    // login tests
    it('Should return 201', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      };
      const response = await request(app).post('/tenants').send(tenantData);

      expect(response.statusCode).toBe(201);
    });
  });
  describe('Fields are missing', () => {});

  describe('Fields are not in proper format', () => {});
});
