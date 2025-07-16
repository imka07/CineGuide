import React, { useEffect, useRef, useState } from 'react';
import api from '../api/kinopoisk';
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
      const params: any = {
        page, limit: 50,
        year: `${filters.yearGte}-${filters.yearLte}`,
        'rating.kp': `${filters.ratingGte}-${filters.ratingLte}`,
      };
      filters.genre.forEach((g, i) => {
        params[`genres.name[${i}]`] = g;
      });
      const { data } = await api.get('/movie', { params });
      const newMovies: Movie[] = data.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title || doc.name || 'Unknown',
        year: doc.year || new Date(doc.releaseDate).getFullYear(),
        rating: doc.rating ? { kp: doc.rating.kp } : null,
        poster: doc.poster || null,
        genres: doc.genres?.map((g: any) => g.name) || [],
      }));
      setMovies(prev => {
        const ids = new Set(prev.map(m => m.id));
        const uniq = newMovies.filter(m => !ids.has(m.id));
        return [...prev, ...uniq];
      });
      setHasMore(page < data.pages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMovies([]); setPage(1);
  }, [searchParams.toString()]);

  useEffect(() => { fetchMovies(); }, [page, searchParams.toString()]);

useEffect(() => {
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    },
    { threshold: 1 }
  );

  if (loader.current) {
    obs.observe(loader.current);
  }

  return () => {
    if (loader.current) {
      obs.unobserve(loader.current);
    }
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
        <div ref={loader} className="loading">Загрузка...</div>
      )}
    </>
  );
};

export default InfiniteScroll;
