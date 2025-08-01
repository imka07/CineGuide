import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../api/tmdbProxy';
import { isContentSafe, logBlockedContent } from '../utils/contentFilter';


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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎬 MovieDetail: получен ID из URL:', id);
    console.log('   Тип ID:', typeof id);
    
    if (!id) {
      console.error('❌ Ошибка: ID фильма не найден в URL');
      setError('ID фильма не найден');
      setLoading(false);
      return;
    }

    console.log('✅ Загрузка деталей фильма с ID:', id);

    const proxy = import.meta.env.VITE_PROXY_URL;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await api.get(`/movie/${id}`);
        
        if (!data || !data.id) {
          throw new Error('Данные фильма не найдены');
        }
        
        console.log('Получены данные фильма:', data.title);
        console.log('   Полные данные от API:', data);
        
        const movieData = {
          id: String(data.id),
          title: data.title || data.name || 'Unknown',
          year: data.release_date
            ? new Date(data.release_date).getFullYear()
            : new Date().getFullYear(),
          rating: data.vote_average || 0,
          overview: data.overview || '',
          poster: data.poster_path
            ? { url: `${proxy}/image${data.poster_path}` }
            : null,
          releaseDate: data.release_date || '',
          genres: data.genres?.map((g: any) => g.name) || [],
        };
        
        console.log('   Обработанные данные фильма:', movieData);
        setMovie(movieData);
      } catch (e) {
        console.error('API error:', e);
        setError('Ошибка загрузки фильма');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [id]);


  if (loading) return <p className="loading">Загрузка...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="not-found">Фильм не найден.</p>;

  console.log('Рендеринг деталей фильма:', movie.title);

  // Проверяем безопасность контента
  const isSafe = isContentSafe({
    ...movie,
    overview: movie.overview
  });
  
  console.log('🔍 Проверка безопасности фильма:', movie.title);
  console.log('   Рейтинг:', movie.rating, 'Год:', movie.year, 'Жанры:', movie.genres);
  console.log('   Результат проверки:', isSafe ? '✅ БЕЗОПАСЕН' : '❌ ЗАБЛОКИРОВАН');
  
  if (!isSafe) {
    logBlockedContent(movie, 'Доступ к фильму заблокирован');
    return <Navigate to="/" replace />;
  }

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
