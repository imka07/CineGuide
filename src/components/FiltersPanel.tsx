import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const genresList = [
'Боевик', 'Комедия', 'Драма', 'Ужасы', 'Научная фантастика', 'Триллер', 'Мелодрама',

];

const FiltersPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<string[]>(searchParams.getAll('genre'));
  const [ratingGte, setRatingGte] = useState(Number(searchParams.get('ratingGte') ?? 0));
  const [ratingLte, setRatingLte] = useState(Number(searchParams.get('ratingLte') ?? 10));
  const [yearGte, setYearGte] = useState(Number(searchParams.get('yearGte') ?? 1990));
  const [yearLte, setYearLte] = useState(Number(searchParams.get('yearLte') ?? new Date().getFullYear()));

  const applyFilters = () => {
    const params: Record<string, any> = {};
    params.ratingGte = ratingGte.toString();
    params.ratingLte = ratingLte.toString();
    params.yearGte = yearGte.toString();
    params.yearLte = yearLte.toString();
    setSearchParams(params);
  };

  useEffect(() => {
    applyFilters();
  }, [genres, ratingGte, ratingLte, yearGte, yearLte]);

  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label>Жанр:</label>
        <select multiple value={genres} onChange={e => setGenres(
            Array.from(e.target.selectedOptions, opt => opt.value)
          )
        }>
          {genresList.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Рейтинг:</label>
        <input type="number" value={ratingGte} min={0} max={10} step={0.1}
          onChange={e => setRatingGte(Number(e.target.value))} />
        <input type="number" value={ratingLte} min={0} max={10} step={0.1}
          onChange={e => setRatingLte(Number(e.target.value))} />
      </div>

      <div className="filter-group">
        <label>Год:</label>
        <input type="number" value={yearGte} min={1990} max={new Date().getFullYear()}
          onChange={e => setYearGte(Number(e.target.value))} />
        <input type="number" value={yearLte} min={1990} max={new Date().getFullYear()}
          onChange={e => setYearLte(Number(e.target.value))} />
      </div>
    </div>
  );
};

export default FiltersPanel;