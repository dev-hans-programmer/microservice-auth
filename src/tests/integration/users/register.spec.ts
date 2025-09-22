import request from 'supertest';
import app from '../../../app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { createUserForTest, getUserData } from '../../utils';
import { User } from '../../../entity/User';
import { Roles } from '../../../utils/constants';

describe('POST /auth/register', () => {
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
    it('Should return 201', async () => {
      // AAA, Arrange, Act, Assert
      const userData = {
        firstName: 'Hasan',
        lastName: 'Ali',
        email: 'hasan@gmail.com',
        password: 'secret',
      };

      const response = await request(app).post('/auth').send(userData);
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

      const response = await request(app).post('/auth').send(userData);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });
  it('should persist the user in the database', async () => {
    const userData = getUserData();

    await request(app).post('/auth').send(userData);

    // check the data in db
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();

    expect(users.length).toBe(1);
    expect(users[0]?.email).toBe(userData.email);
  });
  it('Should return id of the created user', async () => {
    const userData = getUserData();
    const createdUser = await createUserForTest();

    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();

    expect(users.length).toBe(1);
    expect(users[0]?.email).toBe(userData.email);
    expect(createdUser.body).toHaveProperty('id');
  });
  it('Should have customer role', async () => {
    // const userData = getUserData();
    await createUserForTest();

    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();

    expect(users[0]).toHaveProperty('role');
    expect(users[0]?.role).toBe(Roles.CUSTOMER);
  });
  it('It should store the hashed password', async () => {
    const userData = getUserData();
    await createUserForTest(userData);

    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();

    expect(users[0]?.password).not.toBe(userData.password);
    expect(users[0]?.password).toHaveLength(60);
    expect(users[0]?.password).toMatch(/^\$2b\$\d+\$/);
    // expect(users[0]?.password).toBe(await hashPassword(userData.password));
  });
  it('It should return 400 if email already exists', async () => {
    const userData = getUserData();

    const userRepository = connection.getRepository(User);
    await userRepository.save({
      ...userData,
      role: Roles.CUSTOMER,
    });

    const response = await createUserForTest(userData);

    expect(response.statusCode).toBe(400);
  });
});
