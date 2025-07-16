import axios from 'axios';
import { getClientId } from '../utils/auth';
import type { Movie } from '../types';

const clientId = getClientId();
const base = import.meta.env.VITE_PROXY_URL;

export const fetchFavorites = () =>
  axios.get<Movie[]>(`${base}/favorites/${clientId}`).then(r => r.data);

export const addFavorite = (movie: Movie) =>
  axios.post(`${base}/favorites/${clientId}`, movie);

export const removeFavorite = (movieId: string) =>
  axios.delete(`${base}/favorites/${clientId}/${movieId}`);
