import { config } from 'dotenv';
import path from 'path';
import { z } from 'zod';

const env = process.env.NODE_ENV;

const file = env ? `.env.${env}` : '.env';

const fullPath = path.join(__dirname, `../../${file}`);

config({ path: fullPath });

const envSchema = z.object({
  PORT: z.string().default('5501'),
  NODE_ENV: z.enum(['dev', 'prod', 'qa', 'test']).default('dev'),

  PG_HOST: z.string(),
  PG_PORT: z.string().default('5432'),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DB: z.string(),
});

const Config = envSchema.parse(process.env);

export default Config;
