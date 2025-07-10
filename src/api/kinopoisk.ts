import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4',
  headers: {
    'X-API-KEY': import.meta.env.VITE_KP_API_KEY,
  },
});

console.log('KP API Key:', import.meta.env.VITE_KP_API_KEY);

export default api;