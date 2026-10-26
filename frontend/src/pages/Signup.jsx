import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters');
    setLoading(true);
    try { await signup(form.name, form.email, form.password); nav('/dashboard'); }
    catch (e) { setErr(e.response?.data?.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Create account</h2>
      {err && <div className="error">{err}</div>}
      <label>Name<input required value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input type="email" required value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} /></label>
      <button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
