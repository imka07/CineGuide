import axios from 'axios';
console.log('TMDB proxy baseURL =', import.meta.env.VITE_PROXY_URL);
console.log('▶️ PROXY URL at runtime:', import.meta.env.VITE_PROXY_URL);

const BASE_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
