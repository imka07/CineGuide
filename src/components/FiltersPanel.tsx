import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const genresList = [
  'Боевик', 'Комедия', 'Драма', 'Ужасы',
  'Научная фантастика', 'Триллер', 'Мелодрама',
];

const FiltersPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<string[]>(searchParams.getAll('genre'));
  const [ratingGte, setRatingGte] = useState(Number(searchParams.get('ratingGte') ?? 0));
  const [ratingLte, setRatingLte] = useState(Number(searchParams.get('ratingLte') ?? 10));
  const [yearGte, setYearGte] = useState(Number(searchParams.get('yearGte') ?? 1990));
  const [yearLte, setYearLte] = useState(Number(searchParams.get('yearLte') ?? new Date().getFullYear()));

const applyFilters = () => {

  const params: Record<string, string | string[]> = {};

  if (genres.length) {
    params.genre = genres;           
  }
  params.ratingGte = String(ratingGte);
  params.ratingLte = String(ratingLte);
  params.yearGte = String(yearGte);
  params.yearLte = String(yearLte);

  setSearchParams(params);
};


  useEffect(() => { applyFilters(); }, [genres, ratingGte, ratingLte, yearGte, yearLte]);

  const toggleGenre = (g: string) =>
    setGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );

  return (
    <div className="filters-panel">
      {/* Жанры */}
      <div className="filter-group">
        <label>Жанры</label>
        <div className="genre-select">
          {genresList.map(g => (
            <div
              key={g}
              className={`genre-option ${genres.includes(g) ? 'selected' : ''}`}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </div>
          ))}
        </div>
      </div>

      {/* Рейтинг */}
      <div className="filter-group">
        <label>Рейтинг</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="vk-input"
            type="number" value={ratingGte}
            min={0} max={10} step={0.1}
            onChange={e => setRatingGte(Number(e.target.value))}
          />
          <span>—</span>
          <input
            className="vk-input"
            type="number" value={ratingLte}
            min={0} max={10} step={0.1}
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
            type="number" value={yearGte}
            min={1990} max={new Date().getFullYear()}
            onChange={e => setYearGte(Number(e.target.value))}
          />
          <span>—</span>
          <input
            className="vk-input"
            type="number" value={yearLte}
            min={1990} max={new Date().getFullYear()}
            onChange={e => setYearLte(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
