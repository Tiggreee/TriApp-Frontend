import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';
import { spanishColorName } from '../src/lib/colors';
import {
  dayKey,
  isTrialActive,
  loadTrial,
  MAX_TRIALS_PER_DAY,
  startTrial,
  stopTrial,
  TRIAL_MS,
} from '../src/lib/trial';
import { SessionProvider } from '../src/state/session';

function renderApp(path = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function solveGate(user: ReturnType<typeof userEvent.setup>) {
  const dialog = await screen.findByRole('dialog', { name: /solo para papás/i });
  const question = within(dialog).getByText(/= \?/).textContent ?? '';
  const [, a, b, c] = question.match(/(\d+) × (\d+) − (\d+)/) ?? [];
  await user.type(within(dialog).getByRole('textbox'), String(Number(a) * Number(b) - Number(c)));
  await user.click(within(dialog).getByRole('button', { name: /soy un adulto/i }));
}

describe('Renatown', () => {
  it('greets and lists every place in town', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /hola/i })).toBeInTheDocument();
    for (const name of [
      'Sala de Conciertos',
      'Arcade Renatown',
      'Taller de Colores',
      'Foto Mágica',
      'Salón Brillos',
      'Casita de Consejos',
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('keeps grown-up-only places behind the parent gate, then opens Premium', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: /salón brillos/i }));
    expect(await screen.findByRole('dialog', { name: /solo para papás/i })).toBeInTheDocument();

    await solveGate(user);
    expect(await screen.findByRole('heading', { name: /zona de papás/i })).toBeInTheDocument();
  });

  it('rejects a wrong answer and asks a new question', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: /zona de papás/i }));
    const dialog = await screen.findByRole('dialog', { name: /solo para papás/i });
    await user.type(within(dialog).getByRole('textbox'), '1');
    await user.click(within(dialog).getByRole('button', { name: /soy un adulto/i }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/esa no era/i);
  });

  it('locks the extra pop groups until Premium is active', async () => {
    const user = userEvent.setup();
    renderApp('/games');
    expect(await screen.findByRole('radio', { name: /chispa club/i })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: /luna gomita/i }));
    expect(await screen.findByRole('dialog', { name: /solo para papás/i })).toBeInTheDocument();
  });
});

describe('Premium trial', () => {
  it('allows three 5-minute trials a day', () => {
    const now = new Date('2026-09-19T10:00:00').getTime();
    let data = loadTrial(now);
    for (let i = 0; i < MAX_TRIALS_PER_DAY; i++) {
      const started = startTrial(data, now);
      expect(started).not.toBeNull();
      data = stopTrial(started ?? data);
    }
    expect(startTrial(data, now)).toBeNull();
  });

  it('expires after five minutes and resets the next day', () => {
    const now = new Date('2026-09-19T10:00:00').getTime();
    const started = startTrial(loadTrial(now), now);
    expect(started && isTrialActive(started, now + TRIAL_MS - 1)).toBe(true);
    expect(started && isTrialActive(started, now + TRIAL_MS)).toBe(false);
    expect(dayKey(new Date('2026-09-19T23:59:00'))).not.toBe(
      dayKey(new Date('2026-09-20T00:01:00')),
    );
  });
});

describe('colour names', () => {
  it('speaks colours in Spanish', () => {
    expect(spanishColorName('#FF0000')).toBe('rojo');
    expect(spanishColorName('#00FF00')).toBe('verde');
    expect(spanishColorName('#0000FF')).toBe('azul');
    expect(spanishColorName('#FFFF00')).toBe('amarillo');
    expect(spanishColorName('#000000')).toBe('negro');
    expect(spanishColorName('#FFFFFF')).toBe('blanco');
  });
});
