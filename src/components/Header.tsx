import { Link } from 'react-router-dom';

const Header = () => (
  <header className="app-header">
    <h1>CineGuide</h1>
    <nav className="">
      <Link to="/">Главная</Link>
      <Link to="/favorites">Избранное</Link>
    </nav>
  </header>
);

export default Header;
