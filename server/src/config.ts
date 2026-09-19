import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/triapp'),
  JWT_SECRET: z.string().min(16).optional(),
  CORS_ORIGIN: z.string().default('*'),
  WEB_URL: z.string().default('http://localhost:5173'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export interface Config {
  env: 'development' | 'test' | 'production';
  port: number;
  mongoUri: string;
  jwtSecret: string;
  corsOrigin: string[] | '*';
  webUrl: string;
  stripe: { secretKey: string; priceId: string; webhookSecret?: string } | null;
}

export function loadConfig(source: NodeJS.ProcessEnv = process.env): Config {
  const env = schema.parse(
    Object.fromEntries(Object.entries(source).filter(([, v]) => v !== undefined && v !== '')),
  );

  if (env.NODE_ENV === 'production' && !env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
  }

  const stripe =
    env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID
      ? {
          secretKey: env.STRIPE_SECRET_KEY,
          priceId: env.STRIPE_PRICE_ID,
          webhookSecret: env.STRIPE_WEBHOOK_SECRET,
        }
      : null;

  return {
    env: env.NODE_ENV,
    port: env.PORT,
    mongoUri: env.MONGODB_URI,
    jwtSecret: env.JWT_SECRET ?? 'dev-only-secret-not-for-production',
    corsOrigin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    webUrl: env.WEB_URL,
    stripe,
  };
}
