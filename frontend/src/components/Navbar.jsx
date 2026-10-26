import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="brand">🧠 QuizHub</Link>
      <nav>
        {!user && <><Link to="/login">Login</Link><Link to="/signup">Signup</Link></>}
        {user && user.role === 'user' && (
          <><Link to="/dashboard">Dashboard</Link><Link to="/history">History</Link></>
        )}
        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user && (
          <>
            <span className="user-chip">{user.name}</span>
            <button className="btn-ghost" onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
