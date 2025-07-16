import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favorites';


interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (movie: Movie) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    fetchFavorites()
      .then(setFavorites)
      .catch(console.error);
  }, []);

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
