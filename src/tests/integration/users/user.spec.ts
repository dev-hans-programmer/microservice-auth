import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { createUserForTest } from '../../utils';
import app from '../../../app';

describe('POST /auth/self', () => {
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
    it('The self endpoint should exist', async () => {
      const response = await request(app).get('/auth/self');
      expect(response.statusCode).not.toBe(404);
    });
    it('Should return user data', async () => {
      const signUpResponse = await createUserForTest();

      const signUpData = signUpResponse.body as {
        id: number;
        role: string;
      };
      let accessToken = null;

      const cookies =
        (signUpResponse.headers['set-cookie'] as unknown as string[]) || [];

      cookies.forEach((cookie) => {
        if (cookie.startsWith('accessToken=')) {
          accessToken = cookie.split(';')[0]?.split('=')[1] || '';
        }
      });

      const selfResponse = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();
      expect((selfResponse.body as { id: number }).id).toBe(signUpData.id);
    });
  });
  describe('Fields are missing', () => {});

  describe('Fields are not in proper format', () => {});
});
