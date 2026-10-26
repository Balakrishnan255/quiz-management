import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

export default function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes').then(r => setQuizzes(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = quizzes.filter(x => x.title.toLowerCase().includes(q.toLowerCase()));

  if (loading) return <Loader />;
  return (
    <section>
      <h2>Available Quizzes</h2>
      <input className="search" placeholder="Search quizzes…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid">
        {filtered.map(quiz => (
          <div key={quiz.quiz_id} className="card">
            <h3>{quiz.title}</h3>
            <p className="muted">{quiz.description}</p>
            <div className="meta">⏱ {quiz.timer_minutes} min · {quiz.question_count} questions</div>
            <Link className="btn" to={`/quiz/${quiz.quiz_id}`}>Start Quiz</Link>
          </div>
        ))}
        {!filtered.length && <p className="muted">No quizzes found.</p>}
      </div>
    </section>
  );
}
