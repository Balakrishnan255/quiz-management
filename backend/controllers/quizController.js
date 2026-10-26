const db = require('../config/db');

exports.list = async (_req, res) => {
  const [rows] = await db.query(`
    SELECT q.*, u.name AS creator_name,
      (SELECT COUNT(*) FROM questions WHERE quiz_id = q.quiz_id) AS question_count
    FROM quizzes q JOIN users u ON u.user_id = q.created_by
    ORDER BY q.created_at DESC
  `);
  res.json(rows);
};

exports.get = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM quizzes WHERE quiz_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { title, description, timer_minutes } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  const [r] = await db.query(
    'INSERT INTO quizzes (title, description, timer_minutes, created_by) VALUES (?,?,?,?)',
    [title, description || '', timer_minutes || 10, req.user.user_id]
  );
  res.status(201).json({ quiz_id: r.insertId });
};

exports.update = async (req, res) => {
  const { title, description, timer_minutes } = req.body;
  await db.query(
    'UPDATE quizzes SET title=?, description=?, timer_minutes=? WHERE quiz_id=?',
    [title, description, timer_minutes, req.params.id]
  );
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM quizzes WHERE quiz_id = ?', [req.params.id]);
  res.json({ ok: true });
};
