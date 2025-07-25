
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';
import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);
