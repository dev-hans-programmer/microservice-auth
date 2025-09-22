import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../app';
import logger from '../../config/logger';

export const truncateTables = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    await connection.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
    );
  }

  //   await Promise.all(
  //     entities.map((entity) => connection.getRepository(entity.name).clear()),
  //   );
};

export const getUserData = () => ({
  firstName: 'Hasan',
  lastName: 'Ali',
  email: 'hasan@gmail.com',
  password: 'secret',
});

export const createUserForTest = async (userData = getUserData()) =>
  await request(app).post('/auth').send(userData);

export const isJWT = (token: string | null) => {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length < 3) return false;

  try {
    parts.forEach((part) => {
      Buffer.from(part, 'base64').toString('utf-8');
    });
    return true;
  } catch (err: unknown) {
    logger.error(err);
    return false;
  }
};
