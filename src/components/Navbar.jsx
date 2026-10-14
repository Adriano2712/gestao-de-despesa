import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <Link to="/">Dashboard</Link>
        <Link to="/categorias">Categorias</Link>
      </div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
