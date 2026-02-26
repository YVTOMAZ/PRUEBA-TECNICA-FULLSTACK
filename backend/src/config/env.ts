import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/crypto-app'),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COINPAPRIKA_BASE_URL: z.string().default('https://api.coinpaprika.com/v1'),
});

export const env = envSchema.parse(process.env);
