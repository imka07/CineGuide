import { Link } from 'react-router-dom';

const Header = () => (
  <header className="app-header">
    <h1>CineGuide</h1>
    <nav className="flex gap-4">
      <Link to="/">Главная</Link>
      <Link to="/favorites">Избранное</Link> {/* 👈 эта ссылка */}
    </nav>
  </header>
);

export default Header;
