import { config } from 'dotenv';
import path from 'path';
import { string, z } from 'zod';

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

  REFRESH_TOKEN_SECRET: string().default('myrefreshtokensecretkey'),
  ACCESS_TOKEN_ALGO: z.string().default('RS256'),
  ACCESS_TOKEN_EXPIRY: z.string().default('1h'),
  ACCESS_TOKEN_COOKIE_EXP_IN_MS: z.number().default(1000 * 60 * 60),
  REFRESH_TOKEN_COOKIE_EXP_IN_MS: z.number().default(1000 * 60 * 60 * 24 * 365),

  JWKS_URI: z.string(),

  USE_SECRET_MANAGER: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .default(false),
});

const Config = envSchema.parse(process.env);

export default Config;
