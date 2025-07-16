import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/kinopoisk';

interface MovieDetailData {
  id: string;
  name: string;
  year: number;
  rating: { kp: number } | null;
  description: string;
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
          id: data.id,
          name: data.name || data.title || 'Unknown',
          year: data.year ?? new Date(data.releaseDate).getFullYear(),
          rating: data.rating ? { kp: data.rating.kp } : null,
          description: data.description || data.descriptionFull || '',
          poster: data.poster || null,
          releaseDate: data.releaseDate,
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
      <h1>{movie.name}</h1>

      {movie.poster ? (
        <img src={movie.poster.url} alt={movie.name} />
      ) : (
        <div>No Image</div>
      )}

      <p>Рейтинг: {movie.rating ? movie.rating.kp.toFixed(1) : '—'}</p>
      <p>Дата: {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p>Год: {movie.year}</p>

      <div>
        <strong>Жанры:</strong> {movie.genres.join(', ')}
      </div>

      <div className="description">
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
