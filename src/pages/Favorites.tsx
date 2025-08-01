import React from 'react';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../context/FavoritesContext'; // импорт хука
import { filterSafeContent } from '../utils/contentFilter';

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();
  
  // Фильтруем избранные фильмы согласно правилам ВК
  const safeFavorites = filterSafeContent(favorites);

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>
      {safeFavorites.length === 0 ? (
        <p className="not-found">Нет избранных.</p>
      ) : (
        <div className="movie-list">
          {safeFavorites.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
