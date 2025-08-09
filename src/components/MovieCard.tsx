import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { Movie } from '../types';
import '../styles/MovieCard.css';


const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleCardClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    console.log('🎬 Клик по карточке фильма:', movie.title);
    console.log('   ID фильма:', movie.id);
    console.log('   Тип ID:', typeof movie.id);
    console.log('   URL для навигации:', `/movie/${movie.id}`);
    
    // Проверяем, что ID не пустой
    if (!movie.id) {
      console.error('❌ Ошибка: ID фильма пустой!');
      return;
    }
    
    navigate(`/movie/${movie.id}`);
  }, [movie.id, movie.title, navigate]);

  const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  }, [movie, toggleFavorite]);

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="poster-container">
        {movie.poster?.url ? (
          <img src={movie.poster.url} alt={`Постер фильма «${movie.title}»`} className="poster" />
        ) : (
          <div className="no-poster">Без постера</div>
        )}
      </div>

      <div className="info">
        <h3 className="cursor-pointer">
          {movie.title}
        </h3>
        <p>{movie.year > 0 ? movie.year : '—'}</p>
        <p>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : '—'}</p>
      </div>

      <button
        onClick={handleFavoriteClick}
        className={`vk-button favorite-btn ${favorite ? 'active' : ''}`}
      >
        {favorite ? '★ Удалить из избранного' : '☆ В избранное'}
      </button>
    </div>
  );
};

export default React.memo(MovieCard);
