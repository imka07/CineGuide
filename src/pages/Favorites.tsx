import React from 'react';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../context/FavoritesContext'; // импорт хука

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();

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
