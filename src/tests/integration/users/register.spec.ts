import request from 'supertest';
import app from '../../../app';

describe('POST /auth/register', () => {
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
});
