import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

export default function History() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get('/results/my').then(r => setRows(r.data)); }, []);
  if (!rows) return <Loader />;
  return (
    <section>
      <h2>My Quiz History</h2>
      {!rows.length && <p className="muted">No attempts yet.</p>}
      <table className="table">
        <thead><tr><th>Quiz</th><th>Score</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.attempt_id}>
              <td>{r.title}</td>
              <td>{r.score} / {r.total_questions}</td>
              <td>{new Date(r.attempted_at).toLocaleString()}</td>
              <td><Link to={`/result/${r.attempt_id}`}>Review</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
