import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types';
import bridge from '@vkontakte/vk-bridge';

interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (movie: Movie) => void;
  reloadFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

async function saveFavoritesToVK(favorites: Movie[]) {
  try {
    await bridge.send('VKWebAppStorageSet', {
      key: 'favorites',
      value: JSON.stringify(favorites),
    });
  } catch (e) {
    console.error('VK Storage save error:', e);
  }
}

async function loadFavoritesFromVK(): Promise<Movie[]> {
  try {
    const res = await bridge.send('VKWebAppStorageGet', { keys: ['favorites'] });
    const value = res.keys?.[0]?.value;
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('VK Storage load error:', e);
    return [];
  }
}

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loaded, setLoaded] = useState(false); // Track if loaded from VK
  const isFirstLoad = useRef(true);

  // Load favorites on mount and when app/tab becomes visible
  const reloadFavorites = () => {
    loadFavoritesFromVK().then(favs => {
      setFavorites(favs);
      setLoaded(true);
    });
  };

  useEffect(() => {
    reloadFavorites();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        reloadFavorites();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Save to VK Storage whenever favorites change, but only after initial load
  useEffect(() => {
    if (!loaded) return;
    // Prevent saving immediately after first load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    saveFavoritesToVK(favorites);
  }, [favorites, loaded]);

  const isFavorite = (id: string) => favorites.some(m => m.id === id);

  const toggleFavorite = (movie: Movie) => {
    setFavorites(prev =>
      prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, reloadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
