// src/components/InfiniteScroll.tsx
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/tmdbProxy';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types';
import { useSearchParams } from 'react-router-dom';

const InfiniteScroll: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const filters = {
    genre: searchParams.getAll('genre'),
    ratingGte: Number(searchParams.get('ratingGte') ?? 0),
    ratingLte: Number(searchParams.get('ratingLte') ?? 10),
    yearGte: Number(searchParams.get('yearGte') ?? 1990),
    yearLte: Number(searchParams.get('yearLte') ?? new Date().getFullYear()),
  };

  const fetchMovies = async () => {
    try {
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

      const { data } = await api.get('/discover/movie', { params });
      const results = Array.isArray(data.results) ? data.results : [];
      const newMovies: Movie[] = results.map((doc: any) => ({
        id: String(doc.id),
        title: doc.title || doc.name || 'Unknown',
        year: doc.release_date
          ? new Date(doc.release_date).getFullYear()
          : new Date().getFullYear(),
        rating: doc.vote_average,
        poster: doc.poster_path
          ? { url: `https://image.tmdb.org/t/p/w500${doc.poster_path}` }
          : null,
        genres: doc.genres?.map((g: any) => g.name) || [],
      }));

      setMovies(prev => {
        const existing = new Set(prev.map(m => m.id));
        const uniq = newMovies.filter(m => !existing.has(m.id));
        return [...prev, ...uniq];
      });

      setHasMore(data.total_pages ? page < data.total_pages : false);
    } catch (e) {
      console.error('fetchMovies error:', e);
    }
  };

  useEffect(() => {
    // сброс при изменении фильтров
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams.toString()]);

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
