import { useEffect, useState } from 'react';
import { loadList, addHistory, toggleFavorite } from '../utils/searchUtils';

export function useFeatureHistory(historyKey, favKey, idGetter) {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setHistory(loadList(historyKey));
    setFavorites(loadList(favKey));
  }, [historyKey, favKey]);

  const addToHistory = (query) => {
    const updated = addHistory(historyKey, query);
    setHistory(updated);
  };

  const toggleFav = (item) => {
    const updated = toggleFavorite(favKey, item, idGetter);
    setFavorites(updated);
  };

  const isFavorite = (item) => {
    if (!idGetter) return false;
    const id = idGetter(item);
    return favorites.some((f) => idGetter(f) === id);
  };

  return {
    history,
    favorites,
    addToHistory,
    toggleFav,
    isFavorite,
  };
}
