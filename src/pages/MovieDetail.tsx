import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/kinopoisk';

interface MovieDetailData {
  id: string;
  name: string;
  year: number;
  rating: number;
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
        setMovie(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-detail-page">
      <h1>{movie.name}</h1>
      {movie.poster ? (
        <img src={movie.poster.url} alt={movie.name} />
      ) : (
        <div>No Image</div>
      )}
      <p>Рейтинг: {movie.rating.toFixed(1)}</p>
      <p>Дата: {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p>Год: {movie.year}</p>
      <div>
        <strong>Жанр:</strong> {movie.genres.join(', ')}
      </div>
      <div className="description">
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
