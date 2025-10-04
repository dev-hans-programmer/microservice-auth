import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { createUserForTest } from '../../utils';
import app from '../../../app';

describe('POST /auth/login', () => {
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
    it('Login endpoint exist', async () => {
      const loginData = {
        email: 'hans@gmail.com',
        password: 'secret',
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.statusCode).not.toBe(404);
    });

    it('Should returns 401 if user does not exist', async () => {
      const loginData = {
        email: 'hans@gmail.com',
        password: 'secret',
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.statusCode).toBe(401);
    });

    it('Should return 401 if password is wrong', async () => {
      await createUserForTest();
      const loginData = {
        email: 'hasan@gmail.com',
        password: 'secret12',
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.statusCode).toBe(401);
    });

    it('Should successfully login and returns token in the cookie', async () => {
      await createUserForTest();
      const loginData = {
        email: 'hasan@gmail.com',
        password: 'secret',
      };
      const response = await request(app).post('/auth/login').send(loginData);
      expect(response.statusCode).toBe(200);
    });
  });
  describe('Fields are missing', () => {});

  describe('Fields are not in proper format', () => {});
});
