import request from 'supertest';
import app from '../../../app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { getUserData, truncateTables } from '../../utils';
import { User } from '../../../entity/User';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // truncate all the tables
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection?.destroy();
  });
  describe('Given all the fields', () => {
    it('Should return 201', async () => {
      // AAA, Arrange, Act, Assert
      const userData = {
        firstName: 'Hasan',
        lastName: 'Ali',
        email: 'hasan@gmail.com',
        password: 'secret',
      };

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.statusCode).toBe(201);
    });

    it('Should return valid json', async () => {
      // AAA, Arrange, Act, Assert
      const userData = {
        firstName: 'Hasan',
        lastName: 'Ali',
        email: 'hasan@gmail.com',
        password: 'secret',
      };

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });
  it('should persist the user in the database', async () => {
    const userData = getUserData();

    await request(app).post('/auth/register').send(userData);

    // check the data in db
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();

    expect(users.length).toBe(1);
  });
});
