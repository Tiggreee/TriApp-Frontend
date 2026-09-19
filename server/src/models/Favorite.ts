import { model, Schema } from 'mongoose';

export const FAVORITE_TYPES = ['music', 'color', 'avatar', 'makeup', 'consejos', 'game'] as const;

const favoriteSchema = new Schema({
  type: { type: String, required: true, enum: FAVORITE_TYPES },
  data: { type: Schema.Types.Mixed, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'user', required: true, select: false },
  createdAt: { type: Date, default: Date.now },
});

export const Favorite = model('favorite', favoriteSchema);
