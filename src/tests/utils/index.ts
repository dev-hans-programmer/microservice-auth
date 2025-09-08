import { DataSource } from 'typeorm';

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

export const createUser = () => {};
export const getUserData = () => ({
  firstName: 'Hasan',
  lastName: 'Ali',
  email: 'hasan@gmail.com',
  password: 'secret',
});
