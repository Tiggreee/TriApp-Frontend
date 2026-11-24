import mongoose from 'mongoose';
import Stripe from 'stripe';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const stripe = config.stripe ? new Stripe(config.stripe.secretKey) : null;

await mongoose.connect(config.mongoUri);
console.log('MongoDB connected');

const server = createApp(config, { stripe }).listen(config.port, () => {
  console.log(`API listening on :${config.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
  });
}
