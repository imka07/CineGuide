// src/components/FiltersPanel.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/tmdbProxy';

type Genre = { id: number; name: string };

const FiltersPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<number[]>(
    searchParams.getAll('genre').map(v => Number(v)).filter(v => !isNaN(v))
  );
  const [ratingGte, setRatingGte] = useState(
    Number(searchParams.get('ratingGte') ?? 0)
  );
  const [ratingLte, setRatingLte] = useState(
    Number(searchParams.get('ratingLte') ?? 10)
  );
  const [yearGte, setYearGte] = useState(
    Number(searchParams.get('yearGte') ?? 1990)
  );
  const [yearLte, setYearLte] = useState(
    Number(searchParams.get('yearLte') ?? new Date().getFullYear())
  );

  // Загрузка доступных жанров
  useEffect(() => {
    api
      .get<Genre[]>('/genre/movie/list')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setAvailableGenres(list);
      })
      .catch(err => {
        console.error('Failed to load genres:', err);
        setAvailableGenres([]);
      });
  }, []);

  // Обновление URL-параметров при изменении фильтров
  useEffect(() => {
    const params: Record<string, string | string[]> = {
      ratingGte: String(ratingGte),
      ratingLte: String(ratingLte),
      yearGte: String(yearGte),
      yearLte: String(yearLte),
    };
    if (selected.length) {
      params.genre = selected.map(String);
    }
    setSearchParams(params);
  }, [selected, ratingGte, ratingLte, yearGte, yearLte, setSearchParams]);

  const toggleGenre = (id: number) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <div className="filters-panel">
      {/* Жанры */}
      <div className="filter-group">
        <label>Жанры</label>
        <div className="genre-select">
          {availableGenres.length ? (
            availableGenres.map(g => (
              <div
                key={g.id}
                className={`genre-option ${selected.includes(g.id) ? 'selected' : ''}`}
                onClick={() => toggleGenre(g.id)}
              >
                {g.name}
              </div>
            ))
          ) : (
            <p>Загрузка жанров...</p>
          )}
        </div>
      </div>

      {/* Рейтинг */}
      <div className="filter-group">
        <label>Рейтинг</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="vk-input"
            type="number"
            value={ratingGte}
            min={0}
            max={10}
            step={0.1}
            onChange={e => setRatingGte(Number(e.target.value))}
          />
          <span>—</span>
          <input
            className="vk-input"
            type="number"
            value={ratingLte}
            min={0}
            max={10}
            step={0.1}
            onChange={e => setRatingLte(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Год */}
      <div className="filter-group">
        <label>Год</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="vk-input"
            type="number"
            value={yearGte}
            min={1900}
            max={new Date().getFullYear()}
            onChange={e => setYearGte(Number(e.target.value))}
          />
          <span>—</span>
          <input
            className="vk-input"
            type="number"
            value={yearLte}
            min={1900}
            max={new Date().getFullYear()}
            onChange={e => setYearLte(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
