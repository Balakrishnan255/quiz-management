const db = require('../config/db');

/**
 * POST /api/results/submit
 * body: { quiz_id, answers: [{ question_id, selected_option }] }
 */
exports.submit = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { quiz_id, answers = [] } = req.body;
    const userId = req.user.user_id;

    const [qs] = await conn.query('SELECT question_id, correct_option FROM questions WHERE quiz_id = ?', [quiz_id]);
    const correctMap = new Map(qs.map(q => [q.question_id, q.correct_option]));

    let score = 0;
    const graded = answers.map(a => {
      const ok = correctMap.get(a.question_id) === a.selected_option;
      if (ok) score++;
      return { ...a, is_correct: ok ? 1 : 0 };
    });

    await conn.beginTransaction();
    const [att] = await conn.query(
      'INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions) VALUES (?,?,?,?)',
      [userId, quiz_id, score, qs.length]
    );
    const attemptId = att.insertId;

    if (graded.length) {
      const values = graded.map(g => [attemptId, g.question_id, g.selected_option || null, g.is_correct]);
      await conn.query(
        'INSERT INTO user_answers (attempt_id, question_id, selected_option, is_correct) VALUES ?',
        [values]
      );
    }
    await conn.commit();
    res.status(201).json({ attempt_id: attemptId, score, total: qs.length });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ message: e.message });
  } finally {
    conn.release();
  }
};

exports.myHistory = async (req, res) => {
  const [rows] = await db.query(`
    SELECT a.*, q.title FROM quiz_attempts a
    JOIN quizzes q ON q.quiz_id = a.quiz_id
    WHERE a.user_id = ? ORDER BY a.attempted_at DESC
  `, [req.user.user_id]);
  res.json(rows);
};

exports.attemptDetail = async (req, res) => {
  const [[attempt]] = await db.query('SELECT * FROM quiz_attempts WHERE attempt_id = ?', [req.params.id]);
  if (!attempt) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && attempt.user_id !== req.user.user_id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const [answers] = await db.query(`
    SELECT ua.*, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option
    FROM user_answers ua JOIN questions q ON q.question_id = ua.question_id
    WHERE ua.attempt_id = ?
  `, [req.params.id]);
  res.json({ attempt, answers });
};

exports.all = async (_req, res) => {
  const [rows] = await db.query(`
    SELECT a.*, u.name AS user_name, u.email, q.title
    FROM quiz_attempts a
    JOIN users u ON u.user_id = a.user_id
    JOIN quizzes q ON q.quiz_id = a.quiz_id
    ORDER BY a.attempted_at DESC
  `);
  res.json(rows);
};
