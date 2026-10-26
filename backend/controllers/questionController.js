const db = require('../config/db');

// Randomized list for taking the quiz; admins still get the same shape.
exports.byQuiz = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM questions WHERE quiz_id = ? ORDER BY RAND()',
    [req.params.quizId]
  );
  res.json(rows);
};

exports.create = async (req, res) => {
  const { quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  if (!['A','B','C','D'].includes(correct_option)) {
    return res.status(400).json({ message: 'correct_option must be A/B/C/D' });
  }
  const [r] = await db.query(
    `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option)
     VALUES (?,?,?,?,?,?,?)`,
    [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option]
  );
  res.status(201).json({ question_id: r.insertId });
};

exports.update = async (req, res) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  await db.query(
    `UPDATE questions SET question_text=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=?
     WHERE question_id=?`,
    [question_text, option_a, option_b, option_c, option_d, correct_option, req.params.id]
  );
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM questions WHERE question_id = ?', [req.params.id]);
  res.json({ ok: true });
};
