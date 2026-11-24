import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import * as api from '../lib/api';
import { readJSON, writeJSON } from '../lib/storage';
import { useSession } from '../state/session';

type Key = string | number;

// Favourites live on the server for signed-in grown-ups and in this browser otherwise.
export function useFavorites<T extends Record<string, unknown>>(
  type: api.FavoriteType,
  keyOf: (item: T) => Key,
  localKey = `fav:${type}`,
) {
  const { user, showToast } = useSession();
  const queryClient = useQueryClient();
  const [local, setLocal] = useState<T[]>(() =>
    readJSON<unknown[]>(localKey, []).filter((i): i is T => Boolean(i) && typeof i === 'object'),
  );

  const remote = useQuery({
    queryKey: ['favorites'],
    queryFn: api.listFavorites,
    enabled: Boolean(user),
    staleTime: 30_000,
  });
  const remoteItems = useMemo(
    () => (remote.data ?? []).filter((f) => f.type === type),
    [remote.data, type],
  );

  const items = useMemo(
    () => (user ? remoteItems.map((f) => f.data as T) : local),
    [user, remoteItems, local],
  );

  const isFavorite = useCallback(
    (item: T) => items.some((i) => keyOf(i) === keyOf(item)),
    [items, keyOf],
  );

  const toggle = useCallback(
    async (item: T) => {
      const key = keyOf(item);
      if (user) {
        const existing = remoteItems.find((f) => keyOf(f.data as T) === key);
        try {
          if (existing) await api.deleteFavorite(existing._id);
          else await api.createFavorite(type, item);
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'No pudimos guardar tu favorito');
        } finally {
          await queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
        return;
      }
      setLocal((prev) => {
        const next = prev.some((i) => keyOf(i) === key)
          ? prev.filter((i) => keyOf(i) !== key)
          : [item, ...prev].slice(0, 50);
        writeJSON(localKey, next);
        return next;
      });
    },
    [keyOf, user, remoteItems, type, queryClient, showToast, localKey],
  );

  return { items, isFavorite, toggle };
}
