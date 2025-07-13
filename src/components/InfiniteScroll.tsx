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
      page,
      limit: 50,
      year: `${filters.yearGte}-${filters.yearLte}`,
      'rating.kp': `${filters.ratingGte}-${filters.ratingLte}`,
    };
    filters.genre.forEach((g, idx) => {
      params[`genres.name[${idx}]`] = g;
    });

    const { data } = await api.get('/movie', { params });
    console.log('API response:', data);

    const newMovies: Movie[] = data.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.name || doc.title || 'Unknown',
      year: doc.year || new Date(doc.releaseDate).getFullYear(),
      rating: doc.rating ? { kp: doc.rating.kp } : null,
      poster: doc.poster || null,
    }));

    setMovies(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      const filtered = newMovies.filter(m => !existingIds.has(m.id));
      return [...prev, ...filtered];
    });

    setHasMore(page < data.pages);
  } catch (e) {
    console.error('API error:', e);
  }
};


  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchMovies();
  }, [page, searchParams.toString()]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
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
    <div>
      <div className="grid grid-cols-4 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {hasMore && <div ref={loader} className="loader">Загрузка...</div>}
    </div>
  );
};

export default InfiniteScroll;