import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import type { Config } from './config.js';
import { notFound } from './errors.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { billingRouter, type StripeClient } from './routes/billing.js';
import { favoritesRouter } from './routes/favorites.js';
import { usersRouter } from './routes/users.js';

export function createApp(config: Config, deps: { stripe?: StripeClient | null } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  if (config.env !== 'test') app.use(pinoHttp());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/billing', billingRouter(config, deps.stripe ?? null));

  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: config.env === 'test' ? 10_000 : 300 }));
  app.use(express.json({ limit: '20kb' }));

  app.use(authRouter(config));
  const protectedRoutes = requireAuth(config.jwtSecret);
  app.use('/users', protectedRoutes, usersRouter);
  app.use('/favorites', protectedRoutes, favoritesRouter);
  app.use((_req, _res, next) => next(notFound('Resource not found')));

  app.use(errorHandler);
  return app;
}
