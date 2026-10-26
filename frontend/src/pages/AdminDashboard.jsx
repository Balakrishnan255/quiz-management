import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', timer_minutes: 10 });

  const load = async () => {
    const [s, q, u, a] = await Promise.all([
      api.get('/users/stats'), api.get('/quizzes'),
      api.get('/users'), api.get('/results/all'),
    ]);
    setStats(s.data); setQuizzes(q.data); setUsers(u.data); setAttempts(a.data);
  };
  useEffect(() => { load(); }, []);

  const createQuiz = async (e) => {
    e.preventDefault();
    await api.post('/quizzes', form);
    setForm({ title: '', description: '', timer_minutes: 10 });
    load();
  };

  const removeQuiz = async (id) => {
    if (!confirm('Delete quiz and all its questions?')) return;
    await api.delete(`/quizzes/${id}`); load();
  };

  if (!stats) return <Loader />;
  return (
    <section>
      <h2>Admin Dashboard</h2>
      <div className="stats">
        <div className="card stat"><span>{stats.users}</span><p>Users</p></div>
        <div className="card stat"><span>{stats.quizzes}</span><p>Quizzes</p></div>
        <div className="card stat"><span>{stats.attempts}</span><p>Attempts</p></div>
      </div>

      <h3>Create Quiz</h3>
      <form className="card form" onSubmit={createQuiz}>
        <label>Title<input required value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        <label>Description<textarea value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <label>Timer (minutes)<input type="number" min="1" required value={form.timer_minutes}
          onChange={e => setForm({ ...form, timer_minutes: Number(e.target.value) })} /></label>
        <button className="btn">Create</button>
      </form>

      <h3>Quizzes</h3>
      <table className="table">
        <thead><tr><th>Title</th><th>Timer</th><th>Questions</th><th></th></tr></thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q.quiz_id}>
              <td>{q.title}</td>
              <td>{q.timer_minutes} min</td>
              <td>{q.question_count}</td>
              <td>
                <Link to={`/admin/quiz/${q.quiz_id}/questions`}>Manage</Link>
                {' · '}
                <button className="link-btn" onClick={() => removeQuiz(q.quiz_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Users</h3>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Attempts</h3>
      <table className="table">
        <thead><tr><th>User</th><th>Quiz</th><th>Score</th><th>Date</th></tr></thead>
        <tbody>
          {attempts.map(a => (
            <tr key={a.attempt_id}>
              <td>{a.user_name}</td><td>{a.title}</td>
              <td>{a.score}/{a.total_questions}</td>
              <td>{new Date(a.attempted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
