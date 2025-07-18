import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <Router>
      <header className="app-header">
        <h1 className="app-title">CineGuide</h1>
        <nav className="nav-links">
          <Link to="/">Главная</Link>
          <Link to="/favorites">Избранное</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;  
