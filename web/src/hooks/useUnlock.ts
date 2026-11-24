import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSession } from '../state/session';

// Tapping something locked never dead-ends: kids are pointed to a grown-up,
// and only after the grown-up gate do we open the Premium page.
export function useUnlock() {
  const { askParent, showToast } = useSession();
  const navigate = useNavigate();

  return useCallback(() => {
    showToast('Esto es Premium. ¡Pídele a papá o mamá que te ayude!');
    askParent(() => navigate('/premium'));
  }, [askParent, showToast, navigate]);
}
