import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { Config } from '../config.js';
import { conflict, unauthorized } from '../errors.js';
import { validate } from '../middleware/validate.js';
import { User } from '../models/User.js';

const signupBody = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(2).max(30),
});
const signinBody = z.object({ email: z.email(), password: z.string().min(1).max(72) });

export function authRouter(config: Config) {
  const router = Router();
  const session = (user: { id: string; email: string; name: string; premium: boolean }) => ({
    token: jwt.sign({ _id: user.id }, config.jwtSecret, { expiresIn: '7d' }),
    _id: user.id,
    email: user.email,
    name: user.name,
    premium: user.premium,
  });

  router.post('/signup', validate({ body: signupBody }), async (req, res) => {
    const { email, password, name } = req.body as z.infer<typeof signupBody>;
    if (await User.exists({ email: email.toLowerCase() })) {
      throw conflict('Email already registered');
    }
    const user = await User.create({ email, name, password: await bcrypt.hash(password, 12) });
    res.status(201).json(session(user));
  });

  router.post('/signin', validate({ body: signinBody }), async (req, res) => {
    const { email, password } = req.body as z.infer<typeof signinBody>;
    const user = await User.findOne({ $or: [{ email }, { email: email.toLowerCase() }] }).select(
      '+password',
    );
    const matched = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !matched) throw unauthorized('Incorrect email or password');
    res.json(session(user));
  });

  return router;
}
