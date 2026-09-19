import { Router } from 'express';
import { z } from 'zod';
import { forbidden, notFound } from '../errors.js';
import { validate } from '../middleware/validate.js';
import { FAVORITE_TYPES, Favorite } from '../models/Favorite.js';

const createBody = z.object({
  type: z.enum(FAVORITE_TYPES),
  data: z.record(z.string(), z.unknown()),
});
const idParams = z.object({ id: z.string().regex(/^[0-9a-f]{24}$/i) });

export const favoritesRouter = Router();

favoritesRouter.get('/', async (req, res) => {
  res.json(await Favorite.find({ owner: req.userId }).sort({ createdAt: -1 }));
});

favoritesRouter.post('/', validate({ body: createBody }), async (req, res) => {
  const { type, data } = req.body as z.infer<typeof createBody>;
  const favorite = await Favorite.create({ type, data, owner: req.userId });
  res.status(201).json(favorite);
});

favoritesRouter.delete('/:id', validate({ params: idParams }), async (req, res) => {
  const favorite = await Favorite.findById(req.params.id).select('+owner');
  if (!favorite) throw notFound('Favorite not found');
  if (favorite.owner.toString() !== req.userId) {
    throw forbidden('Cannot delete another user favorite');
  }
  await favorite.deleteOne();
  res.json({ message: 'Favorite deleted' });
});
