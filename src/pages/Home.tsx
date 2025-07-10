import React from 'react';
import FiltersPanel from '../components/FiltersPanel';
import InfiniteScroll from '../components/InfiniteScroll';

const Home: React.FC = () => (
  <div className="home-page">
    <h1>Личный гид по фильмам</h1>
    <FiltersPanel />
    <InfiniteScroll />
  </div>
);

export default Home;

