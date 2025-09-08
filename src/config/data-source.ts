import { DataSource } from 'typeorm';
import Config from '.';
import { User } from '../entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.PG_HOST,
  port: +Config.PG_PORT,
  username: Config.PG_USER,
  password: Config.PG_PASSWORD,
  database: Config.PG_DB,
  synchronize: Config.NODE_ENV !== 'prod',
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
