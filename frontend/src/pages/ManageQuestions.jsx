import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import Loader from '../components/Loader';

const empty = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' };

export default function ManageQuestions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => api.get(`/questions/quiz/${id}`).then(r => setQuestions(r.data));
  useEffect(() => { load(); }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/questions/${editId}`, form);
    else await api.post('/questions', { ...form, quiz_id: Number(id) });
    setForm(empty); setEditId(null); load();
  };

  const edit = (q) => {
    setEditId(q.question_id);
    setForm({
      question_text: q.question_text,
      option_a: q.option_a, option_b: q.option_b,
      option_c: q.option_c, option_d: q.option_d,
      correct_option: q.correct_option,
    });
  };

  const remove = async (qid) => {
    if (!confirm('Delete question?')) return;
    await api.delete(`/questions/${qid}`); load();
  };

  if (!questions) return <Loader />;
  return (
    <section>
      <Link to="/admin">← Back</Link>
      <h2>Manage Questions</h2>

      <form className="card form" onSubmit={save}>
        <h3>{editId ? 'Edit Question' : 'Add Question'}</h3>
        <label>Question<textarea required value={form.question_text}
          onChange={e => setForm({ ...form, question_text: e.target.value })} /></label>
        {['a','b','c','d'].map(o => (
          <label key={o}>Option {o.toUpperCase()}
            <input required value={form[`option_${o}`]}
              onChange={e => setForm({ ...form, [`option_${o}`]: e.target.value })} />
          </label>
        ))}
        <label>Correct Option
          <select value={form.correct_option}
            onChange={e => setForm({ ...form, correct_option: e.target.value })}>
            <option>A</option><option>B</option><option>C</option><option>D</option>
          </select>
        </label>
        <div className="row">
          <button className="btn">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn-ghost"
            onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <h3>Questions ({questions.length})</h3>
      {questions.map((q, i) => (
        <div key={q.question_id} className="card">
          <b>Q{i + 1}.</b> {q.question_text}
          <div className="muted">Correct: {q.correct_option}</div>
          <div className="row">
            <button className="btn-ghost" onClick={() => edit(q)}>Edit</button>
            <button className="link-btn" onClick={() => remove(q.question_id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}
