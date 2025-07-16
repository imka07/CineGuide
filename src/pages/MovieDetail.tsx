// src/pages/MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/tmdbProxy';


interface MovieDetailData {
  id: string;
  title: string;
  year: number;
  rating: number;
  overview: string;
  poster: { url: string } | null;
  releaseDate: string;
  genres: string[];
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/movie/${id}`);
        setMovie({
          id: String(data.id),
          title: data.title || data.name || 'Unknown',
          year: data.release_date
            ? new Date(data.release_date).getFullYear()
            : new Date().getFullYear(),
          rating: data.vote_average,
          overview: data.overview || '',
          poster: data.poster_path
            ? { url: `https://image.tmdb.org/t/p/w500${data.poster_path}` }
            : null,
          releaseDate: data.release_date,
          genres: data.genres?.map((g: any) => g.name) || [],
        });
      } catch (e) {
        console.error('API error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!movie) return <p>Фильм не найден.</p>;

  return (
    <div className="movie-detail-page">
      <h1>{movie.title}</h1>
      <div className="poster-container">
        {movie.poster ? (
          <img src={movie.poster.url} alt={`Постер фильма «${movie.title}»`} />
        ) : (
          <div>No Image</div>
        )}
      </div>
      <p>Рейтинг: {movie.rating.toFixed(1)}</p>
      <p>Дата: {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p>Год: {movie.year}</p>
      <div>
        <strong>Жанры:</strong> {movie.genres.join(', ')}
      </div>
      <div className="description">
        <p>{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
