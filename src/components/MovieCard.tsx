import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Movie {
  id: string;
  name: string;
  year: number;
  rating: { kp: number } | null;
  poster: { url: string } | null;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const navigate = useNavigate();
  const kpRating = movie.rating?.kp;
  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      {movie.poster ? (
        <img src={movie.poster.url} alt={movie.name} />
      ) : (
        <div className="no-poster">No Image</div>
      )}
      <h3>{movie.name}</h3>
      <p>{movie.year}</p>
      <p>{kpRating != null ? kpRating.toFixed(1) : '—'}</p>
    </div>
  );
};

export default MovieCard;