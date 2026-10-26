const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be 6+ chars' });

    const [exists] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, email, hash, 'user']
    );
    const user = { user_id: result.insertId, name, email, role: 'user' };
    res.status(201).json({ user, token: signToken(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const safe = { user_id: user.user_id, name: user.name, email: user.email, role: user.role };
    res.json({ user: safe, token: signToken(safe) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.me = async (req, res) => {
  const [rows] = await db.query(
    'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
    [req.user.user_id]
  );
  res.json(rows[0] || null);
};
