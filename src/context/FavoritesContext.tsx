import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types';
import { addFavorite, removeFavorite } from '../api/favorites';
import bridge from '@vkontakte/vk-bridge';


interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (movie: Movie) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export async function saveFavoritesToVK(favorites: Movie[]) {
  try {
    await bridge.send('VKWebAppStorageSet', {
      key: 'favorites',
      value: JSON.stringify(favorites),
    });
  } catch (e) {
    console.error('VK Storage save error:', e);
  }
}

export async function loadFavoritesFromVK(): Promise<Movie[] | undefined> {
  try {
    const res = await bridge.send('VKWebAppStorageGet', { keys: ['favorites'] });
    const value = res.keys?.[0]?.value;
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('VK Storage load error:', e);
    return undefined;
  }
}

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    loadFavoritesFromVK().then((vkFavs: Movie[] | undefined) => {
      if (vkFavs) setFavorites(vkFavs);
    });
  }, []);

  useEffect(() => {
    saveFavoritesToVK(favorites);
  }, [favorites]);

  const isFavorite = (id: string) => favorites.some(m => m.id === id);

  const toggleFavorite = async (movie: Movie) => {
    if (isFavorite(movie.id)) {
      try {
        await removeFavorite(movie.id);
        setFavorites(prev => prev.filter(m => m.id !== movie.id));
      } catch (e) {
        console.error('Ошибка при удалении из избранного:', e);
      }
    } else {
      try {
        await addFavorite(movie);
        setFavorites(prev => [...prev, movie]);
      } catch (e) {
        console.error('Ошибка при добавлении в избранное:', e);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
