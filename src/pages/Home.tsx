import React from 'react';
import FiltersPanel from '../components/FiltersPanel';
import InfiniteScroll from '../components/InfiniteScroll';

const Home: React.FC = () => (
  <div className="home-page">
    <h3>Личный гид по фильмам</h3>
    <FiltersPanel />
    <InfiniteScroll />
  </div>
);

export default Home;

