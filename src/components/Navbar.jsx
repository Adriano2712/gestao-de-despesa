import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined;
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Gestão de Despesas</span>
      <div className="navbar-links">
        <NavLink to="/" end className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/categorias" className={navLinkClass}>
          Categorias
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <button onClick={handleLogout} className="btn btn-ghost btn-icon">
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
