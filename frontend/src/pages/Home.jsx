import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <section className="hero">
      {/* 🚀 LIVE DEMO BADGE */}
      <div style={{
        background: '#2563eb',
        color: '#ffffff',
        padding: '6px 16px',
        borderRadius: '20px',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '15px'
      }}>
        ⚡ Automated Deployment v2.0 — Live Demo
      </div>

      <h1>Welcome to QuizHub</h1>
      <p>Take timed quizzes, see your score instantly, and track your history.</p>
      {user
        ? <Link className="btn" to={user.role === 'admin' ? '/admin' : '/dashboard'}>Go to Dashboard</Link>
        : <div className="row"><Link className="btn" to="/signup">Get Started</Link><Link className="btn-ghost" to="/login">Login</Link></div>}
    </section>
  );
}