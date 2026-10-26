import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <h1>Test your knowledge with QuizHub</h1>
      <p>Take timed quizzes, see your score instantly, and track your history.</p>
      {user
        ? <Link className="btn" to={user.role === 'admin' ? '/admin' : '/dashboard'}>Go to Dashboard</Link>
        : <div className="row"><Link className="btn" to="/signup">Get Started</Link><Link className="btn-ghost" to="/login">Login</Link></div>}
    </section>
  );
}
