import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { User } from '../src/models/User.js';
import type { StripeClient } from '../src/routes/billing.js';

let mongo: MongoMemoryServer;

const config = loadConfig({
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret-that-is-long-enough',
  STRIPE_SECRET_KEY: 'sk_test_x',
  STRIPE_PRICE_ID: 'price_x',
  STRIPE_WEBHOOK_SECRET: 'whsec_x',
});

const fakeStripe = {
  checkout: { sessions: { create: async () => ({ url: 'https://pay.example/session' }) } },
  webhooks: {
    constructEvent: (body: Buffer, signature: string) => {
      if (signature !== 'good') throw new Error('bad signature');
      return JSON.parse(body.toString());
    },
  },
} as unknown as StripeClient;

const app = createApp(config, { stripe: fakeStripe });
const bareApp = createApp(loadConfig({ NODE_ENV: 'test' }));

const account = { email: 'Renata@Example.com', password: 'unicornio123', name: 'Renata' };

async function signup(body = account) {
  return request(app).post('/signup').send(body);
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await User.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  await User.init();
});

describe('auth', () => {
  it('signup returns a session the client can use straight away', async () => {
    const res = await signup();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'renata@example.com', name: 'Renata', premium: false });
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.password).toBeUndefined();
  });

  it('rejects duplicate emails regardless of case', async () => {
    await signup();
    const res = await signup({ ...account, email: 'RENATA@example.com' });
    expect(res.status).toBe(409);
  });

  it('validates input', async () => {
    expect((await signup({ ...account, password: 'short' })).status).toBe(400);
    expect((await signup({ ...account, email: 'nope' })).status).toBe(400);
  });

  it('signin returns the same session shape and refuses bad passwords', async () => {
    await signup();
    const ok = await request(app)
      .post('/signin')
      .send({ email: account.email, password: account.password });
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ name: 'Renata', email: 'renata@example.com' });
    expect(ok.body.token).toEqual(expect.any(String));

    const bad = await request(app)
      .post('/signin')
      .send({ email: account.email, password: 'wrongwrong' });
    expect(bad.status).toBe(401);
  });

  it('protects private routes', async () => {
    expect((await request(app).get('/users/me')).status).toBe(401);
    expect((await request(app).get('/users/me').set('Authorization', 'Bearer nope')).status).toBe(
      401,
    );
  });
});

describe('favorites', () => {
  it('supports every section of the app, scoped per owner', async () => {
    const { body: me } = await signup();
    const auth = { Authorization: `Bearer ${me.token}` };

    for (const type of ['music', 'color', 'avatar', 'makeup', 'consejos', 'game']) {
      const res = await request(app)
        .post('/favorites')
        .set(auth)
        .send({ type, data: { id: type } });
      expect(res.status).toBe(201);
    }
    const list = await request(app).get('/favorites').set(auth);
    expect(list.body).toHaveLength(6);
    expect(list.body[0].owner).toBeUndefined();

    const other = await signup({ ...account, email: 'otro@example.com' });
    const otherAuth = { Authorization: `Bearer ${other.body.token}` };
    expect((await request(app).get('/favorites').set(otherAuth)).body).toHaveLength(0);

    const id = list.body[0]._id;
    expect((await request(app).delete(`/favorites/${id}`).set(otherAuth)).status).toBe(403);
    expect((await request(app).delete(`/favorites/${id}`).set(auth)).status).toBe(200);
    expect((await request(app).delete(`/favorites/${id}`).set(auth)).status).toBe(404);
  });

  it('rejects unknown types and malformed ids', async () => {
    const { body: me } = await signup();
    const auth = { Authorization: `Bearer ${me.token}` };
    expect(
      (await request(app).post('/favorites').set(auth).send({ type: 'nope', data: {} })).status,
    ).toBe(400);
    expect((await request(app).delete('/favorites/not-an-id').set(auth)).status).toBe(400);
  });
});

describe('billing', () => {
  it('is disabled (503) when Stripe is not configured', async () => {
    const { body: me } = await request(bareApp).post('/signup').send(account);
    const res = await request(bareApp)
      .post('/billing/checkout')
      .set('Authorization', `Bearer ${me.token}`);
    expect(res.status).toBe(503);
  });

  it('creates a checkout session for a signed-in adult account', async () => {
    const { body: me } = await signup();
    const res = await request(app)
      .post('/billing/checkout')
      .set('Authorization', `Bearer ${me.token}`);
    expect(res.status).toBe(200);
    expect(res.body.url).toBe('https://pay.example/session');
  });

  it('only unlocks premium from a correctly signed, paid webhook', async () => {
    const { body: me } = await signup();
    const event = JSON.stringify({
      type: 'checkout.session.completed',
      data: { object: { client_reference_id: me._id, payment_status: 'paid' } },
    });
    const post = (sig: string) =>
      request(app)
        .post('/billing/webhook')
        .set('stripe-signature', sig)
        .set('Content-Type', 'application/json')
        .send(event);

    expect((await post('forged')).status).toBe(400);
    expect(
      (await request(app).get('/users/me').set('Authorization', `Bearer ${me.token}`)).body.premium,
    ).toBe(false);

    expect((await post('good')).status).toBe(200);
    expect(
      (await request(app).get('/users/me').set('Authorization', `Bearer ${me.token}`)).body.premium,
    ).toBe(true);
  });
});

describe('config', () => {
  it('refuses to boot in production without a JWT secret', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(/JWT_SECRET/);
  });
});
