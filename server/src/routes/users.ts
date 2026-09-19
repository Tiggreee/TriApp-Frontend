import { Router } from 'express';
import { notFound } from '../errors.js';
import { User } from '../models/User.js';

export const usersRouter = Router();

usersRouter.get('/me', async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw notFound('User not found');
  res.json({ _id: user.id, email: user.email, name: user.name, premium: user.premium });
});
