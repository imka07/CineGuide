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
  const proxy = import.meta.env.VITE_PROXY_URL;
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
          ? { url: `${proxy}/image${data.poster_path}` }
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


  if (loading) return <p className="loading">Загрузка...</p>;
  if (!movie) return <p className="not-found">Фильм не найден.</p>;

  return (
    <div className="movie-detail-page">
      <h1>{movie.title}</h1>
      <div className="movie-detail-content">
        <div className="poster-container">
          {movie.poster ? (
            <img src={movie.poster.url} alt={`Постер фильма «${movie.title}»`} />
          ) : (
            <div className="no-poster">No Image</div>
          )}
        </div>

        <div className="movie-detail-info">
          <p><strong>Рейтинг:</strong> {movie.rating.toFixed(1)}</p>
          <p><strong>Дата выхода:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p><strong>Год:</strong> {movie.year}</p>

          <div className="genres">
            {movie.genres.map(g => (
              <span key={g}>{g}</span>
            ))}
          </div>

          <div className="description">
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
