const db = require('../config/db');

exports.list = async (_req, res) => {
  const [rows] = await db.query(
    'SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(rows);
};

exports.stats = async (_req, res) => {
  const [[users]] = await db.query("SELECT COUNT(*) c FROM users WHERE role='user'");
  const [[quizzes]] = await db.query('SELECT COUNT(*) c FROM quizzes');
  const [[attempts]] = await db.query('SELECT COUNT(*) c FROM quiz_attempts');
  res.json({ users: users.c, quizzes: quizzes.c, attempts: attempts.c });
};
