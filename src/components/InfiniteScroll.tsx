import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/tmdbProxy';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types';

const InfiniteScroll: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  // Базовый URL прокси для картинок
  const proxyUrl = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000';

  // Собираем фильтры из query-параметров
  const filters = {
    genre: searchParams.getAll('genre'),
    ratingGte: Number(searchParams.get('ratingGte') ?? 0),
    ratingLte: Number(searchParams.get('ratingLte') ?? 10),
    yearGte: Number(searchParams.get('yearGte') ?? 1990),
    yearLte: Number(searchParams.get('yearLte') ?? new Date().getFullYear()),
  };

  // Функция загрузки фильмов
  const fetchMovies = async () => {
    try {
      // Параметры запроса к /discover/movie
      const params: Record<string, any> = {
        page,
        sort_by: 'popularity.desc',
        'vote_average.gte': filters.ratingGte,
        'vote_average.lte': filters.ratingLte,
        'primary_release_date.gte': `${filters.yearGte}-01-01`,
        'primary_release_date.lte': `${filters.yearLte}-12-31`,
      };
      if (filters.genre.length) {
        params.with_genres = filters.genre.join(',');
      }

      // Получаем данные
      const { data } = await api.get('/discover/movie', { params });
      const results = Array.isArray(data.results) ? data.results : [];

      // Мапим в нашу модель Movie
      const newMovies: Movie[] = results.map((doc: any) => ({
        id: String(doc.id),
        title: doc.title || doc.name || 'Unknown',
        year: doc.release_date
          ? new Date(doc.release_date).getFullYear()
          : new Date().getFullYear(),
        rating: doc.vote_average,
        // Теперь картинка идёт через прокси
        poster: doc.poster_path
          ? { url: `${proxyUrl}/image${doc.poster_path}` }
          : null,
        genres: doc.genres?.map((g: any) => g.name) || [],
      }));

      // Добавляем только уникальные фильмы
      setMovies(prev => {
        const existing = new Set(prev.map(m => m.id));
        const uniq = newMovies.filter(m => !existing.has(m.id));
        return [...prev, ...uniq];
      });

      // Определяем, есть ли ещё страницы
      setHasMore(typeof data.total_pages === 'number' ? page < data.total_pages : false);
    } catch (err) {
      console.error('fetchMovies error:', err);
    }
  };

  // При смене фильтров — сбрасываем список и пагинацию
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams.toString()]);

  // Загружаем при первой отрисовке и на смену page
  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams.toString()]);

  // Интерсекшн-обсервер для бесконечного скролла
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setPage(p => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore]);

  return (
    <>
      <div className="movie-list">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {hasMore && (
        <div ref={loader} className="loading">
          Загрузка...
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
