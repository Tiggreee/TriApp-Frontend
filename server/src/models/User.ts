import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, minlength: 2, maxlength: 30, trim: true },
  premium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('user', userSchema);
