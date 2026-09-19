import { useCallback, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage';

// Small "recent searches" list persisted per feature.
export function useHistoryList(key: string, max = 8) {
  const [items, setItems] = useState<string[]>(() => readJSON<string[]>(key, []));

  const add = useCallback(
    (entry: string) => {
      const value = entry.trim();
      if (!value) return;
      setItems((prev) => {
        const next = [value, ...prev.filter((i) => i !== value)].slice(0, max);
        writeJSON(key, next);
        return next;
      });
    },
    [key, max],
  );

  return [items, add] as const;
}
