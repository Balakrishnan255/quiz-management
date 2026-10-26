import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <label>Email<input type="email" required value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} /></label>
      <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      <p className="muted">No account? <Link to="/signup">Sign up</Link></p>
    </form>
  );
}
