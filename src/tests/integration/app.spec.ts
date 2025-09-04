import request from 'supertest';
import app from '../../app';

describe('App', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
  });
});
