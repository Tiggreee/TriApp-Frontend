import express, { Router } from 'express';
import type Stripe from 'stripe';
import type { Config } from '../config.js';
import { HttpError, notFound } from '../errors.js';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

export type StripeClient = Pick<Stripe, 'checkout' | 'webhooks'>;

const unavailable = () => new HttpError(503, 'Payments are not configured');

// Premium is bought by an adult: Stripe Checkout collects the cardholder details and email,
// which is the "a grown-up paid" check. Nothing about the child is collected.
export function billingRouter(config: Config, stripe: StripeClient | null) {
  const router = Router();

  router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe || !config.stripe?.webhookSecret) throw unavailable();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'] as string,
        config.stripe.webhookSecret,
      );
    } catch {
      throw new HttpError(400, 'Invalid signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.client_reference_id && session.payment_status === 'paid') {
        await User.findByIdAndUpdate(session.client_reference_id, { premium: true });
      }
    }
    res.json({ received: true });
  });

  router.post('/checkout', requireAuth(config.jwtSecret), async (req, res) => {
    if (!stripe || !config.stripe) throw unavailable();
    const user = await User.findById(req.userId);
    if (!user) throw notFound('User not found');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: config.stripe.priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      success_url: `${config.webUrl}/premium?status=success`,
      cancel_url: `${config.webUrl}/premium?status=cancelled`,
    });
    res.json({ url: session.url });
  });

  return router;
}
