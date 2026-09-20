import { lazy, type ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Shell } from './components/Shell';
import { MAKEUP, MAKEUP_CATEGORIES } from './data/makeup';
import { TIPS, TIPS_CATEGORIES } from './data/tips';
import Home from './pages/Home';
import { useSession } from './state/session';

const Music = lazy(() => import('./pages/Music'));
const Colors = lazy(() => import('./pages/Colors'));
const Avatar = lazy(() => import('./pages/Avatar'));
const Games = lazy(() => import('./pages/Games'));
const RunnerGame = lazy(() => import('./pages/RunnerGame'));
const PatternGame = lazy(() => import('./pages/PatternGame'));
const RhythmGame = lazy(() => import('./pages/RhythmGame'));
const MemoryGame = lazy(() => import('./pages/MemoryGame'));
const DanceGame = lazy(() => import('./pages/DanceGame'));
const Premium = lazy(() => import('./pages/Premium'));
const ContentBrowser = lazy(() => import('./pages/ContentBrowser'));

// Brillos and Consejos stay behind a grown-up account, as before.
function RequireAccount({ children }: { children: ReactNode }) {
  const { user } = useSession();
  return user ? children : <Navigate to="/" replace />;
}

export function App() {
  return (
    <Suspense fallback={<p className="status page">Cargando…</p>}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="music" element={<Music />} />
          <Route path="colors" element={<Colors />} />
          <Route path="avatar" element={<Avatar />} />
          <Route path="games" element={<Games />} />
          <Route path="games/run" element={<RunnerGame />} />
          <Route path="games/rhythm" element={<RhythmGame />} />
          <Route path="games/memory" element={<MemoryGame />} />
          <Route path="games/dance" element={<DanceGame />} />
          <Route path="games/pattern" element={<PatternGame />} />
          <Route path="premium" element={<Premium />} />
          <Route
            path="makeup"
            element={
              <RequireAccount>
                <ContentBrowser
                  icon="sparkle"
                  tone="pink"
                  title="Brillos"
                  subtitle="Tutoriales de maquillaje mágico"
                  placeholder="Busca tutoriales…"
                  type="makeup"
                  categories={MAKEUP_CATEGORIES}
                  items={MAKEUP}
                />
              </RequireAccount>
            }
          />
          <Route
            path="consejos"
            element={
              <RequireAccount>
                <ContentBrowser
                  icon="bulb"
                  tone="blue"
                  title="Consejos"
                  subtitle="Ideas para brillar cada día"
                  placeholder="Busca consejos…"
                  type="consejos"
                  categories={TIPS_CATEGORIES}
                  items={TIPS}
                />
              </RequireAccount>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
