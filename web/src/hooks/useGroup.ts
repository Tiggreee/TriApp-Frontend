import { useSearchParams } from 'react-router';
import { GROUPS, type Group, getGroup } from '../data/groups';
import { useSession } from '../state/session';

// The active pop group comes from ?group=. Premium groups fall back to the free one until unlocked.
export function useGroup(): {
  group: Group;
  setGroup: (id: string) => void;
  canUse: (g: Group) => boolean;
} {
  const { hasPro } = useSession();
  const [params, setParams] = useSearchParams();
  const canUse = (g: Group) => g.free || hasPro;
  const requested = getGroup(params.get('group') ?? GROUPS[0]?.id);
  const group = canUse(requested) ? requested : (GROUPS.find((g) => g.free) ?? requested);

  return {
    group,
    canUse,
    setGroup: (id) => setParams({ group: id }, { replace: true }),
  };
}
