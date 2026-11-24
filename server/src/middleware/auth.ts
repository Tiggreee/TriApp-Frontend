import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { unauthorized } from '../errors.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth =
  (secret: string): RequestHandler =>
  (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw unauthorized('Authorization required');

    try {
      const payload = jwt.verify(header.slice(7), secret);
      if (typeof payload === 'string' || typeof payload._id !== 'string') throw new Error();
      req.userId = payload._id;
    } catch {
      throw unauthorized('Invalid token');
    }
    next();
  };
