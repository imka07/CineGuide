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
        <p>Нет избранных.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
