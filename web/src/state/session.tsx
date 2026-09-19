import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '../lib/api';
import { isSoundOn, setSoundOn } from '../lib/sound';
import { readJSON, readString, writeString } from '../lib/storage';
import {
  isTrialActive,
  loadTrial,
  MAX_TRIALS_PER_DAY,
  saveTrial,
  startTrial,
  stopTrial,
  type TrialData,
} from '../lib/trial';

type Theme = 'light' | 'dark';

export type Overlay =
  | { kind: 'gate'; onPass: () => void }
  | { kind: 'auth' }
  | { kind: 'help' }
  | null;

interface SessionValue {
  user: api.User | null;
  /** Grown-up account or a running Premium trial: unlocks voice, favourites and day/night. */
  isRegistered: boolean;
  /** Paid Premium (or a running trial): unlocks the extra pop groups. */
  hasPro: boolean;
  trial: { active: boolean; remainingMs: number; usedToday: number; max: number };
  theme: Theme;
  sound: boolean;
  overlay: Overlay;
  toast: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  toggleTrial: () => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  showToast: (message: string) => void;
  /** Shows the grown-up gate; runs `onPass` only once an adult solved it. */
  askParent: (onPass: () => void) => void;
  openAuth: () => void;
  openHelp: () => void;
  closeOverlay: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}

function initialTheme(): Theme {
  const stored = readString('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<api.User | null>(() =>
    api.getToken() ? readJSON<api.User | null>(api.USER_KEY, null) : null,
  );
  const [trial, setTrial] = useState<TrialData>(() => loadTrial());
  const [now, setNow] = useState(() => Date.now());
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [sound, setSound] = useState(isSoundOn);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<string | null>(null);

  const trialActive = isTrialActive(trial, now);

  useEffect(() => {
    if (!trialActive) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [trialActive]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeString('theme', theme);
  }, [theme]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 4500);
  }, []);

  const signOut = useCallback(() => {
    api.clearSession();
    setUser(null);
    queryClient.removeQueries();
  }, [queryClient]);

  useEffect(() => api.onUnauthorized(signOut), [signOut]);

  // Refresh the account (and its Premium flag) whenever the app opens with a session.
  const me = useQuery({
    queryKey: ['me'],
    queryFn: api.fetchMe,
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: false,
  });
  useEffect(() => {
    if (!me.data) return;
    setUser(me.data);
    const token = api.getToken();
    if (token) api.saveSession(token, me.data);
  }, [me.data]);

  const startSession = useCallback(
    (session: api.User & { token: string }) => {
      const { token, ...account } = session;
      api.saveSession(token, account);
      setUser(account);
      queryClient.invalidateQueries();
      showToast(`¡Bienvenida, ${account.name}!`);
    },
    [queryClient, showToast],
  );

  const value = useMemo<SessionValue>(() => {
    const remainingMs = Math.max(0, trial.activeUntil - now);
    return {
      user,
      isRegistered: Boolean(user) || trialActive,
      hasPro: Boolean(user?.premium) || trialActive,
      trial: { active: trialActive, remainingMs, usedToday: trial.count, max: MAX_TRIALS_PER_DAY },
      theme,
      sound,
      overlay,
      toast,
      signIn: async (email, password) => startSession(await api.signin(email, password)),
      signUp: async (email, password, name) =>
        startSession(await api.signup(email, password, name)),
      signOut,
      toggleTrial: () => {
        const current = loadTrial();
        if (isTrialActive(current)) {
          const stopped = stopTrial(current);
          saveTrial(stopped);
          setTrial(stopped);
          showToast('Premium de prueba desactivado');
          return;
        }
        const started = startTrial(current);
        if (!started) {
          showToast('Hoy ya usaste tus 3 pruebas. ¡Mañana hay más!');
          return;
        }
        saveTrial(started);
        setTrial(started);
        setNow(Date.now());
        showToast('¡Premium de prueba por 5 minutos!');
      },
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
      toggleSound: () => {
        const next = !isSoundOn();
        setSoundOn(next);
        setSound(next);
      },
      showToast,
      askParent: (onPass) => setOverlay({ kind: 'gate', onPass }),
      openAuth: () => setOverlay({ kind: 'gate', onPass: () => setOverlay({ kind: 'auth' }) }),
      openHelp: () => setOverlay({ kind: 'help' }),
      closeOverlay: () => setOverlay(null),
    };
  }, [
    user,
    trial,
    trialActive,
    now,
    theme,
    sound,
    overlay,
    toast,
    signOut,
    startSession,
    showToast,
  ]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
