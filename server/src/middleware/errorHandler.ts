import type { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { HttpError } from '../errors.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: err.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  if (err instanceof MongooseError.CastError || err instanceof MongooseError.ValidationError) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ message: 'Request too large' });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Malformed JSON' });
    return;
  }

  req.log?.error({ err }, 'unhandled error');
  res.status(500).json({ message: 'An error occurred on the server' });
};
