import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>
      {favorites.length === 0 ? (
        <p className="not-found">Нет избранных.</p>
      ) : (
        <div className="movie-list">
          {favorites.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
