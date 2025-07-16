import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { Movie } from '../types';


const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  return (
    <div className="movie-card">
      <div className="poster-container" onClick={() => navigate(`/movie/${movie.id}`)}>
        {movie.poster?.url ? (
          <img src={movie.poster.url}  alt={`Постер фильма «${movie.title}»`} className="poster" />
        ) : (
          <div className="no-poster">Без постера</div>
        )}
      </div>

      <div className="info">
        <h3 onClick={() => navigate(`/movie/${movie.id}`)} className="cursor-pointer">
          {movie.title}
        </h3>
        <p>{movie.year}</p>
        <p>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : '—'}</p>
      </div>

    <button
  onClick={() => toggleFavorite(movie)}
  className={`vk-button favorite-btn ${favorite ? 'active' : ''}`}
>
  {favorite ? '★ Удалить из избранного' : '☆ В избранное'}
</button>

    </div>
  );
};

export default MovieCard;
